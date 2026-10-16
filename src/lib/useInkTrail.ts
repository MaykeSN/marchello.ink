import { useEffect, type RefObject } from 'react'

const INK = '#0e0c0c'

/**
 * Pincel de tinta que segue o mouse num <canvas>.
 * Traço fica mais fino quanto mais rápido o movimento, solta respingos
 * e vai "secando" (desbotando) aos poucos, deixando uma leve mancha no papel.
 */
export function useInkTrail(ref: RefObject<HTMLCanvasElement | null>, enabled: boolean) {
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !enabled) return

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let last: { x: number; y: number; t: number } | null = null
    let width = 6
    let visible = true
    let raf = 0

    const onMove = (e: PointerEvent) => {
      if (!visible) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (y < 0 || y > h) {
        last = null
        return
      }
      const now = performance.now()
      if (last) {
        const dx = x - last.x
        const dy = y - last.y
        const dist = Math.hypot(dx, dy)
        const speed = dist / Math.max(now - last.t, 1)
        const target = Math.max(1.4, 10 - speed * 3.2)
        width += (target - width) * 0.35

        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = INK
        ctx.fillStyle = INK
        ctx.lineCap = 'round'
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(last.x, last.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        if (speed > 1.4 && Math.random() < 0.4) {
          for (let i = 0; i < 4; i++) {
            const k = 1 + Math.random() * 2.5
            ctx.beginPath()
            ctx.arc(
              x + dx * k + (Math.random() - 0.5) * 24,
              y + dy * k + (Math.random() - 0.5) * 24,
              Math.random() * 2.6 + 0.4,
              0,
              Math.PI * 2,
            )
            ctx.fill()
          }
        }
      }
      last = { x, y, t: now }
    }

    const fade = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.045)'
      ctx.fillRect(0, 0, w, h)
      raf = requestAnimationFrame(fade)
    }
    raf = requestAnimationFrame(fade)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(fade)
    })
    io.observe(canvas)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [ref, enabled])
}
