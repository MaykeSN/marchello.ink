// Limpa e recorta cada arte dos prints de story "Disponíveis".
// - estima o fundo (fumaça, sombra do braço) por fora da silhueta e divide por ele
// - apaga preço e X vermelhos das cartelas, marca d'água e textos (caixas `ex`)
// - isola a peça dos vizinhos, recorta justo e exporta <slug>.webp e <slug>-sm.webp
// Entrada: assets-src/stories/*.jpg (fora do git). Caixas e ajustes: pieces.cjs.
// uso: npm run flash            (todas)
//      node tools/flash/process.cjs gueixa medusa   (só algumas)
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const pieces = require('./pieces.cjs')

const ROOT = path.resolve(__dirname, '../..')
const SRC = path.join(ROOT, 'assets-src/stories')
const PUB = path.join(ROOT, 'public/flash')
const REVIEW = path.join(ROOT, 'assets-src/flash-tatuadas')
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jpg')).sort()
// stories: caixas na escala de exibição (900 de largura) do print de 1220px; arquivos do Drive: em pixels
const scaleOf = (p) => (p.file ? 1 : 1220 / 900)
const DRIVE = path.join(ROOT, 'assets-src/drive')
fs.mkdirSync(PUB, { recursive: true })
fs.mkdirSync(REVIEW, { recursive: true })

// ---------- morfologia simples em máscaras/planos ----------
function maxFilter(src, w, h, r) {
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) m = Math.max(m, src[y * w + k])
      tmp[y * w + x] = m
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let m = 0
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) m = Math.max(m, tmp[k * w + x])
      out[y * w + x] = m
    }
  }
  return out
}

function dilate(mask, w, h, r) {
  if (r <= 0) return mask
  // distância via duas passadas separáveis (quadrado)
  const tmp = new Uint8Array(w * h)
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    let last = -1e9
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) last = x
      if (x - last <= r) tmp[y * w + x] = 1
    }
    last = 1e9
    for (let x = w - 1; x >= 0; x--) {
      if (mask[y * w + x]) last = x
      if (last - x <= r) tmp[y * w + x] = 1
    }
  }
  for (let x = 0; x < w; x++) {
    let last = -1e9
    for (let y = 0; y < h; y++) {
      if (tmp[y * w + x]) last = y
      if (y - last <= r) out[y * w + x] = 1
    }
    last = 1e9
    for (let y = h - 1; y >= 0; y--) {
      if (tmp[y * w + x]) last = y
      if (last - y <= r) out[y * w + x] = 1
    }
  }
  return out
}

function labels(mask, w, h) {
  const lab = new Int32Array(w * h)
  const comps = []
  const stack = new Int32Array(w * h)
  let n = 0
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || lab[i]) continue
    n++
    let sp = 0
    stack[sp++] = i
    lab[i] = n
    let area = 0
    const pix = []
    while (sp) {
      const p = stack[--sp]
      area++
      pix.push(p)
      const x = p % w
      const y = (p / w) | 0
      if (x > 0 && mask[p - 1] && !lab[p - 1]) { lab[p - 1] = n; stack[sp++] = p - 1 }
      if (x < w - 1 && mask[p + 1] && !lab[p + 1]) { lab[p + 1] = n; stack[sp++] = p + 1 }
      if (y > 0 && mask[p - w] && !lab[p - w]) { lab[p - w] = n; stack[sp++] = p - w }
      if (y < h - 1 && mask[p + w] && !lab[p + w]) { lab[p + w] = n; stack[sp++] = p + w }
    }
    comps.push({ id: n, area, pix })
  }
  return comps
}

function fillHoles(mask, w, h) {
  const outside = new Uint8Array(w * h)
  const stack = []
  const push = (i) => { if (!mask[i] && !outside[i]) { outside[i] = 1; stack.push(i) } }
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x) }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1) }
  while (stack.length) {
    const p = stack.pop()
    const x = p % w
    const y = (p / w) | 0
    if (x > 0) push(p - 1)
    if (x < w - 1) push(p + 1)
    if (y > 0) push(p - w)
    if (y < h - 1) push(p + w)
  }
  const out = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) out[i] = outside[i] ? 0 : 1
  return out
}

