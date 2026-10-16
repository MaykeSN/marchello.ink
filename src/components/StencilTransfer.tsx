import { useRef } from 'react'
import { steps } from '../data/site'
import { gsap, useGSAP } from '../lib/gsap'
import { InkStop } from './Ornaments'

/**
 * Sequência fixada no scroll com uma tatuagem real do Marchello:
 * papel com o desenho -> decalque roxo na pele -> papel descola ->
 * o traço preto é tatuado por cima -> entram sombra e cor -> brilho de pele nova.
 * O traço é um SVG vetorizado da arte (public/decalque/linhas.svg), usado como
 * máscara pra pintar a mesma linha em roxo ou em preto.
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
        .set('.tat-stencil', { opacity: 1 })
        .call(activate(1))
        // 2. papel descola de baixo pra cima
        .to('.paper-sheet', { rotateX: 105, duration: 1.2, ease: 'power2.in' }, '+=0.2')
        .to('.paper-shade', { opacity: 0.8, duration: 1.2, ease: 'power2.in' }, '<')
        .to('.paper-sheet', { yPercent: -80, autoAlpha: 0, duration: 0.5 })
        .call(activate(2))
        // 3. o traço preto é tatuado de cima pra baixo por cima do roxo
        .fromTo('.tat-ink', { '--ink': '-10%' }, { '--ink': '110%', duration: 2.6 }, '+=0.1')
        .fromTo('.tat-needle', { top: '-4%', autoAlpha: 1 }, { top: '104%', duration: 2.6 }, '<')
        .set('.tat-needle', { autoAlpha: 0 })
        .to('.tat-stencil', { opacity: 0.12, duration: 2.4 }, '<-2.4')
        .to('.skin', { '--redness': 1, duration: 2.4 }, '<')
        .call(activate(3))
        // 4. sombra e cor, e a pele cicatriza
        .to('.tat-color', { opacity: 1, duration: 1.4 }, '+=0.1')
        .to('.tat-stencil', { opacity: 0, duration: 0.6 }, '<')
        .to('.tat-ink', { opacity: 0, duration: 1.4 }, '<')
        .to('.skin', { '--redness': 0, duration: 1 })
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
      <InkStop side="right" top="10%" />
      <div className="stencil-copy">
        <p className="eyebrow">★ do papel pra pele ★</p>
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
          <div className="tat">
            <img className="tat-color" src="/decalque/cor.webp" alt="Tatuagem neotradicional do Marchello: mulher com crânio de carneiro" loading="lazy" decoding="async" />
            <span className="tat-lines tat-stencil" />
            <span className="tat-lines tat-ink" />
            <span className="tat-needle" />
          </div>
          <span className="glint" />
        </div>
        <div className="paper-sheet">
          <span className="tat-lines tat-paper" />
          <span className="paper-shade" />
        </div>
      </div>
    </section>
  )
}
