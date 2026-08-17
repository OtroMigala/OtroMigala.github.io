import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createNebulaTexture } from '../utils/nebulaTexture'

export default function Nebula() {
  const texture = useMemo(() => createNebulaTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <mesh>
      <sphereGeometry args={[600, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}
