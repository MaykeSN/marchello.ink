import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flash, flashImg } from '../data/flash'
import { whatsappAbout } from '../data/site'
import { workImg, works, type WorkTag } from '../data/works'
import { Flip, gsap } from '../lib/gsap'
import { getLenis } from '../lib/lenis'

type Kind = 'flash' | 'work'
type OpenDetail = { kind?: Kind; slug: string; list: string[]; from?: HTMLElement | null }

/** Abre uma arte do flash ou um trabalho em tela cheia. `list` define a ordem do anterior/próximo. */
export function openArt(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>('art:open', { detail }))
}

export const tagLabel: Record<WorkTag, string> = {
  neo: 'Neotradicional',
  rostos: 'Rostos & realismo',
  anime: 'Anime & geek',
  floral: 'Floral & fine line',
  grandes: 'Projeto grande',
  cor: 'Colorida',
}

type Item = {
  slug: string
  title: string
  meta: string[]
  w: number
  h: number
  src: (small: boolean) => string
  lines: string[]
  cta: string
  message: string
  photo: boolean
}

const flashItems = new Map(
  flash.map((f, i): [string, Item] => {
    const n = String(i + 1).padStart(2, '0')
    return [
      f.slug,
      {
        slug: f.slug,
        title: f.name,
        meta: [`Nº ${n}`, f.style],
        w: f.w,
        h: f.h,
        src: (small) => flashImg(f.slug, small),
        lines: [f.size ?? 'Tamanho e local sob consulta', 'Arte exclusiva: depois de tatuada, sai da cartela.'],
        cta: 'Quero essa',
        message: `Oi Marchello! Vi a arte "${f.name}" (Nº ${n}) no seu site e quero tatuar. Ela ainda está disponível?`,
        photo: false,
      },
    ]
  }),
)

const workItems = new Map(
  works.map((w): [string, Item] => [
    w.slug,
    {
      slug: w.slug,
      title: w.title,
      meta: w.tags.filter((t) => t !== 'cor').map((t) => tagLabel[t]),
      w: w.w,
      h: w.h,
      src: (small) => workImg(w.slug, small),
      lines: ['Tatuagem feita pelo Marchello.', 'Gostou do estilo? Ele cria um desenho só seu.'],
      cta: 'Quero algo assim',
      message: `Oi Marchello! Vi o trabalho "${w.title}" no seu site e queria fazer algo nesse estilo.`,
      photo: true,
    },
  ]),
)

const lookup = (kind: Kind, slug: string) => (kind === 'work' ? workItems : flashItems).get(slug)

export function Lightbox() {
  const [state, setState] = useState<{ kind: Kind; item: Item; list: string[] } | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [hiRes, setHiRes] = useState('')

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { kind = 'flash', slug, list, from } = (e as CustomEvent<OpenDetail>).detail
      const item = lookup(kind, slug)
      if (!item) return
      returnFocus.current = (document.activeElement as HTMLElement) ?? null
      const thumb = from?.querySelector<HTMLElement>('img') ?? null
      flipState.current = thumb ? Flip.getState(thumb) : null
      setState({ kind, item, list })
    }
    window.addEventListener('art:open', onOpen)
    return () => window.removeEventListener('art:open', onOpen)
  }, [])

  // mostra a miniatura (já em cache) e troca pela versão grande quando carregar
  useEffect(() => {
    if (!state) return
    const { slug, src } = state.item
    const im = new Image()
    im.onload = () => setHiRes(slug)
    im.src = src(false)
  }, [state])

  // abre: a miniatura "voa" até o centro
  useLayoutEffect(() => {
    if (!state || !root.current) return
    if (flipState.current && img.current) {
      Flip.from(flipState.current, { targets: img.current, duration: 0.8, ease: 'expo.inOut', absolute: true, scale: true })
      flipState.current = null
      gsap.fromTo('.lb-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.5 })
      gsap.fromTo('.lb-info > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.35, ease: 'expo.out' })
    }
  }, [state])

  useEffect(() => {
    if (!state) return
    getLenis()?.stop()
    document.documentElement.classList.add('lb-open')
    closeBtn.current?.focus({ preventScroll: true })
    return () => {
      getLenis()?.start()
      document.documentElement.classList.remove('lb-open')
    }
  }, [state])

  const close = useCallback(() => {
    if (!root.current) return
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setState(null)
        returnFocus.current?.focus({ preventScroll: true })
      },
    })
  }, [])

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!state) return
      const i = state.list.indexOf(state.item.slug)
      const next = lookup(state.kind, state.list[(i + dir + state.list.length) % state.list.length])
      if (!next || !img.current) return
      gsap.to(img.current, {
        xPercent: -12 * dir,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          setState({ ...state, item: next })
          requestAnimationFrame(() =>
            gsap.fromTo(img.current, { xPercent: 12 * dir, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }),
          )
        },
      })
    },
    [state],
  )

  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close, step])

  if (!state) return null
  const { item, list } = state
  const pos = list.indexOf(item.slug) + 1

  return (
    <div className={`lb ${item.photo ? 'is-photo' : ''}`} ref={root} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="lb-backdrop" onClick={close} />
      <figure className="lb-card">
        <img
          ref={img}
          data-flip-id={`art-${item.slug}`}
          src={item.src(hiRes !== item.slug)}
          width={item.w}
          height={item.h}
          alt={item.title}
        />
      </figure>
      <aside className="lb-info">
        <p className="lb-meta">
          {item.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
        <h3>{item.title}</h3>
        <p className="lb-size">{item.lines[0]}</p>
        <p className="lb-note">{item.lines[1]}</p>
        <a className="lb-cta" href={whatsappAbout(item.message)} target="_blank" rel="noreferrer" data-cursor="bora!">
          {item.cta} <span>↗</span>
        </a>
        <p className="lb-count">
          {pos} / {list.length}
        </p>
      </aside>
      <button className="lb-close" type="button" onClick={close} ref={closeBtn} aria-label="Fechar">
        ×
      </button>
      <button className="lb-nav is-prev" type="button" onClick={() => step(-1)} aria-label="Anterior">
        ←
      </button>
      <button className="lb-nav is-next" type="button" onClick={() => step(1)} aria-label="Próximo">
        →
      </button>
    </div>
  )
}
