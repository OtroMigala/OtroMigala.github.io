import { useCallback, useMemo, useState } from 'react'
import SolarScene from './scene/SolarScene'
import InfoPanel from './components/InfoPanel'
import { SOLAR_SYSTEMS } from './utils/solarSystems'
import { resolveSelection } from './utils/selection'
import './App.css'

export default function App() {
  const [selection, setSelection] = useState(null)

  const entityData = useMemo(() => resolveSelection(selection, SOLAR_SYSTEMS), [selection])

  const handleSelectEntity = useCallback((next) => {
    setSelection(next)
  }, [])

  const handleClose = useCallback(() => {
    setSelection(null)
  }, [])

  return (
    <div className="app">
      <SolarScene selection={selection} entityData={entityData} onSelectEntity={handleSelectEntity} />
      <InfoPanel entity={entityData} onClose={handleClose} />
    </div>
  )
}