// ---------- fundo por baixo da arte: média dos pixels de fora da silhueta, interpolada pra dentro ----------
function inpaintBg(L, mask, w, h, cell = 8) {
  const cw = Math.ceil(w / cell)
  const ch = Math.ceil(h / cell)
  let val = new Float32Array(cw * ch)
  const has = new Uint8Array(cw * ch)
  const sum = new Float32Array(cw * ch)
  const cnt = new Float32Array(cw * ch)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (mask[i]) continue
      const c = ((y / cell) | 0) * cw + ((x / cell) | 0)
      sum[c] += L[i]
      cnt[c]++
    }
  }
  for (let c = 0; c < cw * ch; c++) if (cnt[c] > cell) { val[c] = sum[c] / cnt[c]; has[c] = 1 }
  // difusão até preencher as células cobertas pela arte
  for (let it = 0; it < 400; it++) {
    let missing = 0
    const nv = Float32Array.from(val)
    const nh = Uint8Array.from(has)
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const c = y * cw + x
        if (has[c]) continue
        let t = 0
        let n = 0
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
          const q = yy * cw + xx
          if (has[q]) { t += val[q]; n++ }
        }
        if (n) { nv[c] = t / n; nh[c] = 1 } else missing++
      }
    }
    val = nv
    has.set(nh)
    if (!missing) break
  }
  for (let c = 0; c < cw * ch; c++) if (!has[c]) val[c] = 235
  // suaviza
  for (let pass = 0; pass < 3; pass++) {
    const nv = new Float32Array(cw * ch)
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        let t = 0
        let n = 0
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
          t += val[yy * cw + xx]
          n++
        }
        nv[y * cw + x] = t / n
      }
    }
    val = nv
  }
  // bilinear até o tamanho do recorte
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const fy = Math.min(ch - 1, Math.max(0, y / cell - 0.5))
    const y0 = Math.floor(fy)
    const y1 = Math.min(ch - 1, y0 + 1)
    const ty = fy - y0
    for (let x = 0; x < w; x++) {
      const fx = Math.min(cw - 1, Math.max(0, x / cell - 0.5))
      const x0 = Math.floor(fx)
      const x1 = Math.min(cw - 1, x0 + 1)
      const tx = fx - x0
      const a = val[y0 * cw + x0] * (1 - tx) + val[y0 * cw + x1] * tx
      const b = val[y1 * cw + x0] * (1 - tx) + val[y1 * cw + x1] * tx
      out[y * w + x] = a * (1 - ty) + b * ty
    }
  }
  return out
}

// ---------- fundo estimado (tira fumaça / sombra do braço) ----------
async function background(L, w, h) {
  const sw = Math.round(w / 4)
  const sh = Math.round(h / 4)
  const small = await sharp(Buffer.from(L), { raw: { width: w, height: h, channels: 1 } }).resize(sw, sh, { kernel: 'cubic' }).toColourspace('b-w').raw().toBuffer()
  const mx = maxFilter(Float32Array.from(small), sw, sh, 24)
  const mxBuf = Buffer.from(Uint8Array.from(mx, (v) => Math.max(0, Math.min(255, v))))
  const bg = await sharp(mxBuf, { raw: { width: sw, height: sh, channels: 1 } }).blur(7).resize(w, h, { kernel: 'cubic' }).toColourspace('b-w').raw().toBuffer()
  return bg
}

const cache = new Map()
async function loadSource(p) {
  const n = p.file ?? p.src
  if (cache.has(n)) return cache.get(n)
  const file = p.file ? path.join(DRIVE, p.file) : path.join(SRC, files[p.src - 1])
  const { data, info } = await sharp(file, { failOn: 'none' })
    .rotate()
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  const L = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) L[i] = Math.round(0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2])
  const Lb = Uint8Array.from(L)
  // faixa da marca d'água clara à esquerda não pode inflar a estimativa do fundo
  const clampX = p.file ? p.bgClampX ?? 0 : n <= 6 ? 175 : 0
  for (let y = 0; y < h; y++) for (let x = 0; x < clampX; x++) Lb[y * w + x] = Math.min(Lb[y * w + x], 212)
  const bg = await background(Lb, w, h)
  const src = { data, L, bg, w, h }
  cache.set(n, src)
  return src
}

