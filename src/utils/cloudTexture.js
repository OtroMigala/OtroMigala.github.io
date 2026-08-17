import * as THREE from 'three'

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

export function createCloudTexture(seed, density, banded = false, size = 320) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)

  const rand = createRng(seed)
  const count = banded ? 11 : Math.round(14 * density) + 5

  for (let i = 0; i < count; i += 1) {
    const x = rand() * size
    const y = rand() * size
    const rx = banded ? size * (0.32 + rand() * 0.36) : size * (0.08 + rand() * 0.14)
    const ry = banded ? size * (0.025 + rand() * 0.045) : rx * (0.6 + rand() * 0.5)
    const alpha = (0.18 + rand() * 0.3) * density

    ctx.save()
    ctx.translate(x, y)
    if (!banded) ctx.rotate(rand() * Math.PI)
    ctx.scale(rx, ry)
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(0, 0, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}
