import * as THREE from 'three'
import { getBiome } from './planetBiomes'

function hashSeed(seed) {
  if (typeof seed === 'number') return seed || 1
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return hash || 1
}

function createRng(seed) {
  let state = hashSeed(seed)
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

function clamp255(value) {
  return value < 0 ? 0 : value > 255 ? 255 : value
}

function generateBlotchField(rand, size, count, radiusRange) {
  const blotches = []
  for (let i = 0; i < count; i += 1) {
    blotches.push({
      x: rand() * size,
      y: rand() * size,
      radius: size * (radiusRange[0] + rand() * (radiusRange[1] - radiusRange[0])),
      strength: 0.4 + rand() * 0.6,
      toneT: rand(),
    })
  }
  return blotches
}

function renderColorLayer({ size, base, lighter, darker, accent, water, blotches, rand, biome }) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const backdrop = biome.oceanMode ? water : darker
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, `#${lighter.getHexString()}`)
  gradient.addColorStop(0.5, `#${base.getHexString()}`)
  gradient.addColorStop(1, `#${backdrop.getHexString()}`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  blotches.forEach((blotch) => {
    if (biome.oceanMode && blotch.strength < 0.55) return
    const tone = blotch.toneT > 0.5 ? accent : biome.oceanMode ? lighter : darker
    const alpha = 0.06 + blotch.strength * 0.16
    const grad = ctx.createRadialGradient(blotch.x, blotch.y, 0, blotch.x, blotch.y, blotch.radius)
    grad.addColorStop(
      0,
      `rgba(${Math.round(tone.r * 255)}, ${Math.round(tone.g * 255)}, ${Math.round(tone.b * 255)}, ${alpha})`,
    )
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(blotch.x, blotch.y, blotch.radius, 0, Math.PI * 2)
    ctx.fill()
  })

  const speckleCount = 900
  for (let i = 0; i < speckleCount; i += 1) {
    const x = rand() * size
    const y = rand() * size
    const shade = rand() > 0.5 ? 255 : 0
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${0.02 + rand() * 0.035})`
    ctx.fillRect(x, y, 1.4, 1.4)
  }

  return canvas
}

function renderHeightLayer({ size, blotches, rand, contrast }) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#383838'
  ctx.fillRect(0, 0, size, size)

  ctx.globalCompositeOperation = 'lighter'
  blotches.forEach((blotch) => {
    const peak = Math.round(90 * blotch.strength * contrast)
    const grad = ctx.createRadialGradient(blotch.x, blotch.y, 0, blotch.x, blotch.y, blotch.radius)
    grad.addColorStop(0, `rgba(${peak}, ${peak}, ${peak}, 0.9)`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(blotch.x, blotch.y, blotch.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalCompositeOperation = 'source-over'

  const grainCount = 1600
  const grainImage = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < grainCount; i += 1) {
    const x = Math.floor(rand() * size)
    const y = Math.floor(rand() * size)
    const idx = (y * size + x) * 4
    const delta = (rand() - 0.5) * 44
    grainImage.data[idx] = clamp255(grainImage.data[idx] + delta)
    grainImage.data[idx + 1] = clamp255(grainImage.data[idx + 1] + delta)
    grainImage.data[idx + 2] = clamp255(grainImage.data[idx + 2] + delta)
  }
  ctx.putImageData(grainImage, 0, 0)

  return canvas
}

function heightToNormalMap(heightCanvas, size, strength) {
  const ctx = heightCanvas.getContext('2d', { willReadFrequently: true })
  const src = ctx.getImageData(0, 0, size, size).data

  const outCanvas = document.createElement('canvas')
  outCanvas.width = size
  outCanvas.height = size
  const outCtx = outCanvas.getContext('2d')
  const dst = outCtx.createImageData(size, size)

  const heightAt = (x, y) => {
    const cx = (x + size) % size
    const cy = (y + size) % size
    return src[(cy * size + cx) * 4] / 255
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (heightAt(x - 1, y) - heightAt(x + 1, y)) * strength
      const dy = (heightAt(x, y - 1) - heightAt(x, y + 1)) * strength
      const len = Math.sqrt(dx * dx + dy * dy + 1)
      const idx = (y * size + x) * 4
      dst.data[idx] = Math.round((dx / len) * 0.5 * 255 + 127.5)
      dst.data[idx + 1] = Math.round((dy / len) * 0.5 * 255 + 127.5)
      dst.data[idx + 2] = Math.round((1 / len) * 0.5 * 255 + 127.5)
      dst.data[idx + 3] = 255
    }
  }

  outCtx.putImageData(dst, 0, 0)
  return outCanvas
}

function renderEmissiveCracks(heightCanvas, size, glowColor) {
  const ctx = heightCanvas.getContext('2d', { willReadFrequently: true })
  const src = ctx.getImageData(0, 0, size, size).data

  const outCanvas = document.createElement('canvas')
  outCanvas.width = size
  outCanvas.height = size
  const outCtx = outCanvas.getContext('2d')
  outCtx.fillStyle = '#000000'
  outCtx.fillRect(0, 0, size, size)
  const dst = outCtx.getImageData(0, 0, size, size)

  const threshold = 130
  for (let i = 0; i < src.length; i += 4) {
    const h = src[i]
    if (h < threshold) {
      const t = 1 - h / threshold
      dst.data[i] = Math.round(glowColor.r * 255 * t)
      dst.data[i + 1] = Math.round(glowColor.g * 255 * t)
      dst.data[i + 2] = Math.round(glowColor.b * 255 * t)
      dst.data[i + 3] = 255
    }
  }

  outCtx.putImageData(dst, 0, 0)
  return outCanvas
}

export function createPlanetTextures(baseColorHex, seed, biomeKey = 'rocky', size = 384) {
  const biome = getBiome(biomeKey)
  const rand = createRng(seed)

  let base = new THREE.Color(baseColorHex)
  if (biome.saturation) {
    base = base.clone().offsetHSL(0, biome.saturation, 0)
  }
  const lighter = base.clone().offsetHSL(0, 0, 0.12)
  const darker = base.clone().offsetHSL(0, 0.06, -0.16)
  const accent = base.clone().offsetHSL(0.05, -0.05, 0.05)
  const water = base.clone().offsetHSL(-0.06, 0.18, -0.1)
  const glow = new THREE.Color('#ff5a1f')

  const blotches = [
    ...generateBlotchField(rand, size, 9, [0.14, 0.26]),
    ...generateBlotchField(rand, size, 22, [0.05, 0.11]),
  ]

  const colorCanvas = renderColorLayer({ size, base, lighter, darker, accent, water, blotches, rand, biome })
  const heightCanvas = renderHeightLayer({ size, blotches, rand, contrast: biome.blotchContrast })
  const normalCanvas = heightToNormalMap(heightCanvas, size, 2.6)

  const map = new THREE.CanvasTexture(colorCanvas)
  map.colorSpace = THREE.SRGBColorSpace
  map.wrapS = THREE.RepeatWrapping
  map.needsUpdate = true

  const normalMap = new THREE.CanvasTexture(normalCanvas)
  normalMap.wrapS = THREE.RepeatWrapping
  normalMap.needsUpdate = true

  const roughnessMap = new THREE.CanvasTexture(heightCanvas)
  roughnessMap.wrapS = THREE.RepeatWrapping
  roughnessMap.needsUpdate = true

  let emissiveMap = null
  if (biome.emissiveCracks) {
    const emissiveCanvas = renderEmissiveCracks(heightCanvas, size, glow)
    emissiveMap = new THREE.CanvasTexture(emissiveCanvas)
    emissiveMap.wrapS = THREE.RepeatWrapping
    emissiveMap.needsUpdate = true
  }

  return { map, normalMap, roughnessMap, emissiveMap, biome }
}
