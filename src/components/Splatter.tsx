import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

const NS = 'http://www.w3.org/2000/svg'
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Respingo de tinta onde o usuário clica. */
export function Splatter() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return
      const size = 180
      const c = size / 2
      const svg = document.createElementNS(NS, 'svg')
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
      svg.setAttribute('class', 'splat')
      svg.style.left = `${e.clientX - c}px`
      svg.style.top = `${e.clientY - c}px`
      const g = document.createElementNS(NS, 'g')
      g.setAttribute('filter', 'url(#ink-edge)')
      svg.appendChild(g)

      const blob = (cx: number, cy: number, r: number) => {
        const el = document.createElementNS(NS, 'circle')
        el.setAttribute('cx', String(cx))
        el.setAttribute('cy', String(cy))
        el.setAttribute('r', String(r))
        g.appendChild(el)
        return el
      }
      blob(c, c, rand(14, 20))
      const drops = Array.from({ length: Math.round(rand(7, 12)) }, () => {
        const a = rand(0, Math.PI * 2)
        const d = rand(22, 70)
        return blob(c + Math.cos(a) * d, c + Math.sin(a) * d, rand(1.5, 6))
      })

      document.body.appendChild(svg)
      gsap
        .timeline({ onComplete: () => svg.remove() })
        .from(svg, { scale: 0.2, duration: 0.25, ease: 'back.out(3)', transformOrigin: '50% 50%' })
        .from(drops, { attr: { cx: c, cy: c }, duration: 0.3, ease: 'expo.out' }, 0)
        .to(svg, { opacity: 0, duration: 1.2, ease: 'power1.in' }, 0.9)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return null
}
