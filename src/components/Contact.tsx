import { useRef, type PointerEvent } from 'react'
import { artist, contacts, whatsapp } from '../data/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'
import { InkStop } from './Ornaments'
import { RotatingBadge } from './RotatingBadge'

const magnet = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  gsap.to(el, {
    x: (e.clientX - r.left - r.width / 2) * 0.35,
    y: (e.clientY - r.top - r.height / 2) * 0.35,
    duration: 0.6,
    ease: 'power3',
  })
}
const release = (e: PointerEvent<HTMLElement>) =>
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' })

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      SplitText.create('.contact-title', {
        type: 'lines,chars',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 110,
            stagger: 0.025,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
          }),
      })

      gsap.from('.contact-row', {
        '--line': 0,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-list', start: 'top 85%' },
      })

      gsap.from('.cta', {
        scale: 0,
        rotate: -120,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cta', start: 'top 90%' },
      })

      SplitText.create('.footer-big', {
        type: 'chars',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 100,
            stagger: { each: 0.05, from: 'center' },
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.footer', start: 'top 85%' },
          }),
      })
    },
    { scope: root },
  )

  return (
    <section className="contact" id="contato" ref={root}>
      <InkStop side="right" top="5%" />
      <div className="contact-head">
        <div>
          <p className="eyebrow">★ agenda aberta ★</p>
          <h2 className="contact-title">
            Bora marcar
            <br />
            a sua <em>próxima?</em>
          </h2>
        </div>
        <a
          className="cta"
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          data-cursor="bora!"
          onPointerMove={magnet}
          onPointerLeave={release}
        >
          <RotatingBadge text="CHAMAR NO WHATSAPP • CHAMAR NO WHATSAPP • ">
            <span className="cta-arrow">↗</span>
          </RotatingBadge>
        </a>
      </div>

      <ul className="contact-list">
        {contacts.map((c) => (
          <li key={c.label}>
            <a className="contact-row" href={c.href} target="_blank" rel="noreferrer">
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
              <span className="contact-arrow">→</span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <div className="footer-big" aria-hidden="true">
          {artist.name}
        </div>
        <div className="footer-meta">
          <span>
            © {new Date().getFullYear()} {artist.brand}
          </span>
          <span>Feito com tinta & código</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#top')
            }}
          >
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </section>
  )
}
