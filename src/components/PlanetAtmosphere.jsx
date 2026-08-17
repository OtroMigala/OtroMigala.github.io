import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  uniform float power;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float intensity = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), power);
    gl_FragColor = vec4(glowColor, intensity * uOpacity);
  }
`

export default function PlanetAtmosphere({ radius, color, isDimmed }) {
  const materialRef = useRef(null)

  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(color) },
      power: { value: 2.4 },
      uOpacity: { value: 1 },
    }),
    [color],
  )

  useEffect(() => {
    if (!materialRef.current) return undefined
    const tween = gsap.to(materialRef.current.uniforms.uOpacity, {
      value: isDimmed ? 0.12 : 1,
      duration: 0.6,
      ease: 'power2.out',
    })
    return () => tween.kill()
  }, [isDimmed])

  return (
    <mesh scale={1.16}>
      <sphereGeometry args={[radius, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
