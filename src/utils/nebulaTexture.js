import * as THREE from 'three'

function createRng(seed) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

const CLOUD_PALETTE = ['#2a1a4d', '#123a52', '#3d1a45', '#0d2440', '#1a2f52', '#241640']

export function createNebulaTexture(size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#010102'
  ctx.fillRect(0, 0, size, size)

  const rand = createRng(77)
  const palette = CLOUD_PALETTE.map((hex) => new THREE.Color(hex))

  ctx.globalCompositeOperation = 'lighter'
  const cloudCount = 16
  for (let i = 0; i < cloudCount; i += 1) {
    const x = rand() * size
    const y = rand() * size
    const radius = size * (0.16 + rand() * 0.3)
    const color = palette[Math.floor(rand() * palette.length)]
    const alpha = 0.05 + rand() * 0.07
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(
      0,
      `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`,
    )
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
