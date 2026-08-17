import { useCallback, useRef } from 'react'

export function useEntityRegistry() {
  const registry = useRef({})

  const register = useCallback((id, object3D) => {
    if (object3D) {
      registry.current[id] = object3D
    } else {
      delete registry.current[id]
    }
  }, [])

  const getObject = useCallback((id) => registry.current[id] ?? null, [])

  return { register, getObject }
}
