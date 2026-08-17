import { isEntityDimmed, isEntityDisabled } from '../utils/selection'
import Orbit from './Orbit'
import Planet from './Planet'
import Sun from './Sun'

export default function SolarSystem({ system, selection, onSelectEntity, registerRef }) {
  const paused = selection?.kind === 'planet'

  return (
    <group position={system.center}>
      <Sun
        data={system.sun}
        isDimmed={isEntityDimmed(selection, system.id, system.sun.id)}
        disabled={isEntityDisabled(selection, system.id, system.sun.id, 'sun')}
        onSelect={(sunData) => onSelectEntity({ kind: 'sun', systemId: system.id, id: sunData.id })}
        registerRef={registerRef}
      />
      {system.planets.map((planet) => {
        const dimmed = isEntityDimmed(selection, system.id, planet.id)
        const disabled = isEntityDisabled(selection, system.id, planet.id, 'planet')
        const isSelected = selection?.kind === 'planet' && selection.id === planet.id
        return (
          <group key={planet.id}>
            <Orbit radius={planet.distance} color={system.sun.color} isDimmed={dimmed} />
            <Planet
              data={planet}
              paused={paused}
              disabled={disabled}
              isDimmed={dimmed}
              isSelected={isSelected}
              onSelect={(planetData) =>
                onSelectEntity({ kind: 'planet', systemId: system.id, id: planetData.id })
              }
              registerRef={registerRef}
            />
          </group>
        )
      })}
    </group>
  )
}
