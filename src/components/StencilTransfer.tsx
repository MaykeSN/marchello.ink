import { useRef } from 'react'
import { FlashArt, type ArtId } from '../art/FlashArt'
import { steps } from '../data/site'
import { gsap, useGSAP } from '../lib/gsap'

const ART: ArtId = 'dagger'

/**
 * Sequência fixada no scroll que simula o processo real:
 * papel com o desenho -> decalque roxo na pele -> papel descola ->
 * a tinta preta é tatuada por cima -> pele cicatrizada com brilho.
 */
export function StencilTransfer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('.step')
      const activate = (i: number) => () => items.forEach((el, n) => el.classList.toggle('is-active', n === i))

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.8,
        },
      })

      tl.call(activate(0))
        // 1. papel chega e encosta na pele
        .fromTo(
          '.paper-sheet',
          { yPercent: -70, rotate: -9, scale: 1.25, autoAlpha: 0 },
          { yPercent: 0, rotate: -2, scale: 1, autoAlpha: 1, duration: 1, ease: 'power2.out' },
        )
        .to('.paper-sheet', { scale: 0.97, rotate: 0, duration: 0.3, ease: 'power2.inOut' })
        .set('.art-stencil', { opacity: 1 })
        .call(activate(1))
        // 2. papel descola de baixo pra cima
        .to('.paper-sheet', { rotateX: 105, duration: 1.2, ease: 'power2.in' }, '+=0.2')
        .to('.paper-shade', { opacity: 0.8, duration: 1.2, ease: 'power2.in' }, '<')
        .to('.paper-sheet', { yPercent: -80, autoAlpha: 0, duration: 0.5 })
        .call(activate(2))
        // 3. tinta substitui o roxo
        .from('.art-ink .ln', { drawSVG: 0, duration: 2.2, stagger: 0.12 }, '+=0.1')
        .to('.art-stencil', { opacity: 0.18, duration: 2 }, '<')
        .to('.skin', { '--redness': 1, duration: 2 }, '<')
        .from('.art-ink .fl, .art-ink .ac, .art-ink .pf', { opacity: 0, duration: 0.6, stagger: 0.08 })
        .to('.art-stencil', { opacity: 0, duration: 0.4 }, '<')
        .call(activate(3))
        // 4. pele nova
        .to('.skin', { '--redness': 0, duration: 0.8 })
        .fromTo('.glint', { xPercent: -160 }, { xPercent: 160, duration: 1.2, ease: 'power2.inOut' }, '<')
        .to({}, { duration: 0.4 })

      gsap.to('.stencil-progress span', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=320%', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section className="stencil" id="decalque" ref={root}>
      <div className="stencil-copy">
        <p className="eyebrow">( do papel pra pele )</p>
        <h2>
          O <em>decalque</em>
        </h2>
        <div className="stencil-steps">
          <div className="stencil-progress" aria-hidden="true">
            <span />
          </div>
          <ol>
            {steps.map((s, i) => (
              <li className={`step ${i === 0 ? 'is-active' : ''}`} key={s.title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="stencil-stage">
        <div className="skin">
          <FlashArt id={ART} className="art-stencil" />
          <FlashArt id={ART} className="art-ink" />
          <span className="glint" />
        </div>
        <div className="paper-sheet">
          <FlashArt id={ART} className="art-paper" />
          <span className="paper-shade" />
        </div>
      </div>
    </section>
  )
}
