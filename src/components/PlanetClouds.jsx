import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { createCloudTexture } from '../utils/cloudTexture'

const BASE_OPACITY = 0.85
const DIMMED_FACTOR = 0.15

export default function PlanetClouds({ radius, seed, density, banded, isDimmed }) {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  const texture = useMemo(() => createCloudTexture(seed, density, banded), [seed, density, banded])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    meshRef.current.rotation.y += (banded ? 0.05 : 0.02) * delta
  })

  useEffect(() => {
    if (!materialRef.current) return undefined
    const tween = gsap.to(materialRef.current, {
      opacity: isDimmed ? BASE_OPACITY * DIMMED_FACTOR : BASE_OPACITY,
      duration: 0.6,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [isDimmed])

  return (
    <mesh ref={meshRef} scale={1.035}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={BASE_OPACITY}
        depthWrite={false}
        roughness={1}
      />
    </mesh>
  )
}
