// Sincroniza a pasta pública do Google Drive do Marchello com assets-src/drive/ (fora do git).
//
// - Lista as pastas lendo a página pública do Drive (sem login e sem chave de API).
// - Baixa só o que é novo ou mudou de tamanho; arquivos repetidos (mesmo nome e tamanho) entram uma vez.
// - Vídeos só com --videos (são pesados).
// - Grava assets-src/drive/manifest.json, que o process.mjs usa pra gerar as imagens do site.
//
// uso: npm run drive            (sincroniza e processa)
//      node tools/drive/sync.mjs --videos
//
// Atenção: a listagem lê o HTML do Drive, que não é uma API oficial. Se o Google mudar a página,
// este script avisa que não achou os dados; aí dá pra trocar pela Drive API v3 com uma chave.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_FOLDER = '10rD6nKRhxQDPvzKnJIOQAkeg_gIvNN3f'
const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../../assets-src/drive')
const withVideos = process.argv.includes('--videos')
const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' }
const FOLDER_MIME = 'application/vnd.google-apps.folder'

const unescapeJs = (s) =>
  s
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\\//g, '/')
    .replace(/\\\\/g, '\\')

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'raiz'

async function listFolder(id) {
  const html = await fetch(`https://drive.google.com/drive/folders/${id}`, { headers: UA }).then((r) => r.text())
  const m = html.match(/_DRIVE_ivd'\] = '([^']*)'/)
  if (!m) throw new Error(`Não achei a listagem da pasta ${id}. A pasta ainda é pública? O Drive mudou a página?`)
  const rows = JSON.parse(unescapeJs(m[1]))[0] ?? []
  return rows.map((r) => ({ id: r[0], name: String(r[2] ?? '').trim(), mime: r[3], modified: r[10] ?? null }))
}

async function walk(id, folderPath, acc) {
  const items = await listFolder(id)
  for (const it of items) {
    if (it.mime === FOLDER_MIME) await walk(it.id, folderPath ? `${folderPath}/${it.name}` : it.name, acc)
    else acc.push({ ...it, folder: folderPath })
  }
  return acc
}

async function head(id) {
  const r = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, { method: 'HEAD', headers: UA, redirect: 'follow' })
  return { ok: r.ok, size: +(r.headers.get('content-length') ?? 0), type: r.headers.get('content-type') ?? '' }
}

async function download(id, dest) {
  const r = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, { headers: UA, redirect: 'follow' })
  if (!r.ok) throw new Error(`HTTP ${r.status} ao baixar ${id}`)
  if ((r.headers.get('content-type') ?? '').includes('text/html')) throw new Error(`Drive pediu confirmação pra ${id} (arquivo grande demais?)`)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()))
}

const ext = (f) => (path.extname(f.name) || '.' + (f.mime.split('/')[1] ?? 'bin')).toLowerCase().replace('.jpeg', '.jpg')

const files = await walk(ROOT_FOLDER, '', [])
const manifestPath = path.join(OUT, 'manifest.json')
const previous = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : []
const prevById = new Map(previous.map((f) => [f.id, f]))

const seen = new Set()
const manifest = []
let downloaded = 0
let skipped = 0
for (const f of files) {
  const isVideo = f.mime.startsWith('video/')
  const isImage = f.mime.startsWith('image/')
  if (!isVideo && !isImage) continue
  const { size } = await head(f.id)
  const dupKey = `${f.folder}|${f.name}|${size}`
  if (seen.has(dupKey)) continue
  seen.add(dupKey)

  const file = path.join(slugify(f.folder), `${f.id}${ext(f)}`).replace(/\\/g, '/')
  const dest = path.join(OUT, file)
  const entry = { id: f.id, name: f.name, folder: f.folder, mime: f.mime, size, modified: f.modified, file, video: isVideo }
  const have = fs.existsSync(dest) && fs.statSync(dest).size === size
  if (isVideo && !withVideos && !have) {
    manifest.push({ ...entry, file: null })
    continue
  }
  if (have) skipped++
  else {
    process.stdout.write(`baixando ${f.folder}/${f.name} (${(size / 1048576).toFixed(1)} MB)… `)
    await download(f.id, dest)
    downloaded++
    console.log('ok')
  }
  manifest.push(entry)
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1))
const novos = manifest.filter((f) => !prevById.has(f.id)).length
const sumiram = previous.filter((p) => !manifest.some((f) => f.id === p.id)).length
console.log(`\n${manifest.length} arquivos no Drive · ${downloaded} baixados · ${skipped} já estavam aqui · ${novos} novos · ${sumiram} removidos do Drive`)
if (!withVideos) console.log('(vídeos ignorados; use --videos pra baixar)')
