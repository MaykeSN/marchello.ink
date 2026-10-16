import { useRef } from 'react'
import { FlashArt } from '../art/FlashArt'
import { artist } from '../data/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { hasFinePointer } from '../lib/motion'
import { useInkTrail } from '../lib/useInkTrail'
import { InkStop, Ribbon } from './Ornaments'
import { RotatingBadge } from './RotatingBadge'

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Abertura: nome em blackletter "sangrando" tinta, rosa sendo tatuada e pincel no mouse. */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const drips = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useInkTrail(canvas, ready && hasFinePointer())

  useGSAP(
    () => {
      if (!ready || !title.current) return
      const split = SplitText.create(title.current, { type: 'chars' })
      const chars = split.chars as HTMLElement[]

      // Escorridos de tinta saindo da base das letras, crescem com o scroll.
      const buildDrips = () => {
        const box = drips.current
        if (!box) return
        gsap.killTweensOf(box.children)
        box.innerHTML = ''
        const origin = box.getBoundingClientRect()
        const picks = [0, 1, 3, 4, 6, 8].filter((i) => i < chars.length)
        picks.forEach((i, n) => {
          const r = chars[i].getBoundingClientRect()
          const el = document.createElement('span')
          const w = rand(5, 13)
          el.className = 'drip'
          el.style.left = `${r.left - origin.left + r.width * rand(0.25, 0.7)}px`
          el.style.top = `${r.top - origin.top + r.height * 0.74}px`
          el.style.width = `${w}px`
          box.appendChild(el)
          const rest = rand(18, 52)
          gsap.fromTo(el, { height: 0 }, { height: rest, duration: rand(1.2, 2.2), delay: 0.2 + n * 0.12, ease: 'power2.inOut' })
          gsap.fromTo(
            el,
            { height: rest },
            {
              height: rest + rand(120, 420),
              ease: 'none',
              immediateRender: false,
              scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
            },
          )
        })
      }

      const tl = gsap.timeline({ delay: 0.1 })
      tl.from(chars, { yPercent: 60, opacity: 0, rotate: () => rand(-14, 14), duration: 1.3, ease: 'expo.out', stagger: 0.06 })
        .fromTo(document.getElementById('bleed-disp'), { attr: { scale: 70 } }, { attr: { scale: 0 }, duration: 2, ease: 'power3.out' }, 0)
        .set(title.current, { filter: 'none' })
        .call(buildDrips, [], 1.1)
        .from('.hero-swallow .ln', { drawSVG: 0, duration: 1.2, stagger: 0.05, ease: 'power2.inOut' }, 0.5)
        .from('.hero-swallow .fl, .hero-swallow .ac, .hero-swallow .pf', { opacity: 0, duration: 0.6, stagger: 0.03 }, '-=0.5')
        .from('.hero-ribbon', { scaleX: 0, duration: 1, ease: 'expo.out' }, 0.7)
        .from('.hero-star', { scale: 0, rotate: -180, duration: 0.8, ease: 'back.out(3)', stagger: 0.08 }, 1)
        .from('.hero-reveal', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.5)
        .from('.hero .badge', { scale: 0, rotate: -180, duration: 1.4, ease: 'expo.out' }, 0.8)

      // Parallax de saída
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-title-wrap', { yPercent: 35, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-swallow.is-left', { xPercent: -60, yPercent: -80, rotate: -16, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-swallow.is-right', { xPercent: 60, yPercent: -80, rotate: 16, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-meta', { yPercent: -120, opacity: 0, ease: 'none', scrollTrigger: st })

      let t: number
      const onResize = () => {
        clearTimeout(t)
        t = window.setTimeout(buildDrips, 250)
      }
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        split.revert()
      }
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section className="hero" id="top" ref={root}>
      <canvas className="hero-canvas" ref={canvas} aria-hidden="true" />

      <div className="hero-meta hero-meta-top">
        <span className="mask"><span className="hero-reveal">Tatuador — {artist.city}</span></span>
        <span className="mask"><span className="hero-reveal">Desde {artist.since}</span></span>
      </div>

      <InkStop side="left" top="46%" />

      <div className="hero-title-wrap">
        <div className="drips" ref={drips} aria-hidden="true" />
        <div className="hero-swallow is-left" aria-hidden="true">
          <FlashArt id="swallow" />
        </div>
        <div className="hero-swallow is-right" aria-hidden="true">
          <FlashArt id="swallow" />
        </div>
        <Ribbon className="hero-ribbon">
          <span className="hero-star">★</span> Tattoo · desde {artist.since} <span className="hero-star">★</span>
        </Ribbon>
        <h1 className="hero-title" ref={title}>
          {artist.name}
        </h1>
      </div>

      <div className="hero-meta hero-meta-bottom">
        <p>
          <span className="mask"><span className="hero-reveal">Tatuagem autoral.</span></span>
          <span className="mask"><span className="hero-reveal">Neotradicional · Blackwork · Fine line.</span></span>
        </p>
        <span className="mask"><span className="hero-reveal hero-scroll">Role e deixe a tinta escorrer ↓</span></span>
      </div>

      <RotatingBadge text="AGENDA ABERTA • MARCHELLO INK • AGENDA ABERTA • MARCHELLO INK • ">
        <span className="badge-drop" />
      </RotatingBadge>
    </section>
  )
}
