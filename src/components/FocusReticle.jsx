import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const RING_CONFIGS = [
  { rotation: [Math.PI / 2, 0, 0], speed: 0.6 },
  { rotation: [Math.PI / 2.4, Math.PI / 3, 0], speed: -0.4 },
  { rotation: [Math.PI / 1.8, -Math.PI / 4, 0], speed: 0.5 },
]

export default function FocusReticle({ radius, color, visible }) {
  const groupRef = useRef(null)
  const ringRefs = useRef([])
  const outerRadius = radius * 1.9

  useEffect(() => {
    if (!groupRef.current) return undefined
    const tween = gsap.to(groupRef.current.scale, {
      x: visible ? 1 : 0.6,
      y: visible ? 1 : 0.6,
      z: visible ? 1 : 0.6,
      duration: 0.5,
      ease: visible ? 'back.out(1.6)' : 'power2.in',
    })
    return () => tween.kill()
  }, [visible])

  useEffect(() => {
    const materials = ringRefs.current.filter(Boolean).map((mesh) => mesh.material)
    if (!materials.length) return undefined
    const tween = gsap.to(materials, {
      opacity: visible ? 0.75 : 0,
      duration: 0.5,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [visible])

  useFrame((_, delta) => {
    ringRefs.current.forEach((mesh, index) => {
      if (mesh) mesh.rotation.z += RING_CONFIGS[index].speed * delta
    })
  })

  return (
    <group ref={groupRef} scale={0.6}>
      {RING_CONFIGS.map((config, index) => (
        <mesh
          key={config.speed}
          rotation={config.rotation}
          ref={(mesh) => {
            ringRefs.current[index] = mesh
          }}
        >
          <ringGeometry args={[outerRadius, outerRadius + radius * 0.06, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
