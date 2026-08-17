import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import Stars from '../components/Stars'
import Nebula from '../components/Nebula'
import SolarSystem from '../components/SolarSystem'
import CameraController from '../components/CameraController'
import { useEntityRegistry } from '../hooks/useEntityRegistry'
import { SOLAR_SYSTEMS } from '../utils/solarSystems'
import { INITIAL_CAMERA_POSITION, INITIAL_CAMERA_TARGET } from '../utils/constants'

export default function SolarScene({ selection, entityData, onSelectEntity }) {
  const controlsRef = useRef(null)
  const { register, getObject } = useEntityRegistry()

  return (
    <Canvas
      camera={{ position: INITIAL_CAMERA_POSITION, fov: 55, near: 0.1, far: 1400 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#03040a']} />
      <ambientLight intensity={0.34} />

      <Nebula />
      <Stars />
      {SOLAR_SYSTEMS.map((system) => (
        <SolarSystem
          key={system.id}
          system={system}
          selection={selection}
          onSelectEntity={onSelectEntity}
          registerRef={register}
        />
      ))}
      <CameraController
        selection={selection}
        entityData={entityData}
        getEntityObject={getObject}
        controlsRef={controlsRef}
        initialPosition={INITIAL_CAMERA_POSITION}
        initialTarget={INITIAL_CAMERA_TARGET}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={220}
        autoRotate={!selection}
        autoRotateSpeed={0.2}
      />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.22} luminanceSmoothing={0.4} intensity={0.85} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.55} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}
