import { useRef } from 'react'
import { artist } from '../data/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

/** Duas faixas cruzadas com os estilos, acelerando e inclinando conforme a velocidade do scroll. */
export function Marquee() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>('.mq-track')
      const loops = tracks.map((track, i) =>
        gsap.fromTo(
          track,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 26, ease: 'none', repeat: -1 },
        ),
      )
      const skew = gsap.quickTo(tracks, 'skewX', { duration: 0.5, ease: 'power3' })

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity()
          const boost = 1 + Math.min(Math.abs(v) / 250, 6)
          loops.forEach((l) => {
            gsap.to(l, { timeScale: boost * self.direction, duration: 0.2, overwrite: true })
            gsap.to(l, { timeScale: self.direction, duration: 1.2, delay: 0.2, ease: 'power2.out' })
          })
          skew(gsap.utils.clamp(-12, 12, v / -120))
        },
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      })
    },
    { scope: root },
  )

  const words = [...artist.styles, ...artist.styles]
  return (
    <section className="marquee" ref={root} aria-label="Estilos">
      {['mq-band mq-ink', 'mq-band mq-red'].map((cls) => (
        <div className={cls} key={cls}>
          <div className="mq-track">
            {words.map((w, i) => (
              <span key={i}>
                {w}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
