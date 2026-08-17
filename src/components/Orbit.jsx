import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const SEGMENTS = 128
const BASE_OPACITY = 0.22
const DIMMED_OPACITY = 0.04

export default function Orbit({ radius, color, isDimmed }) {
  const materialRef = useRef(null)

  const positions = useMemo(() => {
    const points = new Float32Array(SEGMENTS * 3)
    for (let i = 0; i < SEGMENTS; i += 1) {
      const angle = (i / SEGMENTS) * Math.PI * 2
      const i3 = i * 3
      points[i3] = Math.cos(angle) * radius
      points[i3 + 1] = 0
      points[i3 + 2] = Math.sin(angle) * radius
    }
    return points
  }, [radius])

  const lineColor = useMemo(
    () => new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.55),
    [color],
  )

  useEffect(() => {
    if (!materialRef.current) return undefined
    const tween = gsap.to(materialRef.current, {
      opacity: isDimmed ? DIMMED_OPACITY : BASE_OPACITY,
      duration: 0.6,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [isDimmed])

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={materialRef} color={lineColor} transparent opacity={BASE_OPACITY} />
    </lineLoop>
  )
}
