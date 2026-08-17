import { Html } from '@react-three/drei'
import './HoverLabel.css'

export default function HoverLabel({ name, color, radius, visible }) {
  return (
    <Html position={[0, radius * 1.05, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[15, 0]}>
      <div className={`hover-label${visible ? ' is-visible' : ''}`} style={{ '--accent': color }}>
        <svg className="hover-label__svg" width="90" height="22" viewBox="0 0 90 22">
          <circle className="hover-label__dot" cx="3" cy="15" r="2.5" />
          <path className="hover-label__seg hover-label__seg--diagonal" d="M3 15 L17 1" />
          <path className="hover-label__seg hover-label__seg--horizontal" d="M17 1 L45 1" />
        </svg>
        <span className="hover-label__text">{name}</span>
      </div>
    </Html>
  )
}
