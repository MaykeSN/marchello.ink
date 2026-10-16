import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { hasFinePointer } from '../lib/motion'

/** Cursor customizado: ponto + anel que cresce e mostra rótulos em [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const d = dot.current
    const r = ring.current
    if (!hasFinePointer() || !d || !r) return
    document.documentElement.classList.add('has-cursor')

    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e: PointerEvent) => {
      document.documentElement.classList.add('cursor-ready')
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      const interactive = t.closest('a, button')
      r.classList.toggle('is-label', !!labelled)
      r.classList.toggle('is-hover', !labelled && !!interactive)
      if (label.current) label.current.textContent = labelled?.dataset.cursor ?? ''
    }
    const down = () => r.classList.add('is-down')
    const up = () => r.classList.remove('is-down')

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor', 'cursor-ready')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
