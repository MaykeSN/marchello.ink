import { useLayoutEffect, useRef, useState } from 'react'
import { flash, flashImg, type FlashItem } from '../data/flash'
import { Flip, gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { openArt } from './Lightbox'
import { InkStop } from './Ornaments'

const filters = [
  { id: 'todas', label: 'Todas', test: () => true },
  { id: 'neo', label: 'Neotradicional', test: (f: FlashItem) => f.style === 'Neotradicional' },
  { id: 'black', label: 'Blackwork', test: (f: FlashItem) => f.style === 'Blackwork' },
  { id: 'fine', label: 'Fine line & realismo', test: (f: FlashItem) => f.style === 'Fine line' || f.style === 'Realismo' },
  { id: 'mini', label: 'Minis', test: (f: FlashItem) => f.style === 'Mini' },
] as const

type FilterId = (typeof filters)[number]['id']

/** Cartela completa: todas as artes disponíveis, com filtro por estilo. */
export function FlashCatalog() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<FilterId>('todas')
  const flipState = useRef<Flip.FlipState | null>(null)

  const test = filters.find((f) => f.id === active)!.test
  const visible = flash.filter((f) => test(f))
  const visibleSlugs = visible.map((f) => f.slug)

  useGSAP(
    () => {
      gsap.from('.cat-head > *', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      ScrollTrigger.batch('.cat-card', {
        start: 'top 92%',
        once: true,
        onEnter: (all) => {
          // cada card entra uma vez só; depois de um filtro, quem manda é o Flip
          const els = all.filter((el) => !(el as HTMLElement).dataset.in && !(el as HTMLElement).hidden)
          els.forEach((el) => ((el as HTMLElement).dataset.in = '1'))
          if (!els.length) return
          gsap.fromTo(
            els,
            { y: 60, rotate: () => gsap.utils.random(-6, 6), opacity: 0 },
            { y: 0, rotate: 0, opacity: 1, stagger: 0.06, duration: 0.9, ease: 'expo.out', overwrite: true, clearProps: 'transform' },
          )
        },
      })
    },
    { scope: root },
  )

  // reorganiza a cartela com Flip quando o filtro muda
  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: 'expo.inOut',
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(true),
    })
    flipState.current = null
  }, [active])

  const choose = (id: FilterId) => {
    if (id === active || !grid.current) return
    const cards = grid.current.querySelectorAll<HTMLElement>('.cat-card')
    gsap.killTweensOf(cards)
    gsap.set(cards, { opacity: 1, clearProps: 'transform' })
    cards.forEach((c) => (c.dataset.in = '1'))
    flipState.current = Flip.getState(cards)
    setActive(id)
  }

  return (
    <section className="catalog" id="cartela" ref={root}>
      <InkStop side="right" top="150px" />
      <div className="cat-head">
        <p className="eyebrow">★ cartela completa ★</p>
        <h2>
          Todas as artes <em>disponíveis</em>
        </h2>
        <p className="cat-lead">
          {flash.length} desenhos prontos pra tatuar. Escolha um, clique pra ver de perto e chame no WhatsApp com o nome dele.
        </p>
        <div className="cat-filters" role="group" aria-label="Filtrar por estilo">
          {filters.map((f) => {
            const count = flash.filter((x) => f.test(x)).length
            return (
              <button
                key={f.id}
                type="button"
                className="cat-chip"
                aria-pressed={active === f.id}
                onClick={() => choose(f.id)}
              >
                {f.label} <span>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="cat-grid" ref={grid}>
        {flash.map((item, i) => {
          const shown = test(item)
          return (
            <button
              key={item.slug}
              type="button"
              className={`cat-card ${item.tier === 'destaque' ? 'is-featured' : ''}`}
              data-flip-id={`card-${item.slug}`}
              hidden={!shown}
              data-cursor="ver"
              onClick={(e) => openArt({ slug: item.slug, list: visibleSlugs, from: e.currentTarget })}
              aria-label={`Ver ${item.name} em tela cheia`}
            >
              <span className="cat-num">Nº {String(i + 1).padStart(2, '0')}</span>
              {item.tier === 'destaque' && <span className="cat-star" aria-label="Destaque">★</span>}
              <span className="cat-img">
                <img
                  src={flashImg(item.slug, true)}
                  data-flip-id={`art-${item.slug}`}
                  width={item.w}
                  height={item.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="cat-name">{item.name}</span>
              <span className="cat-style">{item.style}</span>
            </button>
          )
        })}
      </div>
      <p className="cat-foot">
        Viu uma que já foi tatuada? Ele também cria um desenho só seu: é só chamar.
      </p>
    </section>
  )
}
