import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PANEL_FADE_IN_DELAY } from '../utils/constants'
import './InfoPanel.css'

export default function InfoPanel({ entity, onClose }) {
  const panelRef = useRef(null)
  const [displayEntity, setDisplayEntity] = useState(null)

  useEffect(() => {
    if (entity) setDisplayEntity(entity)
  }, [entity])

  useEffect(() => {
    const el = panelRef.current
    if (!el || !displayEntity) return undefined

    if (entity) {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, x: 48 },
        { autoAlpha: 1, x: 0, duration: 0.7, delay: PANEL_FADE_IN_DELAY, ease: 'power2.out' },
      )
      return () => tween.kill()
    }

    const tween = gsap.to(el, {
      autoAlpha: 0,
      x: 48,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setDisplayEntity(null),
    })
    return () => tween.kill()
  }, [entity, displayEntity])

  if (!displayEntity) return null

  return (
    <div className="info-panel-layer">
      <div className="info-panel" ref={panelRef} style={{ '--accent': displayEntity.color }}>
        <header className="info-panel__header">
          <span className="info-panel__eyebrow">{displayEntity.kicker}</span>
          <h2 className="info-panel__title">{displayEntity.name}</h2>
          <p className="info-panel__tagline">{displayEntity.tagline}</p>
        </header>

        <p className="info-panel__body">{displayEntity.description}</p>

        {displayEntity.stack && (
          <ul className="info-panel__stack">
            {displayEntity.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}

        <nav className="info-panel__nav">
          {displayEntity.siteLink && (
            <a
              className="info-panel__action"
              href={displayEntity.siteLink}
              target="_blank"
              rel="noreferrer"
            >
              Visitar sitio ↗
            </a>
          )}
          {displayEntity.repoLink && (
            <a
              className="info-panel__action info-panel__action--ghost"
              href={displayEntity.repoLink}
              target="_blank"
              rel="noreferrer"
            >
              Ver código ↗
            </a>
          )}
          <button type="button" className="info-panel__close" onClick={onClose}>
            Cerrar
          </button>
        </nav>
      </div>
    </div>
  )
}
