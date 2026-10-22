// Gera as imagens do site a partir de assets-src/drive (baixado pelo sync.mjs):
// - Trabalhos (Tatuagens, Rostos, Flashs) -> public/trabalhos/<slug>.webp e <slug>-sm.webp
// - Fotos do artista (raiz)               -> public/fotos/<slug>.webp e <slug>-sm.webp
// - src/data/works.ts com a lista, tamanhos e cor média (placeholder enquanto carrega)
// Os metadados das fotos (EXIF, localização GPS) não vão pro site.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { defaultTags, photos, works } from './curation.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const DRIVE = path.join(ROOT, 'assets-src/drive')
const manifest = JSON.parse(fs.readFileSync(path.join(DRIVE, 'manifest.json'), 'utf8'))
const OUT_WORKS = path.join(ROOT, 'public/trabalhos')
const OUT_PHOTOS = path.join(ROOT, 'public/fotos')
fs.mkdirSync(OUT_WORKS, { recursive: true })
fs.mkdirSync(OUT_PHOTOS, { recursive: true })

const WORK_FOLDERS = ['Tatuagens', 'Tatuagens/Rostos', 'Flashs']
const warn = []

async function load(entry, { trim } = {}) {
  let img = sharp(path.join(DRIVE, entry.file), { failOn: 'none' }).rotate()
  if (trim) {
    // tira as tarjas pretas dos prints de galeria
    const buf = await img.toBuffer()
    img = sharp(buf).trim({ background: '#000000', threshold: 40 })
  }
  return sharp(await img.toBuffer())
}

async function exportPair(img, dest, big, small) {
  const meta = await img.metadata()
  const fit = (long) => (meta.width >= meta.height ? { width: Math.min(long, meta.width) } : { height: Math.min(long, meta.height) })
  await img.clone().resize(fit(big)).webp({ quality: 80, effort: 5 }).toFile(`${dest}.webp`)
  await img.clone().resize(fit(small)).webp({ quality: 74, effort: 5 }).toFile(`${dest}-sm.webp`)
  const out = await sharp(`${dest}.webp`).metadata()
  const { dominant } = await img.clone().resize(64).stats()
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('')
  return { w: out.width, h: out.height, color: hex }
}

const workItems = []
for (const entry of manifest.filter((f) => !f.video && WORK_FOLDERS.includes(f.folder))) {
  const cur = works[entry.id]
  if (cur?.skip) continue
  const c = cur ?? {
    slug: `trabalho-${entry.id.slice(0, 8).toLowerCase()}`,
    title: 'Tatuagem',
    tags: defaultTags[entry.folder] ?? [],
    score: 6,
  }
  if (!cur) warn.push(`sem curadoria: ${entry.folder}/${entry.name} (${entry.id}) -> entrou como "${c.slug}"`)
  const img = await load(entry, c)
  const dims = await exportPair(img, path.join(OUT_WORKS, c.slug), 1600, 640)
  workItems.push({ slug: c.slug, title: c.title, tags: c.tags, score: c.score, ...dims })
  console.log('trabalho', c.slug, `${dims.w}x${dims.h}`)
}
workItems.sort((a, b) => b.score - a.score)

const photoItems = {}
for (const entry of manifest.filter((f) => !f.video && f.folder === '')) {
  const cur = photos[entry.id]
  if (!cur) {
    warn.push(`foto da raiz sem curadoria: ${entry.name} (${entry.id})`)
    continue
  }
  if (cur.skip) continue
  const img = await load(entry)
  const dims = await exportPair(img, path.join(OUT_PHOTOS, cur.slug), 1800, 900)
  photoItems[cur.slug] = { alt: cur.alt, ...dims }
  console.log('foto', cur.slug, `${dims.w}x${dims.h}`)
}

// remove imagens que saíram da curadoria
const keep = new Set(workItems.flatMap((w) => [`${w.slug}.webp`, `${w.slug}-sm.webp`]))
for (const f of fs.readdirSync(OUT_WORKS)) if (!keep.has(f)) fs.rmSync(path.join(OUT_WORKS, f))

const q = (s) => JSON.stringify(s)
const ts = `// Trabalhos (tatuagens prontas) e fotos do artista. Gerado por "npm run drive" (tools/drive): não edite à mão.
// Curadoria (títulos, tags, ordem): tools/drive/curation.mjs

export type WorkTag = 'neo' | 'rostos' | 'anime' | 'floral' | 'grandes' | 'cor'

export type Work = { slug: string; title: string; tags: WorkTag[]; score: number; w: number; h: number; color: string }

export const works: Work[] = [
${workItems.map((w) => `  { slug: ${q(w.slug)}, title: ${q(w.title)}, tags: ${q(w.tags)}, score: ${w.score}, w: ${w.w}, h: ${w.h}, color: ${q(w.color)} },`).join('\n')}
]

export type Photo = { alt: string; w: number; h: number; color: string }

export const photos = {
${Object.entries(photoItems).map(([k, p]) => `  ${q(k)}: { alt: ${q(p.alt)}, w: ${p.w}, h: ${p.h}, color: ${q(p.color)} },`).join('\n')}
} satisfies Record<string, Photo>

const base = import.meta.env.BASE_URL
export const workImg = (slug: string, small = false) => \`\${base}trabalhos/\${slug}\${small ? '-sm' : ''}.webp\`
export const photoImg = (slug: keyof typeof photos, small = false) => \`\${base}fotos/\${slug}\${small ? '-sm' : ''}.webp\`
`
fs.writeFileSync(path.join(ROOT, 'src/data/works.ts'), ts)
console.log(`\n${workItems.length} trabalhos · ${Object.keys(photoItems).length} fotos`)
if (warn.length) console.log('\nAtenção:\n- ' + warn.join('\n- '))
