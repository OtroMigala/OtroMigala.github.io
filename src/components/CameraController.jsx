import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import {
  CAMERA_FLIGHT_DURATION,
  CAMERA_FLIGHT_EASE,
  CAMERA_RETURN_DURATION,
  SYSTEM_FLIGHT_DURATION,
} from '../utils/constants'

const worldPosition = new THREE.Vector3()
const UP_AXIS = new THREE.Vector3(0, 1, 0)
const FRAMING_ANGLE = Math.PI / 5.1

function computeFocusPosition(entityObject, entityData, mode) {
  entityObject.getWorldPosition(worldPosition)

  const direction = worldPosition.clone().setY(0)
  if (direction.lengthSq() === 0) direction.set(1, 0, 0)
  direction.normalize().applyAxisAngle(UP_AXIS, FRAMING_ANGLE)

  const distance =
    mode === 'sun' ? entityData.clusterRadius * 1.3 + entityData.radius : entityData.radius * 5 + 3
  const height = mode === 'sun' ? entityData.clusterRadius * 0.32 : entityData.radius * 2 + 1.2

  return {
    position: worldPosition.clone().add(direction.multiplyScalar(distance)).add(new THREE.Vector3(0, height, 0)),
    target: worldPosition.clone(),
  }
}

export default function CameraController({
  selection,
  entityData,
  getEntityObject,
  controlsRef,
  initialPosition,
  initialTarget,
}) {
  const { camera } = useThree()

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return undefined

    gsap.killTweensOf(camera.position)
    gsap.killTweensOf(controls.target)
    controls.enabled = false

    const timeline = gsap.timeline({
      onUpdate: () => controls.update(),
      onComplete: () => {
        controls.enabled = true
      },
    })

    if (selection && entityData) {
      const entityObject = getEntityObject(selection.id)
      const { position, target } = entityObject
        ? computeFocusPosition(entityObject, entityData, selection.kind)
        : { position: new THREE.Vector3(...initialPosition), target: new THREE.Vector3(...initialTarget) }
      const duration = selection.kind === 'sun' ? SYSTEM_FLIGHT_DURATION : CAMERA_FLIGHT_DURATION

      timeline.to(camera.position, { x: position.x, y: position.y, z: position.z, duration, ease: CAMERA_FLIGHT_EASE }, 0)
      timeline.to(controls.target, { x: target.x, y: target.y, z: target.z, duration, ease: CAMERA_FLIGHT_EASE }, 0)
    } else {
      timeline.to(
        camera.position,
        {
          x: initialPosition[0],
          y: initialPosition[1],
          z: initialPosition[2],
          duration: CAMERA_RETURN_DURATION,
          ease: CAMERA_FLIGHT_EASE,
        },
        0,
      )
      timeline.to(
        controls.target,
        {
          x: initialTarget[0],
          y: initialTarget[1],
          z: initialTarget[2],
          duration: CAMERA_RETURN_DURATION,
          ease: CAMERA_FLIGHT_EASE,
        },
        0,
      )
    }

    return () => timeline.kill()
  }, [selection, entityData, getEntityObject, controlsRef, camera, initialPosition, initialTarget])

  return null
}
