import { useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { FlashGallery } from './components/FlashGallery'
import { Hero } from './components/Hero'
import { InkDefs } from './components/InkDefs'
import { InkThread } from './components/InkThread'
import { Manifesto } from './components/Manifesto'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Splatter } from './components/Splatter'
import { StencilTransfer } from './components/StencilTransfer'
import { ScrollTrigger } from './lib/gsap'
import { initLenis } from './lib/lenis'
import { prefersReducedMotion } from './lib/motion'

type Phase = 'loading' | 'revealing' | 'done'

if (typeof history !== 'undefined') history.scrollRestoration = 'manual'

export default function App() {
  const [reduced] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<Phase>(reduced ? 'done' : 'loading')

  useEffect(() => {
    if (reduced) return
    const lenis = initLenis()
    if (phase === 'loading') {
      window.scrollTo(0, 0)
      lenis.stop()
    } else {
      lenis.start()
    }
    if (phase === 'done') ScrollTrigger.refresh()
  }, [phase, reduced])

  return (
    <>
      <InkDefs />
      {phase !== 'done' && <Preloader onReveal={() => setPhase('revealing')} onDone={() => setPhase('done')} />}
      <Cursor />
      <Nav />
      <main id="main">
        <InkThread />
        <Hero ready={phase !== 'loading'} />
        <Marquee />
        <Manifesto />
        <FlashGallery />
        <StencilTransfer />
        <About />
        <Contact />
      </main>
      <Splatter />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
