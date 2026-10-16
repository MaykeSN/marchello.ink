// Gera src/data/flash.ts a partir de pieces.cjs + grades.cjs + flash-dims.json
const fs = require('fs')
const path = require('path')
const pieces = require('./pieces.cjs')
const grades = require('./grades.cjs')
const dims = JSON.parse(fs.readFileSync(path.join(__dirname, 'dims.json'), 'utf8'))
const OUT = path.resolve(__dirname, '../../src/data/flash.ts')

const avail = pieces.filter((p) => !p.sold)
const missing = avail.filter((p) => !grades[p.slug] || !dims[p.slug]).map((p) => p.slug)
if (missing.length) throw new Error('faltando: ' + missing.join(', '))

const items = avail
  .map((p, i) => {
    const [score, note] = grades[p.slug]
    const tier = p.style === 'Mini' ? 'mini' : score >= 8.5 ? 'destaque' : 'cartela'
    return { i, slug: p.slug, name: p.name, style: p.style, tier, score, note, size: p.size, refPrice: p.price, w: dims[p.slug].w, h: dims[p.slug].h }
  })
  .sort((a, b) => b.score - a.score || a.i - b.i)
const sold = pieces.filter((p) => p.sold).map((p) => p.name)
const q = (s) => JSON.stringify(String(s)).replace(/^"|"$/g, "'").replace(/\\"/g, '"')

const lines = items.map((it) => {
  const parts = [`slug: ${q(it.slug)}`, `name: ${q(it.name)}`, `style: ${q(it.style)}`, `tier: ${q(it.tier)}`, `score: ${it.score}`, `w: ${it.w}`, `h: ${it.h}`]
  if (it.size) parts.push(`size: ${q(it.size)}`)
  if (it.refPrice) parts.push(`refPrice: ${it.refPrice}`)
  parts.push(`note: ${q(it.note)}`)
  return `  { ${parts.join(', ')} },`
})

const ts = `// Catálogo das artes disponíveis. Gerado por "npm run flash" (tools/flash): não edite à mão.
// Imagens: public/flash/<slug>.webp (grande) e <slug>-sm.webp (cartela).
//
// tier:     'destaque' = vitrine principal · 'cartela' = cartela completa · 'mini' = minis
// score:    nota de curadoria (0–10), usada pra ordenar
// refPrice: valor que aparecia nas cartelas de 2024. NÃO é exibido no site
//           (pode estar desatualizado). TODO: confirmar com o Marchello antes de mostrar.

export type FlashStyle = 'Neotradicional' | 'Blackwork' | 'Fine line' | 'Realismo' | 'Mini'
export type FlashTier = 'destaque' | 'cartela' | 'mini'

export type FlashItem = {
  slug: string
  name: string
  style: FlashStyle
  tier: FlashTier
  score: number
  w: number
  h: number
  size?: string
  refPrice?: number
  note: string
}

export const flash: FlashItem[] = [
${lines.join('\n')}
]

/** Já tatuadas (tinham X vermelho nos stories): fora do site, ficam só no catálogo. */
export const alreadyTattooed = [${sold.map(q).join(', ')}]

export const featured = flash.filter((f) => f.tier === 'destaque')

export const flashImg = (slug: string, small = false) => \`\${import.meta.env.BASE_URL}flash/\${slug}\${small ? '-sm' : ''}.webp\`
`
fs.writeFileSync(OUT, ts)
console.log(items.length, 'disponíveis ·', items.filter((x) => x.tier === 'destaque').length, 'destaques ·', items.filter((x) => x.tier === 'mini').length, 'minis ·', sold.length, 'tatuadas')
