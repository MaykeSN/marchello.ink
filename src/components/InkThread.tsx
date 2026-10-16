import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'

/**
 * Fio de tinta vermelha que serpenteia pela página e vai sendo "tatuado"
 * conforme o scroll, com a ponta da agulha na frente.
 * Passa por trás das seções escuras e reaparece nas claras.
 */
export function InkThread() {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  const tip = useRef<SVGCircleElement>(null)

  useGSAP(() => {
    const main = document.getElementById('main')
    const s = svg.current
    const p = path.current
    const t = tip.current
    if (!main || !s || !p || !t) return

    let len = 0
    let progress = 0

    const render = () => {
      p.style.strokeDashoffset = String(len * (1 - progress))
      const pt = p.getPointAtLength(len * progress)
      t.setAttribute('cx', String(pt.x))
      t.setAttribute('cy', String(pt.y))
      t.style.opacity = progress > 0.002 && progress < 0.998 ? '1' : '0'
    }

    const build = () => {
      const w = main.offsetWidth
      const h = main.offsetHeight
      const vh = Math.max(window.innerHeight, 400)
      if (w === 0 || h === 0) return
      s.setAttribute('viewBox', `0 0 ${w} ${h}`)
      s.style.height = `${h}px`

      let x = w * 0.84
      let y = vh * 0.62
      let d = `M ${x} ${y}`
      let left = true
      while (y < h - vh * 0.4) {
        const ny = Math.min(y + vh * (0.75 + Math.random() * 0.4), h - vh * 0.25)
        if (ny <= y) break
        const nx = left ? w * (0.06 + Math.random() * 0.12) : w * (0.82 + Math.random() * 0.12)
        const dy = ny - y
        d += ` C ${x} ${y + dy * 0.55}, ${nx} ${y + dy * 0.45}, ${nx} ${ny}`
        x = nx
        y = ny
        left = !left
      }
      p.setAttribute('d', d)
      len = p.getTotalLength()
      p.style.strokeDasharray = String(len)
      render()
    }

    const st = ScrollTrigger.create({
      trigger: main,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress = self.progress
        render()
      },
    })

    ScrollTrigger.addEventListener('refresh', build)
    build()
    return () => {
      st.kill()
      ScrollTrigger.removeEventListener('refresh', build)
    }
  })

  return (
    <svg className="ink-thread" ref={svg} aria-hidden="true" preserveAspectRatio="none">
      <path ref={path} />
      <circle ref={tip} r="5" />
    </svg>
  )
}
