import { useRef, type CSSProperties } from 'react'
import { FlashArt } from '../art/FlashArt'
import { artist } from '../data/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { RotatingBadge } from './RotatingBadge'

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const st = (trigger: string, start = 'top 80%') => ({ trigger, start })

      gsap
        .timeline({ scrollTrigger: { trigger: '.about-portrait', start: 'top 85%', end: 'bottom 40%', scrub: true } })
        .fromTo('.about-portrait', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
        .from('.about-portrait-inner', { scale: 1.4, ease: 'none' }, 0)
        .from('.about-monogram .ln', { drawSVG: 0, stagger: 0.05, ease: 'none' }, 0.1)

      SplitText.create('.about-copy h2', {
        type: 'chars',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 100,
            opacity: 0,
            rotate: 12,
            stagger: 0.04,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: st('.about-copy h2'),
          }),
      })

      SplitText.create('.about-bio p', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            stagger: 0.06,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: st('.about-bio'),
          }),
      })

      gsap.utils.toArray<HTMLElement>('.stat-value').forEach((el) => {
        gsap.from(el, {
          textContent: 0,
          duration: 2.2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      gsap.from('.stat', {
        '--line': 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: st('.about-stats', 'top 90%'),
      })
    },
    { scope: root },
  )

  return (
    <section className="about" id="sobre" ref={root}>
      <div className="about-portrait" data-cursor="prazer!">
        <div className="about-portrait-inner">
          {/* TODO: trocar pelo retrato real do artista (<img src=... />) */}
          <FlashArt id="skull" className="about-monogram" style={{ '--card-bg': '#1d1918' } as CSSProperties} />
          <span className="about-photo-note">foto do artista</span>
        </div>
        <RotatingBadge text="TINTA • AGULHA • PAPEL • PELE • TINTA • AGULHA • PAPEL • PELE • " className="about-badge">
          <span className="badge-drop" />
        </RotatingBadge>
      </div>

      <div className="about-copy">
        <p className="eyebrow">( o artista )</p>
        <h2>{artist.name}</h2>
        <div className="about-bio">
          {artist.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="about-stats">
          {artist.stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <span className="stat-value">{s.value}</span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
