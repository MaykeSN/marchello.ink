import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

const INK = '#8c1f28'
const NS = 'http://www.w3.org/2000/svg'
const STEP = 4

type Pt = { x: number; y: number }

// Ruído determinístico: o mesmo trecho do traço sempre tem a mesma forma.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Liga os pontos com curvas de tangente vertical: o traço desce "caindo" e nunca
 * sai da margem (ao contrário de um spline, que estoura nas retas longas).
 * Trechos longos na mesma margem ganham um leve tremido de mão.
 */
const inkPath = (p: Pt[], vh: number) => {
  let d = `M${p[0].x},${p[0].y}`
  let seed = 0
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i]
    const b = p[i + 1]
    const steps = Math.abs(a.x - b.x) < 40 ? Math.max(1, Math.round((b.y - a.y) / (vh * 0.7))) : 1
    let px = a.x
    let py = a.y
    for (let k = 1; k <= steps; k++) {
      const y = a.y + ((b.y - a.y) * k) / steps
      const x = k === steps ? b.x : b.x + (hash(++seed) - 0.5) * 26
      const mid = (py + y) / 2
      d += ` C${px},${mid} ${x},${mid} ${x},${y}`
      px = x
      py = y
    }
  }
  return d
}

/**
 * Posição de um elemento no documento (e o topo da seção dele), mesmo se a seção
 * estiver fixada (pin) no momento.
 */
const docCenter = (el: HTMLElement): Pt & { top: number } => {
  const section = el.closest('section') ?? el
  const holder = section.parentElement?.classList.contains('pin-spacer') ? section.parentElement : section
  const r = el.getBoundingClientRect()
  const s = section.getBoundingClientRect()
  const top = holder.getBoundingClientRect().top + window.scrollY
  return { x: r.left + r.width / 2, y: top + (r.top - s.top) + r.height / 2, top }
}

/**
 * Pincelada de tinta que acompanha o scroll: a ponta fica sempre a ~60% da tela
 * e o caminho passa por cada `.ink-stop` (um por seção), estourando numa mancha
 * com respingos quando chega lá. Desenhado num canvas fixo, só o trecho visível.
 */
export function InkBrush() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useGSAP(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return

    const probe = document.createElementNS(NS, 'svg')
    probe.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden')
    const path = document.createElementNS(NS, 'path')
    probe.appendChild(path)
    document.body.appendChild(probe)

    let samples: Pt[] = []
    let stops: { el: HTMLElement; idx: number }[] = []
    let vw = 0
    let vh = 0
    let scale = 1
    let lastKey = ''

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      vw = window.innerWidth
      vh = window.innerHeight
      scale = vw < 700 ? 0.55 : 1
      c.width = vw * dpr
      c.height = vh * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const els = gsap.utils.toArray<HTMLElement>('.ink-stop')
      if (!els.length) return
      const pts = els.map(docCenter)
      const docH = document.documentElement.scrollHeight

      // Caminho: desce pela margem e só cruza a página na divisa entre uma seção e a
      // próxima, pra não passar por cima do conteúdo (nem das seções fixadas).
      const way: Pt[] = [{ x: pts[0].x, y: Math.max(0, pts[0].y - vh * 0.3) }, pts[0]]
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i]
        const b = pts[i + 1]
        if (Math.abs(a.x - b.x) > vw * 0.3) {
          const from = Math.max(a.y + vh * 0.1, b.top - vh * 0.25)
          const to = Math.min(b.y - vh * 0.03, Math.max(from + vh * 0.2, b.top + vh * 0.1))
          way.push({ x: a.x, y: from }, { x: b.x, y: to })
        } else {
          way.push({ x: a.x + (hash(i) - 0.5) * 30, y: (a.y + b.y) / 2 })
        }
        way.push(b)
      }
      const last = pts[pts.length - 1]
      way.push({ x: last.x, y: Math.min(docH, last.y + vh * 0.5) })

      path.setAttribute('d', inkPath(way, vh))
      const total = path.getTotalLength()
      samples = []
      for (let l = 0; l <= total; l += STEP) {
        const p = path.getPointAtLength(l)
        samples.push({ x: p.x, y: p.y })
      }
      stops = els.map((el, n) => {
        const p = pts[n]
        let best = 0
        let bd = Infinity
        samples.forEach((s, i) => {
          const d = (s.x - p.x) ** 2 + (s.y - p.y) ** 2
          if (d < bd) {
            bd = d
            best = i
          }
        })
        return { el, idx: best }
      })
      lastKey = ''
      render()
    }

    const headIndex = (sy: number) => {
      if (sy >= ScrollTrigger.maxScroll(window) - 2) return samples.length - 1
      const target = sy + vh * 0.6
      let lo = 0
      let hi = samples.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (samples[mid].y < target) lo = mid + 1
        else hi = mid
      }
      return lo
    }

    const render = () => {
      if (!samples.length) return
      const sy = window.scrollY
      const head = headIndex(sy)
      const key = `${sy}|${head}`
      if (key === lastKey) return
      lastKey = key

      ctx.clearRect(0, 0, vw, vh)
      ctx.fillStyle = INK
      const top = sy - 60
      const bottom = sy + vh + 60

      for (let j = 0; j <= head; j++) {
        const s = samples[j]
        if (s.y < top || s.y > bottom) continue
        const prev = samples[Math.max(0, j - 1)]
        const next = samples[Math.min(samples.length - 1, j + 1)]
        const tx = next.x - prev.x
        const ty = next.y - prev.y
        const tl = Math.hypot(tx, ty) || 1
        const nx = -ty / tl
        const ny = tx / tl
        let w = (8 + 4.5 * Math.sin(j * 0.035) + 2.5 * hash(j)) * scale
        w *= Math.min(1, j / 30) * Math.min(1, (head - j) / 18 + 0.35)
        const y = s.y - sy
        ctx.beginPath()
        ctx.arc(s.x, y, Math.max(w, 0.8), 0, Math.PI * 2)
        ctx.fill()
        // cerdas secas nas bordas
        for (let k = 0; k < 5; k++) {
          if (hash(j * 13 + k) > 0.62) {
            const off = (hash(j * 7 + k) - 0.5) * 2 * (w + 5 * scale)
            ctx.beginPath()
            ctx.arc(s.x + nx * off, y + ny * off, (0.6 + hash(j + k * 31)) * scale, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      stops.forEach(({ el, idx }, n) => {
        const reached = idx <= head
        el.classList.toggle('is-inked', reached)
        if (!reached) return
        const s = samples[idx]
        if (s.y < top - 80 || s.y > bottom + 80) return
        const g = Math.min(1, (head - idx) / 22) * scale
        const y = s.y - sy
        ctx.beginPath()
        ctx.arc(s.x, y, 24 * g, 0, Math.PI * 2)
        ctx.fill()
        for (let k = 0; k < 14; k++) {
          const a = hash(n * 17 + k) * Math.PI * 2
          const dist = (30 + hash(n * 5 + k) * 46) * g
          ctx.beginPath()
          ctx.arc(s.x + Math.cos(a) * dist, y + Math.sin(a) * dist, (1 + hash(k * 3 + n) * 4) * g, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    ScrollTrigger.addEventListener('refresh', build)
    gsap.ticker.add(render)
    build()

    return () => {
      ScrollTrigger.removeEventListener('refresh', build)
      gsap.ticker.remove(render)
      probe.remove()
    }
  })

  return <canvas className="ink-brush" ref={canvas} aria-hidden="true" />
}