async function processPiece(p) {
  const s = await loadSource(p)
  const K = scaleOf(p)
  const [x0d, y0d, x1d, y1d] = p.box ?? [0, 0, s.w / K, s.h / K]
  const top = y0d
  const x0 = Math.max(0, Math.round(x0d * K))
  const y0 = Math.max(0, Math.round(y0d * K))
  const x1 = Math.min(s.w, Math.round(x1d * K))
  const y1 = Math.min(s.h, Math.round(y1d * K))
  const w = x1 - x0
  const h = y1 - y0
  const wp = p.wp ?? 0.92
  const bp = 0.05
  const keepRed = p.single || p.sold
  const rgb = new Uint8ClampedArray(w * h * 3)
  const orig = new Uint8ClampedArray(w * h * 3)
  const exMask = new Uint8Array(w * h)
  const ink = new Uint8Array(w * h)
  const red = new Uint8Array(w * h)
  const exRects = (p.ex || []).map((r) => r.map((v) => Math.round(v * K)))

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = x + x0
      const gy = y + y0
      const gi = gy * s.w + gx
      const i = y * w + x
      const bgv = Math.max(70, s.bg[gi])
      let r = s.data[gi * 3]
      let g = s.data[gi * 3 + 1]
      let b = s.data[gi * 3 + 2]
      if (exRects.some(([a, c, d, e]) => gx >= a && gx < d && gy >= c && gy < e)) {
        r = g = b = 255
        exMask[i] = 1
      } else if (!keepRed && r - Math.max(g, b) > 12 && r > 45) {
        red[i] = 1
      }
      const norm = (v) => {
        const n = v / bgv
        return Math.pow(Math.max(0, Math.min(1, (n - bp) / (wp - bp))), 1.08) * 255
      }
      rgb[i * 3] = norm(r)
      rgb[i * 3 + 1] = norm(g)
      rgb[i * 3 + 2] = norm(b)
      orig[i * 3] = r
      orig[i * 3 + 1] = g
      orig[i * 3 + 2] = b
    }
  }
  // apaga preço e X vermelhos (com uma folga de 2px)
  const redD = dilate(red, w, h, keepRed ? 2 : 4)
  let local = null
  if (p.inkMode === 'local' || p.inkMode === 'dark' || p.wmZone || !p.single) {
    const Lo = Buffer.alloc(w * h)
    for (let i = 0; i < w * h; i++) Lo[i] = 0.299 * orig[i * 3] + 0.587 * orig[i * 3 + 1] + 0.114 * orig[i * 3 + 2]
    const mean = await sharp(Lo, { raw: { width: w, height: h, channels: 1 } }).blur(14).toColourspace('b-w').raw().toBuffer()
    local = { Lo, mean }
  }
  for (let i = 0; i < w * h; i++) {
    if (redD[i]) rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 255
    const gx = (i % w) + x0
    const gy = ((i / w) | 0) + y0
    if (p.wmZone && (gx < p.wmZone * K || gy < (top + (p.wmTop ?? 90)) * K)) {
      // faixa da marca d'água e fumaça do topo: só traço escuro COM textura conta como arte
      ink[i] = !exMask[i] && ((local.Lo[i] < 110 && local.Lo[i] < local.mean[i] - 12) || local.Lo[i] < 55) ? 1 : 0
    } else if (p.inkMode === 'dark') {
      ink[i] = !exMask[i] && local.Lo[i] < 80 ? 1 : 0
    } else if (p.inkMode === 'local') {
      ink[i] = !exMask[i] && (local.Lo[i] < local.mean[i] - (p.localT ?? 24) || local.Lo[i] < 75) ? 1 : 0
    } else {
      const l = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2]
      ink[i] = l < (p.single ? 200 : 228) || (!p.single && local.Lo[i] < local.mean[i] - (p.localT ?? 12)) ? 1 : 0
    }
  }

  // isola a peça: componentes que tocam o miolo da caixa (ou são grandes)
  const d = p.dil ?? (p.inkMode === 'dark' ? 9 : p.single ? 4 : 7)
  const dil = dilate(ink, w, h, d)
  const comps = labels(dil, w, h)
  const cx0 = w * 0.16
  const cx1 = w * 0.84
  const cy0 = h * 0.16
  const cy1 = h * 0.84
  const kept = new Uint8Array(w * h)
  for (const c of comps) {
    const inCore = c.pix.some((q) => {
      const x = q % w
      const y = (q / w) | 0
      return x > cx0 && x < cx1 && y > cy0 && y < cy1
    })
    if (inCore || (p.single && c.area > w * h * 0.03)) for (const q of c.pix) kept[q] = 1
  }
  const region = fillHoles(dilate(kept, w, h, 2), w, h)

  // fundo interpolado por baixo da arte, a partir do que está fora da silhueta
  const Lc = new Float32Array(w * h)
  const blocked = new Uint8Array(w * h)
  const regionWide = dilate(region, w, h, 6)
  for (let i = 0; i < w * h; i++) {
    Lc[i] = 0.299 * orig[i * 3] + 0.587 * orig[i * 3 + 1] + 0.114 * orig[i * 3 + 2]
    blocked[i] = regionWide[i] || redD[i] || exMask[i] ? 1 : 0
  }
  const bgI = inpaintBg(Lc, blocked, w, h)
  const wp2 = p.wp2 ?? 0.95
  const bp2 = 0.03
  for (let i = 0; i < w * h; i++) {
    // bgMode 'local': fundo que acompanha o mockup (ex.: perna cinza), em vez do interpolado de fora da silhueta
    const bgv = p.bgMode === 'local' ? Math.max(60, s.bg[(((i / w) | 0) + y0) * s.w + (i % w) + x0]) : Math.max(60, bgI[i])
    for (let k = 0; k < 3; k++) {
      const n = orig[i * 3 + k] / bgv
      rgb[i * 3 + k] = Math.pow(Math.max(0, Math.min(1, (n - bp2) / (wp2 - bp2))), p.gamma ?? (p.single ? 1 : 1.3)) * 255
    }
    if (redD[i] || exMask[i]) rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 255
  }

  // faixa da marca d'água/fumaça do topo: só sobrevive o que está colado num traço escuro
  if (p.wmZone) {
    const dark = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) dark[i] = local.Lo[i] < (p.wmDark ?? 85) && !exMask[i] ? 1 : 0
    const near = dilate(dark, w, h, 10)
    for (let i = 0; i < w * h; i++) {
      const gx = (i % w) + x0
      const gy = ((i / w) | 0) + y0
      if ((gx < p.wmZone * K || gy < (top + (p.wmTop ?? 90)) * K) && !near[i]) rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 255
    }
  }

  // cartelas: tom claro longe de qualquer traço firme é fumaça, vira papel
  if (!p.single) {
    const L2 = new Float32Array(w * h)
    const strong = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) {
      L2[i] = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2]
      strong[i] = L2[i] < 185 ? 1 : 0
    }
    const near = dilate(strong, w, h, p.nearR ?? 12)
    for (let i = 0; i < w * h; i++) if (!near[i] && L2[i] > 175) rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 255
  }

  // limpeza final: some com fiapos soltos longe da arte principal
  {
    const fin = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) fin[i] = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2] < 215 ? 1 : 0
    const cs = labels(dilate(fin, w, h, 6), w, h)
    const big = Math.max(0, ...cs.map((c) => c.area))
    for (const c of cs) if (c.area < big * (p.minPart ?? 0.015)) for (const q of c.pix) { rgb[q * 3] = rgb[q * 3 + 1] = rgb[q * 3 + 2] = 255; region[q] = 0 }
  }

  let bx0 = w
  let by0 = h
  let bx1 = 0
  let by1 = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!region[i]) {
        rgb[i * 3] = rgb[i * 3 + 1] = rgb[i * 3 + 2] = 255
      } else if (ink[i]) {
        bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y)
      }
    }
  }
  const cw = bx1 - bx0 + 1
  const ch = by1 - by0 + 1
  const pad = Math.round(Math.max(cw, ch) * 0.05) + 6
  const crop = await sharp(Buffer.from(rgb), { raw: { width: w, height: h, channels: 3 } })
    .extract({ left: bx0, top: by0, width: cw, height: ch })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#ffffff' })
    .toBuffer({ resolveWithObject: true })
  const long = Math.max(crop.info.width, crop.info.height)
  const target = Math.round(Math.min(1300, Math.max(long, long * 1.7)))
  const big = sharp(crop.data, { raw: { width: crop.info.width, height: crop.info.height, channels: 3 } })
    .resize({ ...(crop.info.width >= crop.info.height ? { width: target } : { height: target }), kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.4 })
  const dest = p.sold ? REVIEW : PUB
  await big.clone().webp({ quality: 86 }).toFile(`${dest}/${p.slug}.webp`)
  await big.clone().resize(crop.info.width >= crop.info.height ? { width: 560 } : { height: 560 }).webp({ quality: 80 }).toFile(`${dest}/${p.slug}-sm.webp`)
  const meta = await sharp(`${dest}/${p.slug}.webp`).metadata()
  return { slug: p.slug, w: meta.width, h: meta.height, srcLong: long }
}

;(async () => {
  const only = process.argv.slice(2)
  const list = only.length ? pieces.filter((p) => only.includes(p.slug)) : pieces
  const results = []
  for (const p of list) {
    const r = await processPiece(p)
    results.push(r)
    console.log(r.slug, `${r.w}x${r.h}`, 'src', r.srcLong)
  }
  const dimsFile = path.join(__dirname, 'dims.json')
  const dims = fs.existsSync(dimsFile) ? JSON.parse(fs.readFileSync(dimsFile, 'utf8')) : {}
  for (const r of results) dims[r.slug] = { w: r.w, h: r.h, srcLong: r.srcLong }
  fs.writeFileSync(dimsFile, JSON.stringify(dims, null, 1))
})()
