import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { photoImg, photos, workImg, works, type Work, type WorkTag } from '../data/works'
import { Flip, gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { openArt } from './Lightbox'
import { InkStop } from './Ornaments'

const filters: { id: 'todos' | WorkTag; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'neo', label: 'Neotradicional' },
  { id: 'rostos', label: 'Rostos & realismo' },
  { id: 'anime', label: 'Anime & geek' },
  { id: 'floral', label: 'Floral & fine line' },
  { id: 'grandes', label: 'Projetos grandes' },
]
type FilterId = (typeof filters)[number]['id']

const matches = (w: Work, id: FilterId) => id === 'todos' || w.tags.includes(id)

/** "Na pele": tatuagens prontas, em mosaico com filtro e visualizador. */
export function Works() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<FilterId>('todos')
  const flipState = useRef<Flip.FlipState | null>(null)
  const visible = works.filter((w) => matches(w, active)).map((w) => w.slug)

  useGSAP(
    () => {
      // foto do estúdio com parallax e o título subindo
      gsap.fromTo('.works-hero img', { yPercent: -12, scale: 1.15 }, {
        yPercent: 12,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: '.works-hero', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.from('.works-hero h2 .mask > span', {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.works-hero', start: 'top 70%' },
      })

      // cada foto entra "revelada" de baixo pra cima, como tinta subindo
      ScrollTrigger.batch('.work', {
        start: 'top 92%',
        once: true,
        onEnter: (all) => {
          const els = all.filter((el) => !(el as HTMLElement).dataset.in && !(el as HTMLElement).hidden)
          els.forEach((el) => ((el as HTMLElement).dataset.in = '1'))
          if (!els.length) return
          gsap.fromTo(
            els,
            { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'clipPath,transform' },
          )
        },
      })
    },
    { scope: root },
  )

  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: 'expo.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(true),
    })
    flipState.current = null
  }, [active])

  const choose = (id: FilterId) => {
    if (id === active || !grid.current) return
    const cards = grid.current.querySelectorAll<HTMLElement>('.work')
    gsap.killTweensOf(cards)
    gsap.set(cards, { clearProps: 'clipPath,transform,opacity' })
    cards.forEach((c) => (c.dataset.in = '1'))
    flipState.current = Flip.getState(cards)
    setActive(id)
  }

  const studio = photos.estudio

  return (
    <section className="works" id="trabalhos" ref={root}>
      <InkStop side="left" top="120px" />
      <div className="works-hero">
        <img
          src={photoImg('estudio')}
          srcSet={`${photoImg('estudio', true)} 900w, ${photoImg('estudio')} 1800w`}
          sizes="100vw"
          width={studio.w}
          height={studio.h}
          alt={studio.alt}
          loading="lazy"
          decoding="async"
        />
        <div className="works-hero-copy">
          <p className="eyebrow">★ trabalhos ★</p>
          <h2>
            <span className="mask"><span>Na</span></span> <span className="mask"><span><em>pele</em></span></span>
          </h2>
          <p className="works-lead">
            Do papel pro corpo: {works.length} tatuagens que já saíram do estúdio. Fechamentos, rostos, anime e florais, do
            neotradicional ao realismo.
          </p>
        </div>
      </div>

      <div className="works-filters" role="group" aria-label="Filtrar trabalhos">
        {filters.map((f) => (
          <button key={f.id} type="button" className="cat-chip" aria-pressed={active === f.id} onClick={() => choose(f.id)}>
            {f.label} <span>{works.filter((w) => matches(w, f.id)).length}</span>
          </button>
        ))}
      </div>

      <div className="works-grid" ref={grid}>
        {works.map((w) => (
          <button
            key={w.slug}
            type="button"
            className="work"
            data-flip-id={`work-${w.slug}`}
            hidden={!matches(w, active)}
            data-cursor="ver"
            style={{ '--ph': w.color, aspectRatio: `${w.w} / ${w.h}` } as CSSProperties}
            onClick={(e) => openArt({ kind: 'work', slug: w.slug, list: visible, from: e.currentTarget })}
            aria-label={`Ver ${w.title} em tela cheia`}
          >
            <img
              src={workImg(w.slug, true)}
              data-flip-id={`art-${w.slug}`}
              width={w.w}
              height={w.h}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="work-caption">
              <strong>{w.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
