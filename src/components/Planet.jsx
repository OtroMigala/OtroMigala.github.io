import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { createPlanetTextures } from '../utils/proceduralTexture'
import PlanetAtmosphere from './PlanetAtmosphere'
import PlanetClouds from './PlanetClouds'
import FocusReticle from './FocusReticle'
import HoverLabel from './HoverLabel'

const HOVER_SCALE = 1.18
const DIMMED_OPACITY = 0.28
const NORMAL_SCALE_BASE = 1.4
const NORMAL_SCALE_FOCUSED = 2.6

export default function Planet({ data, paused, disabled, isDimmed, isSelected, onSelect, registerRef }) {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const angleRef = useRef(data.initialAngle)
  const [hovered, setHovered] = useState(false)

  const normalScale = useMemo(() => new THREE.Vector2(NORMAL_SCALE_BASE, NORMAL_SCALE_BASE), [])

  const { map, normalMap, roughnessMap, emissiveMap, biome } = useMemo(
    () => createPlanetTextures(data.color, data.id, data.biome),
    [data.color, data.id, data.biome],
  )

  useEffect(
    () => () => {
      map.dispose()
      normalMap.dispose()
      roughnessMap.dispose()
      emissiveMap?.dispose()
    },
    [map, normalMap, roughnessMap, emissiveMap],
  )

  useEffect(() => {
    registerRef(data.id, groupRef.current)
    return () => registerRef(data.id, null)
  }, [data.id, registerRef])

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += data.orbitSpeed * delta
    }
    const x = Math.cos(angleRef.current) * data.distance
    const z = Math.sin(angleRef.current) * data.distance
    groupRef.current.position.set(x, 0, z)
    meshRef.current.rotation.y += data.rotationSpeed * delta
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
    const resting = biome.emissiveCracks ? 1.4 : 0
    const active = biome.emissiveCracks ? 2.2 : 0.45
    const tween = gsap.to(materialRef.current, {
      emissiveIntensity: hovered ? active : resting,
      duration: 0.3,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [hovered, biome])

  useEffect(() => {
    if (!materialRef.current) return undefined
    const tween = gsap.to(materialRef.current, {
      opacity: isDimmed ? DIMMED_OPACITY : 1,
      duration: 0.6,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [isDimmed])

  useEffect(() => {
    const tween = gsap.to(normalScale, {
      x: isSelected ? NORMAL_SCALE_FOCUSED : NORMAL_SCALE_BASE,
      y: isSelected ? NORMAL_SCALE_FOCUSED : NORMAL_SCALE_BASE,
      duration: 0.8,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [isSelected, normalScale])

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
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[data.radius, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          map={map}
          normalMap={normalMap}
          normalScale={normalScale}
          roughnessMap={roughnessMap}
          emissiveMap={emissiveMap}
          emissive={emissiveMap ? '#ffffff' : data.color}
          emissiveIntensity={0}
          roughness={biome.roughnessBase}
          metalness={0.08}
          transparent
        />
      </mesh>
      {biome.cloudDensity > 0 && (
        <PlanetClouds
          radius={data.radius}
          seed={data.id}
          density={biome.cloudDensity}
          banded={biome.bandedClouds}
          isDimmed={isDimmed}
        />
      )}
      <PlanetAtmosphere radius={data.radius} color={data.color} isDimmed={isDimmed} />
      <FocusReticle radius={data.radius} color={data.color} visible={isSelected} />
      <HoverLabel name={data.name} color={data.color} radius={data.radius} visible={hovered} />
    </group>
  )
}
