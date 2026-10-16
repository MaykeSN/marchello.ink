import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type Props = { onReveal: () => void; onDone: () => void }

/** Tela de entrada: contador, gota de tinta caindo e a tinta inundando a tela. */
export function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const tl = gsap.timeline({ paused: true, onComplete: onDone })

      tl.from('.pre-label', { yPercent: 120, duration: 0.8, ease: 'expo.out', stagger: 0.08 })
        .to(
          counter,
          {
            v: 100,
            duration: 2.1,
            ease: 'power3.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.pre-needle', { scaleX: 1, duration: 2.1, ease: 'power3.inOut' }, 0)
        .fromTo('.pre-drop', { y: '-55vh', scaleY: 1.6 }, { y: 0, scaleY: 1, duration: 0.55, ease: 'power2.in' }, 1.75)
        .set('.pre-drop', { autoAlpha: 0 })
        .fromTo('.pre-ink', { scale: 0 }, { scale: 1, duration: 1.15, ease: 'expo.inOut' })
        .to('.pre-count, .pre-meta', { color: '#e7e1d5', duration: 0.3 }, '<0.35')
        .to('.pre-count, .pre-meta', { yPercent: -30, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '>0.1')
        .add(onReveal)
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' })

      let alive = true
      document.fonts.ready.then(() => {
        if (alive) tl.play()
      })
      return () => {
        alive = false
      }
    },
    { scope: root },
  )

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pre-meta">
        <span className="pre-mask"><span className="pre-label">Marchello Ink</span></span>
        <span className="pre-mask"><span className="pre-label">preparando a tinta</span></span>
      </div>
      <span className="pre-count" ref={count}>000</span>
      <span className="pre-needle" />
      <span className="pre-drop" />
      <svg className="pre-ink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <circle cx="50" cy="50" r="40" filter="url(#ink-edge)" />
      </svg>
    </div>
  )
}
