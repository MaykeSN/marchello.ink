import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTarget(target: string) {
  if (lenis) lenis.scrollTo(target, { duration: 1.8 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}
