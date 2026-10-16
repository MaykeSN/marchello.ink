import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { flash, flashImg, featured } from '../data/flash'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { openArt } from './Lightbox'
import { InkStop } from './Ornaments'

const featuredSlugs = featured.map((f) => f.slug)
const number = (slug: string) => String(flash.findIndex((f) => f.slug === slug) + 1).padStart(2, '0')

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

/** Vitrine principal: os destaques numa galeria horizontal fixada. */
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
        // a arte "brota" como uma mancha de tinta se espalhando no papel
        gsap.from(card.querySelector('.flash-img'), {
          '--reveal': 0,
          ease: 'none',
          scrollTrigger: { ...ca, start: 'left 95%', end: 'left 30%', scrub: true },
        })

        gsap.from(card.querySelector('.flash-card-tilt'), {
          yPercent: 18,
          rotate: 6,
          ease: 'none',
          scrollTrigger: { ...ca, start: 'left 110%', end: 'left 50%', scrub: true },
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
      <InkStop side="left" top="14%" />
      <div className="flash-track" ref={track}>
        <div className="flash-intro">
          <p className="eyebrow">★ flash day / destaques ★</p>
          <h2>
            <span className="mask"><span>Flash</span></span>
            <span className="mask"><span className="outline">sheet</span></span>
          </h2>
          <p className="flash-lead">
            Os {featured.length} desenhos mais fortes da cartela. Todos exclusivos: cada um é tatuado uma única vez e depois sai da cartela pra sempre.
          </p>
          <p className="flash-hint">Clique numa arte pra ver de perto.</p>
        </div>

        {featured.map((item, i) => (
          <article className="flash-card" key={item.slug} style={{ '--r': `${i % 2 ? 2.5 : -2}deg` } as CSSProperties}>
            <button
              type="button"
              className="flash-card-tilt"
              data-cursor="ver"
              onPointerMove={tilt}
              onPointerLeave={untilt}
              onClick={(e) => openArt({ slug: item.slug, list: featuredSlugs, from: e.currentTarget })}
              aria-label={`Ver ${item.name} em tela cheia`}
            >
              <header>
                <span>Nº {number(item.slug)}</span>
                <span>{item.style}</span>
              </header>
              <div className="flash-img">
                <img
                  src={flashImg(item.slug, true)}
                  data-flip-id={`art-${item.slug}`}
                  width={item.w}
                  height={item.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.size ?? 'sob consulta'}</span>
              </footer>
            </button>
          </article>
        ))}

        <div className="flash-outro">
          <p>Tem mais {flash.length - featured.length} na cartela.</p>
          <a
            href="#cartela"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#cartela')
            }}
          >
            Ver todas as {flash.length} artes <span>↓</span>
          </a>
        </div>
      </div>
      <div className="flash-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
