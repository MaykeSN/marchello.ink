import { useRef, type MouseEvent } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/lenis'

const links = [
  ['Flash', '#flash'],
  ['Cartela', '#cartela'],
  ['Decalque', '#decalque'],
  ['Sobre', '#sobre'],
  ['Contato', '#contato'],
] as const

export function Nav() {
  const nav = useRef<HTMLElement>(null)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        nav.current?.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 240)
      },
    })
  })

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <header className="nav" ref={nav}>
      <a href="#top" className="nav-logo" onClick={(e) => go(e, '#top')} aria-label="Início">
        M<span>.</span>
      </a>
      <nav>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={(e) => go(e, href)}>
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
    </header>
  )
}
