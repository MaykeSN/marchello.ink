import type { ReactNode, SVGProps } from 'react'

/*
 * Artes estilo "flash" desenhadas em SVG.
 * Convenção de classes (usadas pelas animações):
 *   .ln  -> traço (é "tatuado" com DrawSVG)
 *   .fl  -> preenchimento preto (sombra / blackwork)
 *   .ac  -> preenchimento de cor (vermelho)
 *   .pf  -> preenchimento "papel" (esconde o que está atrás)
 */

const eyeRays = Array.from({ length: 11 }, (_, i) => {
  const a = (Math.PI * (200 + i * 14)) / 180
  const r1 = 56
  const r2 = i % 2 ? 78 : 92
  return {
    x1: 100 + Math.cos(a) * r1,
    y1: 140 + Math.sin(a) * r1,
    x2: 100 + Math.cos(a) * r2,
    y2: 140 + Math.sin(a) * r2,
  }
})

const arts = {
  rose: (
    <>
      <path className="ac" d="M76 96c4-16 22-24 38-17 9 4 14 12 15 22 12 8 13 27 2 37-10 10-26 14-44 11-14-3-24-14-22-29 1-10 6-18 11-24z" />
      <path className="ln" d="M100 96c-7-5-16 0-13 8 3 8 16 8 19-2 3-11-9-19-20-15-13 4-18 19-10 29 9 11 29 10 36-4" />
      <path className="ln" d="M74 92c3-19 22-29 40-21 10 4 16 14 17 25" />
      <path className="ln" d="M70 102c-15 7-19 29-6 41 11 11 28 13 39 10" />
      <path className="ln" d="M131 98c14 8 16 30 3 42-9 9-22 12-31 12" />
      <path className="ln" d="M62 136c7 19 30 28 51 20 11-4 18-11 21-20" />
      <path className="fl" d="M64 140c10 10 26 15 42 12-14 6-32 2-42-12z" />
      <path className="fl" d="M118 74c8 4 12 12 13 22-4-8-8-14-13-22z" />
      <path className="ln" d="M101 158c-3 24 3 48-3 80" />
      <path className="ln" d="M99 192c-14-14-38-14-52 0 16 10 38 10 52 0z" />
      <path className="fl" d="M99 192c-14 8-34 9-50 2 14 2 34 0 50-2z" />
      <path className="ln" d="M100 214c14-14 38-14 50-2-14 10-36 12-50 2z" />
      <path className="fl" d="M100 214c14 6 34 7 48-1-14 1-32 2-48 1z" />
      <path className="ln" d="M100 176l-9-5 8-1M99 230l9-6-8-1" />
    </>
  ),
  dagger: (
    <>
      <circle className="ln" cx="100" cy="24" r="10" />
      <circle className="fl" cx="100" cy="24" r="4" />
      <path className="ln" d="M92 34h16v52H92z" />
      <path className="ln" d="M92 44l16 6M92 54l16 6M92 64l16 6M92 74l16 6" />
      <path className="ln" d="M56 92c12-8 30-6 44-6s32-2 44 6c-12 8-30 8-44 8s-32 0-44-8z" />
      <circle className="ln" cx="50" cy="92" r="6" />
      <circle className="ln" cx="150" cy="92" r="6" />
      <path className="ln" d="M90 100l10 140 10-140" />
      <path className="ln" d="M100 104v118" />
      <path className="fl" d="M102 104h8l-9 126z" />
      <path className="ln pf" d="M44 150c18-8 36 6 56 0s38-8 56 0l-6 12 10 10c-18-8-38 6-56 0s-40-8-58 0l10-10z" />
      <path className="ac" d="M100 246c-4 6-5 10 0 11 5-1 4-5 0-11z" />
      <path className="ac" d="M94 228c-3 4-3 7 0 7 3 0 3-3 0-7z" />
    </>
  ),
  swallow: (
    <>
      <path className="ln" d="M118 104C100 70 72 44 36 28c16 26 34 56 64 90" />
      <path className="fl" d="M36 28c16 12 28 24 36 34-12-2-24-16-36-34z" />
      <path className="ln" d="M62 52l22 38M80 66l14 30" />
      <path className="ln" d="M78 158L22 176l38-8-30 36 56-34" />
      <path className="fl" d="M22 176l38-8-16 6z" />
      <path className="ln pf" d="M76 156c18-36 40-60 62-64 4-10 20-12 26 0l12 8-13 4c-1 4-2 7-3 10-14 32-48 52-74 56z" />
      <path className="ac" d="M160 114c-10 18-28 32-48 40 14-14 28-30 36-46z" />
      <circle className="fl" cx="152" cy="95" r="2.8" />
      <path className="ln" d="M120 142c18 28 30 58 36 90-20-22-40-48-52-76" />
      <path className="fl" d="M156 232c-6-18-12-30-18-40 8 12 14 24 18 40z" />
    </>
  ),
  skull: (
    <>
      <path className="ln" d="M40 120c-6-50 26-80 60-80s66 30 60 80c-2 14-10 20-16 26v22c0 8-6 12-14 12H70c-8 0-14-4-14-12v-22c-6-6-14-12-16-26z" />
      <path className="fl" d="M58 112c0-14 12-20 24-18 8 2 10 12 6 22-4 8-16 12-24 8-4-2-6-6-6-12z" />
      <path className="fl" d="M142 112c0-14-12-20-24-18-8 2-10 12-6 22 4 8 16 12 24 8 4-2 6-6 6-12z" />
      <path className="fl" d="M100 126l-8 16h16z" />
      <path className="ln" d="M68 166h64M80 156v22M90 156v24M100 156v24M110 156v24M120 156v22" />
      <path className="ln" d="M100 40l-6 16 8 8-4 12" />
      <path className="ln" d="M52 74c6-8 14-14 22-18" />
      <path className="ln pf" d="M24 206c20-10 40 6 76 0s56-10 76 0l-8 14 12 12c-20-10-44 6-80 0s-56-10-76 0l12-12z" />
      <path className="ln" d="M30 200l-10-8M170 200l10-8M100 194v-6" />
    </>
  ),
  snake: (
    <>
      <path className="ln snk-out" d="M50 238c-26-12-22-48 12-56 40-10 92 12 96-30 4-40-62-40-76-66-10-18 4-46 30-48" />
      <path className="ln snk-in" d="M50 238c-26-12-22-48 12-56 40-10 92 12 96-30 4-40-62-40-76-66-10-18 4-46 30-48" />
      <path className="ac pat" d="M50 238c-26-12-22-48 12-56 40-10 92 12 96-30 4-40-62-40-76-66-10-18 4-46 30-48" />
      <ellipse className="ln pf" cx="126" cy="38" rx="20" ry="12" />
      <circle className="fl" cx="134" cy="34" r="3" />
      <path className="ln snk-tongue" d="M146 42l12 2m-12-2l10-6m2 8l8 4m-8-4l8-2" />
    </>
  ),
  moth: (
    <>
      <path className="ln" d="M92 88C64 52 14 48 10 82c-4 30 40 44 82 30" />
      <path className="ln" d="M108 88c28-36 78-40 82-6 4 30-40 44-82 30" />
      <path className="ln" d="M93 124c-30-2-62 18-54 50 8 26 42 6 56-34" />
      <path className="ln" d="M107 124c30-2 62 18 54 50-8 26-42 6-56-34" />
      <path className="fl" d="M90 126c-22 2-42 16-42 36 8-18 24-28 42-30z" />
      <path className="fl" d="M110 126c22 2 42 16 42 36-8-18-24-28-42-30z" />
      <circle className="ln" cx="50" cy="84" r="12" />
      <circle className="ln" cx="150" cy="84" r="12" />
      <circle className="ac" cx="50" cy="84" r="5" />
      <circle className="ac" cx="150" cy="84" r="5" />
      <path className="ln pf" d="M100 66c-6 0-9 12-9 32 0 34 5 64 9 76 4-12 9-42 9-76 0-20-3-32-9-32z" />
      <path className="ln" d="M97 68c-4-20-18-32-32-36M103 68c4-20 18-32 32-36" />
      <path className="ln" d="M93 112h14M92 124h16M93 136h14M95 148h10" />
      <path className="fl" d="M96 84c0-6 8-6 8 0 0 4-2 6-4 8-2-2-4-4-4-8z" />
    </>
  ),
  eye: (
    <>
      {eyeRays.map((r, i) => (
        <line key={i} className="ln" {...r} />
      ))}
      <path className="ln pf" d="M24 140c34-44 118-44 152 0-34 44-118 44-152 0z" />
      <circle className="ln" cx="100" cy="140" r="28" />
      <circle className="fl" cx="100" cy="140" r="13" />
      <circle className="pf" cx="105" cy="134" r="4" />
      <path className="ln" d="M40 158l-6 10M60 170l-4 11M80 176l-2 12M120 176l2 12M140 170l4 11M160 158l6 10" />
      <path className="ac" d="M100 192c-6 10-8 18 0 20 8-2 6-10 0-20z" />
      <path className="ac" d="M100 222c-4 6-5 10 0 11 5-1 4-5 0-11z" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type ArtId = keyof typeof arts

export const artIds = Object.keys(arts) as ArtId[]

type Props = SVGProps<SVGSVGElement> & { id: ArtId }

export function FlashArt({ id, className = '', ...rest }: Props) {
  return (
    <svg viewBox="0 0 200 260" className={`art ${className}`} aria-hidden="true" {...rest}>
      {arts[id]}
    </svg>
  )
}
