import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  STAR_COUNT,
  STAR_FIELD_INNER_RADIUS,
  STAR_FIELD_OUTER_RADIUS,
} from '../utils/constants'

const STAR_COLOR_PALETTE = ['#9bb8ff', '#cfe0ff', '#ffffff', '#fff4d6', '#ffd9a0', '#ffb37a']

const VERTEX_SHADER = `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vTwinkle = 0.6 + 0.4 * sin(uTime * 1.3 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (240.0 / -mvPosition.z), 1.0, 40.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(vColor, alpha * vTwinkle);
  }
`

function buildStarField(count, innerRadius, outerRadius) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const palette = STAR_COLOR_PALETTE.map((hex) => new THREE.Color(hex))

  for (let i = 0; i < count; i += 1) {
    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2))

    const i3 = i * 3
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    const color = palette[Math.floor(Math.random() * palette.length)]
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    sizes[i] =
      Math.random() < 0.93
        ? THREE.MathUtils.randFloat(0.5, 1.3)
        : THREE.MathUtils.randFloat(1.8, 3.4)
    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, colors, sizes, phases }
}

export default function Stars() {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)

  const { positions, colors, sizes, phases } = useMemo(
    () => buildStarField(STAR_COUNT, STAR_FIELD_INNER_RADIUS, STAR_FIELD_OUTER_RADIUS),
    [],
  )

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    pointsRef.current.rotation.y += delta * 0.0015
    materialRef.current.uniforms.uTime.value += delta
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
