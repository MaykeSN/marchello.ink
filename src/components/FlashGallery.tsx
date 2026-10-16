import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { FlashArt } from '../art/FlashArt'
import { flash } from '../data/site'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'

const tilt = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  gsap.to(el, { rotateY: x * 16, rotateX: -y * 16, duration: 0.6, ease: 'power3' })
  el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
  el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
}
const untilt = (e: PointerEvent<HTMLElement>) =>
  gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })

/** Galeria horizontal fixada: cada arte é "tatuada" quando entra na tela. */
export function FlashGallery() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const t = track.current!
      const distance = () => t.scrollWidth - window.innerWidth

      const scroller = gsap.to(t, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.flash-progress span', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })

      gsap.utils.toArray<HTMLElement>('.flash-card').forEach((card) => {
        const ca = { containerAnimation: scroller, trigger: card }
        gsap
          .timeline({ scrollTrigger: { ...ca, start: 'left 95%', end: 'left 35%', scrub: true } })
          .from(card.querySelectorAll('.ln'), { drawSVG: 0, stagger: 0.04, ease: 'none' })
          .from(card.querySelectorAll('.fl, .ac, .pf'), { opacity: 0, stagger: 0.03, ease: 'none' }, '>-0.15')

        gsap.from(card.querySelector('.flash-card-tilt'), {
          yPercent: 18,
          rotate: 6,
          ease: 'none',
          scrollTrigger: { ...ca, start: 'left 110%', end: 'left 50%', scrub: true },
        })

        const stamp = card.querySelector('.stamp')
        if (stamp)
          gsap.from(stamp, {
            scale: 3,
            opacity: 0,
            duration: 0.35,
            ease: 'power4.in',
            scrollTrigger: { ...ca, start: 'left 45%', toggleActions: 'play none none reverse' },
          })
      })

      gsap.from('.flash-intro h2 .mask > span', {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="flash" id="flash" ref={root}>
      <div className="flash-track" ref={track}>
        <div className="flash-intro">
          <p className="eyebrow">( flash day / artes disponíveis )</p>
          <h2>
            <span className="mask"><span>Flash</span></span>
            <span className="mask"><span className="outline">sheet</span></span>
          </h2>
          <p className="flash-lead">
            Desenhos prontos e exclusivos. Cada um é tatuado uma única vez — depois, sai da cartela pra sempre.
          </p>
        </div>

        {flash.map((item, i) => (
          <article className="flash-card" key={item.art} style={{ '--r': `${i % 2 ? 2.5 : -2}deg` } as CSSProperties}>
            <div className="flash-card-tilt" data-cursor={item.available ? 'quero!' : 'já foi'} onPointerMove={tilt} onPointerLeave={untilt}>
              <header>
                <span>Nº {String(i + 1).padStart(2, '0')}</span>
                <span>{item.style}</span>
              </header>
              <FlashArt id={item.art} />
              <footer>
                <strong>{item.name}</strong>
                <span>{item.size}</span>
              </footer>
              <span className={`stamp ${item.available ? '' : 'is-gone'}`}>{item.available ? 'Disponível' : 'Tatuado'}</span>
            </div>
          </article>
        ))}

        <div className="flash-outro">
          <p>Quer algo só seu?</p>
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#contato')
            }}
          >
            Bora criar junto <span>→</span>
          </a>
        </div>
      </div>
      <div className="flash-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
