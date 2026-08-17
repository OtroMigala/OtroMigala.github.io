export function isEntityDimmed(selection, systemId, entityId) {
  if (!selection) return false
  if (selection.kind === 'planet') return selection.id !== entityId
  return selection.systemId !== systemId
}

export function isEntityDisabled(selection, systemId, entityId, entityKind) {
  if (!selection) return false
  if (selection.kind === 'planet') return true
  if (selection.systemId !== systemId) return true
  if (entityKind === 'sun') return true
  return false
}

export function resolveSelection(selection, systems) {
  if (!selection) return null
  const system = systems.find((candidate) => candidate.id === selection.systemId)
  if (!system) return null
  if (selection.kind === 'sun') return system.sun
  return system.planets.find((planet) => planet.id === selection.id) ?? null
}
