import { useRef } from 'react'
import { artist } from '../data/site'
import { photoImg, photos } from '../data/works'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { InkStop } from './Ornaments'
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

      // segunda foto: entra de lado e flutua com parallax
      gsap.fromTo(
        '.about-detail',
        { yPercent: 30, rotate: 8, opacity: 0 },
        { yPercent: -20, rotate: -4, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.about-portrait', start: 'top 80%', end: 'bottom top', scrub: true } },
      )

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
      <InkStop side="left" top="9%" />
      <div className="about-photos">
      <div className="about-portrait" data-cursor="prazer!">
        <div className="about-portrait-inner">
          <img
            src={photoImg('retrato')}
            srcSet={`${photoImg('retrato', true)} 720w, ${photoImg('retrato')} 1440w`}
            sizes="(max-width: 900px) 92vw, 40vw"
            width={photos.retrato.w}
            height={photos.retrato.h}
            alt={photos.retrato.alt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <RotatingBadge text="TINTA • AGULHA • PAPEL • PELE • TINTA • AGULHA • PAPEL • PELE • " className="about-badge">
          <span className="badge-drop" />
        </RotatingBadge>
      </div>
      <figure className="about-detail" aria-hidden="true">
        <img src={photoImg('maos', true)} width={photos.maos.w} height={photos.maos.h} alt="" loading="lazy" decoding="async" />
      </figure>
      </div>

      <div className="about-copy">
        <p className="eyebrow">★ o artista ★</p>
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
