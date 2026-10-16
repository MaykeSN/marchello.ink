import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flash, flashImg, type FlashItem } from '../data/flash'
import { whatsappAbout } from '../data/site'
import { Flip, gsap } from '../lib/gsap'
import { getLenis } from '../lib/lenis'

type OpenDetail = { slug: string; list: string[]; from?: HTMLElement | null }

/** Abre a arte em tela cheia. `list` define a ordem do anterior/próximo. */
export function openArt(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>('art:open', { detail }))
}

const bySlug = new Map(flash.map((f) => [f.slug, f]))
const number = (item: FlashItem) => String(flash.indexOf(item) + 1).padStart(2, '0')

export function Lightbox() {
  const [state, setState] = useState<{ item: FlashItem; list: string[] } | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const sourceImg = useRef<HTMLElement | null>(null)
  const [hiRes, setHiRes] = useState('')

  // mostra a miniatura (já em cache) e troca pela versão grande quando carregar
  useEffect(() => {
    if (!state) return
    const slug = state.item.slug
    const im = new Image()
    im.onload = () => setHiRes(slug)
    im.src = flashImg(slug)
  }, [state])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { slug, list, from } = (e as CustomEvent<OpenDetail>).detail
      const item = bySlug.get(slug)
      if (!item) return
      returnFocus.current = (document.activeElement as HTMLElement) ?? null
      const thumb = from?.querySelector<HTMLElement>('img') ?? null
      sourceImg.current = thumb
      flipState.current = thumb ? Flip.getState(thumb) : null
      setState({ item, list })
    }
    window.addEventListener('art:open', onOpen)
    return () => window.removeEventListener('art:open', onOpen)
  }, [])

  // abre: a miniatura "voa" até o centro
  useLayoutEffect(() => {
    if (!state || !root.current) return
    if (flipState.current && img.current) {
      Flip.from(flipState.current, {
        targets: img.current,
        duration: 0.8,
        ease: 'expo.inOut',
        absolute: true,
        scale: true,
      })
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
      const next = bySlug.get(state.list[(i + dir + state.list.length) % state.list.length])
      if (!next || !img.current) return
      gsap.to(img.current, {
        xPercent: -12 * dir,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          setState({ item: next, list: state.list })
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
  const message = `Oi Marchello! Vi a arte "${item.name}" (Nº ${number(item)}) no seu site e quero tatuar. Ela ainda está disponível?`

  return (
    <div className="lb" ref={root} role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="lb-backdrop" onClick={close} />
      <figure className="lb-card">
        <img
          ref={img}
          data-flip-id={`art-${item.slug}`}
          src={flashImg(item.slug, hiRes !== item.slug)}
          width={item.w}
          height={item.h}
          alt={`${item.name}, ${item.style}`}
        />
      </figure>
      <aside className="lb-info">
        <p className="lb-meta">
          <span>Nº {number(item)}</span>
          <span>{item.style}</span>
        </p>
        <h3>{item.name}</h3>
        <p className="lb-size">{item.size ?? 'Tamanho e local sob consulta'}</p>
        <p className="lb-note">Arte exclusiva: depois de tatuada, sai da cartela.</p>
        <a className="lb-cta" href={whatsappAbout(message)} target="_blank" rel="noreferrer" data-cursor="bora!">
          Quero essa <span>↗</span>
        </a>
        <p className="lb-count">
          {pos} / {list.length}
        </p>
      </aside>
      <button className="lb-close" type="button" onClick={close} ref={closeBtn} aria-label="Fechar">
        ×
      </button>
      <button className="lb-nav is-prev" type="button" onClick={() => step(-1)} aria-label="Arte anterior">
        ←
      </button>
      <button className="lb-nav is-next" type="button" onClick={() => step(1)} aria-label="Próxima arte">
        →
      </button>
    </div>
  )
}
