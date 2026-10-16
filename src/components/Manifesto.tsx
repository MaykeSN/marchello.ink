import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { InkStop } from './Ornaments'

/** Texto que vai sendo "tingido" palavra por palavra com o scroll. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const text = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      SplitText.create(text.current, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.12, filter: 'blur(3px)' },
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: { trigger: text.current, start: 'top 80%', end: 'bottom 50%', scrub: true },
            },
          ),
      })

      gsap.from('.manifesto-sign', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.manifesto-sign', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="manifesto" ref={root}>
      <InkStop side="right" top="22%" />
      <p className="eyebrow">★ manifesto ★</p>
      <p className="manifesto-text" ref={text}>
        Cada traço começa como <em>decalque</em> e termina como parte de quem você é. Desenhos <em>autorais</em>, feitos
        à mão, pensados pra envelhecer bonito na <em>pele</em> — e pra nunca existirem duas vezes.
      </p>
      <p className="manifesto-sign">Marchello</p>
    </section>
  )
}
