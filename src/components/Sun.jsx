import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { createPlanetTextures } from '../utils/proceduralTexture'
import HoverLabel from './HoverLabel'

const HOVER_SCALE = 1.06
const DIMMED_OPACITY = 0.22
const HALO_LAYERS = [
  { scale: 1.18, opacity: 0.2 },
  { scale: 1.4, opacity: 0.08 },
]
const DIMMED_HALO_FACTOR = 0.15
const ROTATION_SPEED = 0.045

export default function Sun({ data, isDimmed, disabled, onSelect, registerRef }) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const haloRefs = useRef([])
  const [hovered, setHovered] = useState(false)

  const { map, normalMap, roughnessMap } = useMemo(
    () => createPlanetTextures(data.color, data.id),
    [data.color, data.id],
  )

  useEffect(
    () => () => {
      map.dispose()
      normalMap.dispose()
      roughnessMap.dispose()
    },
    [map, normalMap, roughnessMap],
  )

  useEffect(() => {
    registerRef(data.id, groupRef.current)
    return () => registerRef(data.id, null)
  }, [data.id, registerRef])

  useFrame((_, delta) => {
    meshRef.current.rotation.y += ROTATION_SPEED * delta
  })

  useEffect(() => {
    if (!meshRef.current) return undefined
    const tween = gsap.to(meshRef.current.scale, {
      x: hovered ? HOVER_SCALE : 1,
      y: hovered ? HOVER_SCALE : 1,
      z: hovered ? HOVER_SCALE : 1,
      duration: 0.35,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [hovered])

  useEffect(() => {
    if (!materialRef.current) return undefined
    const tween = gsap.to(materialRef.current, {
      opacity: isDimmed ? DIMMED_OPACITY : 1,
      duration: 0.6,
      ease: 'power2.out',
    })

    const haloTweens = HALO_LAYERS.map((layer, index) => {
      const material = haloRefs.current[index]
      if (!material) return null
      return gsap.to(material, {
        opacity: isDimmed ? layer.opacity * DIMMED_HALO_FACTOR : layer.opacity,
        duration: 0.6,
        ease: 'power2.out',
      })
    })

    return () => {
      tween.kill()
      haloTweens.forEach((haloTween) => haloTween?.kill())
    }
  }, [isDimmed])

  useEffect(() => {
    if (disabled) return undefined
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [disabled])

  const handlePointerOver = (event) => {
    if (disabled) return
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (event) => {
    if (disabled) return
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (event) => {
    if (disabled) return
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
    onSelect(data)
  }

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={3.2} distance={260} decay={1.6} />
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[data.radius, 48, 48]} />
        <meshBasicMaterial ref={materialRef} map={map} transparent />
      </mesh>
      {HALO_LAYERS.map((layer, index) => (
        <mesh key={layer.scale} scale={layer.scale}>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshBasicMaterial
            ref={(material) => {
              haloRefs.current[index] = material
            }}
            color={data.color}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
      <HoverLabel name={data.name} color={data.color} radius={data.radius} visible={hovered} />
    </group>
  )
}
