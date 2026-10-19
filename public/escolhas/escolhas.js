/* Monte o seu site · Marchello Ink
 * Página de escolhas pro cliente. Tudo em JS puro, sem build.
 * Cada opção tem `spec`: a descrição técnica que vai no código final pro desenvolvedor.
 */
;(() => {
  'use strict'

  // Se preencher (só números, com DDI), o botão do WhatsApp já abre a conversa com esse número.
  const WHATSAPP_DEV = ''
  const STORE_KEY = 'mi-escolhas-v1'

  const IMG = (slug) => `../flash/${slug}-sm.webp`
  const PORTRAIT = '../marchello.webp'

  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  let uidN = 0
  const uid = () => `u${++uidN}`

  /* ------------------------------------------------------------------ */
  /* Peças reutilizadas nas miniaturas                                   */
  /* ------------------------------------------------------------------ */

  const SYM_PATHS = {
    estrela: 'M12 1.6l3 7.1 7.6.6-5.8 5 1.8 7.4L12 17.8l-6.6 3.9 1.8-7.4-5.8-5 7.6-.6z',
    brilho: 'M12 1c1 7 4 10 11 11-7 1-10 4-11 11-1-7-4-10-11-11 7-1 10-4 11-11z',
    losango: 'M12 2l8.5 10L12 22 3.5 12z',
    lua: 'M15.5 2.2A10 10 0 1 0 21.8 15 8 8 0 1 1 15.5 2.2z',
    cruz: 'M12 12L7.2 2h9.6zM12 12l10-4.8v9.6zM12 12l4.8 10H7.2zM12 12L2 16.8V7.2z',
    coracao: 'M12 21C5 15.2 2 11.6 2 8.1 2 5.2 4.3 3 7 3c2 0 3.9 1.2 5 3 1.1-1.8 3-3 5-3 2.7 0 5 2.2 5 5.1 0 3.5-3 7.1-10 12.9z',
    gota: 'M12 1.5C9 7.6 5 11.5 5 16a7 7 0 0 0 14 0c0-4.5-4-8.4-7-14.5z',
  }
  const symMask = (k) =>
    SYM_PATHS[k]
      ? `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${SYM_PATHS[k]}'/></svg>`)}")`
      : 'none'
  const S = '<i class="sym"></i>'

  const SWALLOW = `<svg viewBox="0 0 200 260" class="m-art" aria-hidden="true"><path class="ln" d="M118 104C100 70 72 44 36 28c16 26 34 56 64 90"/><path class="fl" d="M36 28c16 12 28 24 36 34-12-2-24-16-36-34z"/><path class="ln" d="M62 52l22 38M80 66l14 30"/><path class="ln" d="M78 158L22 176l38-8-30 36 56-34"/><path class="fl" d="M22 176l38-8-16 6z"/><path class="ln pf" d="M76 156c18-36 40-60 62-64 4-10 20-12 26 0l12 8-13 4c-1 4-2 7-3 10-14 32-48 52-74 56z"/><path class="ac" d="M160 114c-10 18-28 32-48 40 14-14 28-30 36-46z"/><circle class="fl" cx="152" cy="95" r="2.8"/><path class="ln" d="M120 142c18 28 30 58 36 90-20-22-40-48-52-76"/><path class="fl" d="M156 232c-6-18-12-30-18-40 8 12 14 24 18 40z"/></svg>`

  const badge = (text, cls = '') => {
    const id = uid()
    return `<svg class="m-badge ${cls}" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="${id}" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0"/></defs><g class="m-badge-rot"><text><textPath href="#${id}">${text}</textPath></text></g><circle class="ac" cx="50" cy="50" r="14"/><path class="pf-ink" d="M50 41c-3 6-6 9-6 13a6 6 0 0 0 12 0c0-4-3-7-6-13z"/></svg>`
  }

  const ribbon = (txt, cls = '') => `<span class="m-ribbon f-letter ${cls}"><span>${txt}</span></span>`

  const card = (slug = 'sagrado-coracao', name = 'Sagrado coração', num = '15', style = 'Neotradicional') => `
    <div class="m-card"><div class="m-card-in">
      <span class="m-tape a"></span><span class="m-tape b"></span>
      <div class="m-card-head f-letter"><span>Nº ${num}</span><span>${style}</span></div>
      <div class="m-card-img"><img src="${IMG(slug)}" alt="" loading="lazy" decoding="async"></div>
      <div class="m-card-foot"><span class="f-display">${name}</span></div>
      <span class="m-card-cap">${name}</span>
    </div></div>`

  const lines = (n, cls = '') =>
    Array.from({ length: n }, (_, i) => `<i class="m-line ${cls}" style="width:${[92, 78, 86, 64, 88, 70][i % 6]}%"></i>`).join('')

  const chars = (word) => [...word].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')

  const GALLERY = ['gueixa', 'medusa', 'pirata', 'rei-caveira', 'deusa-da-lua', 'mascara-mariposas', 'sacerdotisa-carneiro', 'pardal-adaga']
  const thumb = (slug, cls = '') => `<span class="m-thumb ${cls}"><img src="${IMG(slug)}" alt="" loading="lazy" decoding="async"></span>`

  const cursorArrow = `<svg viewBox="0 0 24 24" class="m-arrow" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.6-6.8L4 19.5z"/></svg>`

  /* ------------------------------------------------------------------ */
  /* Aberturas (hero), menus, faixas, botões, logos                      */
  /* Usadas nas miniaturas E na prévia ao vivo.                          */
  /* ------------------------------------------------------------------ */

  const T = () => state.texts // textos atuais (a prévia ao vivo usa os editados)
  const tx = (k) => (T() && T()[k] != null ? T()[k] : DEFAULT_TEXTS[k])

  const heroHTML = (v, live = false) => {
    const name = esc(live ? tx('nome') : 'Marchello')
    const since = esc(live ? tx('desde') : '2020')
    const city = esc(live ? tx('cidade') : 'Extrema — MG')
    const frase = esc(live ? tx('heroFrase') : 'Tatuagem autoral. Neotradicional · Blackwork · Fine line.')
    switch (v) {
      case 'foto':
        return `<div class="hm hm-foto"><img class="hm-bg" src="${PORTRAIT}" alt="" loading="lazy"><div class="hm-shade"></div>
          <div class="hm-foto-copy"><span class="m-eyebrow f-letter">${S} tatuador · ${city} ${S}</span><div class="hm-name f-display">${name}</div><p class="f-body">${frase}</p></div></div>`
      case 'arte':
        return `<div class="hm hm-arte"><div class="hm-arte-copy"><span class="m-eyebrow f-letter">${S} desde ${since} ${S}</span><div class="hm-name f-display">${name}</div><p class="f-body">${frase}</p><span class="m-btn-solid f-cond">Ver o flash →</span></div>
          <div class="hm-arte-pic">${card('gueixa', 'Gueixa', '01')}</div></div>`
      case 'colagem':
        return `<div class="hm hm-colagem">${GALLERY.slice(0, 6).map((s, i) => thumb(s, `c${i}`)).join('')}<div class="hm-center">${ribbon(`${S} Tattoo ${S}`)}<div class="hm-name f-display">${name}</div></div></div>`
      case 'video':
        return `<div class="hm hm-video"><img class="hm-bg" src="${PORTRAIT}" alt="" loading="lazy"><div class="hm-shade"></div><span class="hm-rec f-body">● vídeo em loop</span>
          <div class="hm-center"><div class="hm-name f-display">${name}</div><span class="hm-play">▶</span></div></div>`
      case 'minimal':
        return `<div class="hm hm-minimal"><span class="hm-min-top f-body"><b class="f-display">${name}</b><span>${city}</span></span>
          <p class="hm-min-big f-cond">Tatuagem autoral em ${esc(city.split('—')[0].trim())}</p><span class="hm-min-sub f-body">Neotradicional · Blackwork · Fine line</span></div>`
      default:
        return `<div class="hm hm-atual"><div class="hm-meta t f-body"><span>Tatuador — ${city}</span><span>Desde ${since}</span></div>
          <div class="hm-sw l">${SWALLOW}</div><div class="hm-sw r">${SWALLOW}</div>
          <div class="hm-center">${ribbon(`${S} Tattoo · desde ${since} ${S}`)}<div class="hm-name f-display">${name}<span class="hm-drips"><i style="left:8%;--h:34%"></i><i style="left:27%;--h:58%"></i><i style="left:48%;--h:26%"></i><i style="left:66%;--h:46%"></i><i style="left:88%;--h:30%"></i></span></div></div>
          <div class="hm-meta b f-body"><span>${frase}</span><span>Role ↓</span></div>${badge('AGENDA ABERTA • MARCHELLO INK • AGENDA ABERTA • MARCHELLO INK •', 'hm-badge')}</div>`
    }
  }

  const logoHTML = (v, live = false) => {
    const name = esc(live ? tx('nome') : 'Marchello')
    const id = uid()
    switch (v) {
      case 'selo':
        return `<span class="lg lg-selo"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><path id="${id}" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0"/></defs><circle cx="50" cy="50" r="47" class="lg-ring"/><circle cx="50" cy="50" r="27" class="lg-ring thin"/><text class="lg-selo-t"><textPath href="#${id}">${name.toUpperCase()} • INK • TATTOO • </textPath></text><text x="50" y="62" text-anchor="middle" class="lg-selo-m">${esc(name[0] || 'M')}</text></svg></span>`
      case 'nome':
        return `<span class="lg lg-nome"><b class="f-display">${name}</b><small class="f-letter">ink · tattoo</small></span>`
      case 'assinatura':
        return `<span class="lg lg-ass">${name}</span>`
      case 'andorinha':
        return `<span class="lg lg-and"><span class="lg-and-sw">${SWALLOW}</span><b class="f-cond">${name.toUpperCase()}</b></span>`
      case 'enviar':
        return `<span class="lg lg-env f-body">seu logo aqui<small>vou mandar o arquivo</small></span>`
      default:
        return `<span class="lg lg-m f-display">${esc(name[0] || 'M')}<i>.</i></span>`
    }
  }

  const navHTML = (v, live = false) => {
    const logo = logoHTML(live ? state.sel.logo : 'm', live)
    const links = ['Flash', 'Cartela', 'Decalque', 'Sobre', 'Contato']
    const ln = links.map((l) => `<span>${l}</span>`).join('')
    switch (v) {
      case 'hamburguer':
        return `<div class="nv nv-ham"><div class="nv-bar">${logo}<span class="nv-burger"><i></i><i></i><i></i></span></div><div class="nv-over"><span class="f-display">${links.slice(0, 4).join('</span><span class="f-display">')}</span></div></div>`
      case 'fixo':
        return `<div class="nv nv-fixo"><div class="nv-bar">${logo}<span class="nv-links f-body">${links.slice(0, 3).map((l) => `<span>${l}</span>`).join('')}</span><span class="nv-cta f-cond">Agendar</span></div></div>`
      case 'app':
        return `<div class="nv nv-app"><div class="nv-tabs f-body">${['Flash', 'Cartela', 'Sobre', 'Contato'].map((l, i) => `<span><i class="nv-ic n${i}"></i>${l}</span>`).join('')}</div></div>`
      case 'lateral':
        return `<div class="nv nv-lat"><div class="nv-rail">${logo}<span class="nv-vert f-letter">${links.slice(0, 4).join(' · ')}</span></div></div>`
      case 'centro':
        return `<div class="nv nv-centro"><div class="nv-bar f-body"><span class="nv-links">${links.slice(0, 2).map((l) => `<span>${l}</span>`).join('')}</span>${logo}<span class="nv-links">${links.slice(3).map((l) => `<span>${l}</span>`).join('')}</span></div></div>`
      default:
        return `<div class="nv nv-atual"><div class="nv-bar">${logo}<span class="nv-links f-body">${ln}</span></div></div>`
    }
  }

  const marqueeHTML = (v, live = false) => {
    const words = (live ? tx('estilos') : DEFAULT_TEXTS.estilos).split(',').map((w) => w.trim()).filter(Boolean)
    const run = [...words, ...words].map((w) => `<span>${esc(w)} ${S}</span>`).join('')
    switch (v) {
      case 'unica':
        return `<div class="mq mq-unica"><div class="mq-band ink"><div class="mq-track f-cond">${run}${run}</div></div></div>`
      case 'contorno':
        return `<div class="mq mq-contorno"><div class="mq-track f-cond slow">${run}${run}</div></div>`
      case 'artes':
        return `<div class="mq mq-artes"><div class="mq-track">${[...GALLERY, ...GALLERY].map((s) => thumb(s)).join('')}</div></div>`
      case 'nenhuma':
        return `<div class="mq mq-none"><span class="f-body">sem faixa: do topo direto pro manifesto</span></div>`
      default:
        return `<div class="mq mq-atual"><div class="mq-band ink"><div class="mq-track f-cond">${run}${run}</div></div><div class="mq-band red"><div class="mq-track rev f-cond">${run}${run}</div></div></div>`
    }
  }

  const buttonHTML = (v, label = 'Chamar no WhatsApp') => {
    switch (v) {
      case 'solido':
        return `<span class="bt bt-solido f-cond">${esc(label)} →</span>`
      case 'faixa':
        return `<span class="bt bt-faixa">${ribbon(`${S} ${esc(label)} ${S}`)}</span>`
      case 'pilula':
        return `<span class="bt bt-pilula f-body">${esc(label)} <b>↗</b></span>`
      case 'carimbo':
        return `<span class="bt bt-carimbo f-letter">${esc(label)}</span>`
      case 'flutuante':
        return `<span class="bt bt-flut"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4a12 12 0 0 0-10.3 18.1L4 28l6.1-1.6A12 12 0 1 0 16 4zm6.6 16.7c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.3.1-2.1-.1a19 19 0 0 1-1.9-.7 14.7 14.7 0 0 1-5.6-5c-.4-.6-1.1-1.7-1.1-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l1-1.2c.2-.3.5-.3.8-.2l2.2 1c.3.2.5.2.6.4.1.1.1.8-.2 1.6z"/></svg></span>`
      default:
        return `<span class="bt bt-selo">${badge(`${esc(label.toUpperCase())} • ${esc(label.toUpperCase())} •`, 'bt-badge')}<b class="bt-arrow">↗</b></span>`
    }
  }

  const dividerHTML = (v) => {
    switch (v) {
      case 'rasgado':
        return `<svg class="dv" viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12V5l6 3 5-5 7 4 6-3 4 5 8-6 5 4 7-2 4 4 6-5 7 3 4-2 6 5 5-4 8 3 4-4 6 4 5-3 7 4 4-5 6 3 5-2 6 4 5-3 3 2v6z"/></svg>`
      case 'escorrido':
        return `<svg class="dv" viewBox="0 0 160 16" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h160v4h-6v6a2 2 0 0 1-4 0V4h-22v9a2.5 2.5 0 0 1-5 0V4H96v5a2 2 0 0 1-4 0V4H62v10a2.5 2.5 0 0 1-5 0V4H34v6a2 2 0 0 1-4 0V4H12v4a2 2 0 0 1-4 0V4H0z" class="dv-top"/></svg>`
      case 'onda':
        return `<svg class="dv" viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12V7c5 0 5-5 10-5s5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5 5-5 10-5 5 5 10 5v5z"/></svg>`
      case 'ornamento':
        return `<div class="dv dv-orn"><i></i>${S}<i></i></div>`
      case 'diagonal':
        return `<svg class="dv" viewBox="0 0 160 14" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14L160 0v14z"/></svg>`
      default:
        return ''
    }
  }

  /* ------------------------------------------------------------------ */
  /* Paletas e fontes                                                    */
  /* ------------------------------------------------------------------ */

  const PALETTES = [
    { id: 'oxblood', name: 'Oxblood e osso', current: true, c: { paper: '#e7e1d5', ink: '#0e0c0c', accent: '#7d1a22', gold: '#a88b5a' }, desc: 'Papel cor de osso, preto de tinta, vermelho sangue escuro e um dourado envelhecido.' },
    { id: 'ouro', name: 'Preto e ouro velho', c: { paper: '#efe8d8', ink: '#0d0c0b', accent: '#a8792c', gold: '#d8b46a' }, desc: 'O dourado vira a cor principal. Ar mais luxuoso, de estúdio premium.' },
    { id: 'oldschool', name: 'Old school clássico', c: { paper: '#f2e6cc', ink: '#171412', accent: '#c62828', gold: '#e1a325' }, desc: 'Vermelho vivo e amarelo mostarda de cartela tradicional americana.' },
    { id: 'sangue', name: 'Sangue e carvão', c: { paper: '#d8d4cd', ink: '#121214', accent: '#a10f1d', gold: '#77716b' }, desc: 'Cinza frio de concreto, preto carvão e vermelho sangue mais forte.' },
    { id: 'musgo', name: 'Musgo e cobre', c: { paper: '#e5e0d1', ink: '#13160f', accent: '#34503a', gold: '#b36a3a' }, desc: 'Verde musgo com cobre. Mais natural, terroso, foge do vermelho.' },
    { id: 'marinho', name: 'Marinheiro', c: { paper: '#efe6d2', ink: '#0f1a2b', accent: '#b23a2e', gold: '#c9a15a' }, desc: 'Azul marinho no lugar do preto, com vermelho e dourado. Pegada sailor.' },
    { id: 'decalque', name: 'Roxo decalque', c: { paper: '#ebe7ee', ink: '#120f1a', accent: '#4b3fc4', gold: '#c48ab0' }, desc: 'O roxo do papel hectográfico como cor principal, com rosa antigo.' },
    { id: 'pb', name: 'Preto e branco', c: { paper: '#f3f2ef', ink: '#0a0a0a', accent: '#0a0a0a', gold: '#8c8c8c' }, desc: 'Só preto, branco e cinza. Blackwork puro, sem cor nenhuma.' },
    { id: 'custom', name: 'Quero escolher as cores', custom: true, c: { paper: '#e7e1d5', ink: '#0e0c0c', accent: '#7d1a22', gold: '#a88b5a' }, desc: 'Monte a sua: toque nas bolinhas pra escolher cada cor.' },
  ]
  const COLOR_LABEL = { paper: 'fundo (papel)', ink: 'tinta (preto)', accent: 'destaque', gold: 'apoio' }

  const FONTS = {
    display: [
      { id: 'pirata', name: 'Pirata One', css: "'Pirata One'", current: true, desc: 'Gótica com pegada de tatuagem. É a do nome gigante e dos títulos.' },
      { id: 'unifraktur', name: 'UnifrakturCook', css: "'UnifrakturCook'", w: 700, desc: 'Gótica clássica, mais pesada e tradicional.' },
      { id: 'grenze', name: 'Grenze Gotisch', css: "'Grenze Gotisch'", w: 700, desc: 'Gótica moderna, mais fácil de ler.' },
      { id: 'fruktur', name: 'Fruktur', css: "'Fruktur'", desc: 'Gótica cheia de curvas, bem marcante.' },
      { id: 'newrocker', name: 'New Rocker', css: "'New Rocker'", desc: 'Gótica com cara de rock e heavy metal.' },
      { id: 'abril', name: 'Abril Fatface', css: "'Abril Fatface'", desc: 'Serifada de revista: contraste alto, elegante.' },
      { id: 'cinzeldeco', name: 'Cinzel Decorative', css: "'Cinzel Decorative'", w: 700, wide: true, desc: 'Letra romana com floreios. Clássica e de luxo.' },
      { id: 'playfair', name: 'Playfair Display itálico', css: "'Playfair Display'", w: 700, it: true, desc: 'Itálica editorial, sofisticada.' },
    ],
    letter: [
      { id: 'rye', name: 'Rye', css: "'Rye'", current: true, desc: 'Letreiro de faroeste. Hoje está nas faixas, etiquetas e pequenos títulos.' },
      { id: 'sancreek', name: 'Sancreek', css: "'Sancreek'", desc: 'Letreiro de circo, mais decorado.' },
      { id: 'smokum', name: 'Smokum', css: "'Smokum'", desc: 'Faroeste mais estreito e rústico.' },
      { id: 'cinzel', name: 'Cinzel', css: "'Cinzel'", w: 700, desc: 'Romana clássica, séria e elegante.' },
      { id: 'elite', name: 'Special Elite', css: "'Special Elite'", desc: 'Máquina de escrever gasta, cara de ficha antiga.' },
      { id: 'fell', name: 'IM Fell English', css: "'IM Fell English SC'", desc: 'Tipografia de livro antigo, toda em versalete.' },
    ],
    cond: [
      { id: 'anton', name: 'Anton', css: "'Anton'", current: true, desc: 'Condensada pesada. Hoje está nas chamadas grandes e nas faixas.' },
      { id: 'bebas', name: 'Bebas Neue', css: "'Bebas Neue'", desc: 'Condensada mais leve e limpa.' },
      { id: 'oswald', name: 'Oswald', css: "'Oswald'", w: 600, desc: 'Condensada moderna, boa de ler.' },
      { id: 'league', name: 'League Gothic', css: "'League Gothic'", desc: 'Bem estreita, estilo cartaz antigo.' },
      { id: 'antonio', name: 'Antonio', css: "'Antonio'", w: 700, desc: 'Estreita e alta, mais elegante.' },
      { id: 'alfa', name: 'Alfa Slab One', css: "'Alfa Slab One'", desc: 'Serifa grossa de cartaz de circo. Mais larga.' },
    ],
    body: [
      { id: 'dmsans', name: 'DM Sans', css: "'DM Sans'", current: true, desc: 'Sem serifa limpa. É a dos textos corridos.' },
      { id: 'inter', name: 'Inter', css: "'Inter'", desc: 'Neutra e muito legível em tela.' },
      { id: 'grotesk', name: 'Space Grotesk', css: "'Space Grotesk'", desc: 'Sem serifa com personalidade, mais moderna.' },
      { id: 'worksans', name: 'Work Sans', css: "'Work Sans'", desc: 'Sem serifa amigável e aberta.' },
      { id: 'cormorant', name: 'Cormorant Garamond', css: "'Cormorant Garamond'", w: 500, desc: 'Serifada fina e clássica, ar artístico.', big: true },
      { id: 'garamond', name: 'EB Garamond', css: "'EB Garamond'", desc: 'Serifada de livro, tradicional.' },
      { id: 'mono', name: 'IBM Plex Mono', css: "'IBM Plex Mono'", desc: 'Monoespaçada, cara de máquina de escrever moderna.', small: true },
    ],
  }
  const FONT_FALLBACK = { display: 'serif', letter: 'serif', cond: 'Impact, sans-serif', body: 'system-ui, sans-serif' }

  const TYPE_PRESETS = [
    { name: 'Old school (atual)', f: { 'f-display': 'pirata', 'f-letter': 'rye', 'f-cond': 'anton', 'f-body': 'dmsans' } },
    { name: 'Gótico elegante', f: { 'f-display': 'unifraktur', 'f-letter': 'cinzel', 'f-cond': 'oswald', 'f-body': 'cormorant' } },
    { name: 'Faroeste', f: { 'f-display': 'newrocker', 'f-letter': 'smokum', 'f-cond': 'alfa', 'f-body': 'worksans' } },
    { name: 'Editorial', f: { 'f-display': 'playfair', 'f-letter': 'fell', 'f-cond': 'bebas', 'f-body': 'inter' } },
    { name: 'Punk xerox', f: { 'f-display': 'grenze', 'f-letter': 'elite', 'f-cond': 'league', 'f-body': 'mono' } },
    { name: 'Clássico luxo', f: { 'f-display': 'cinzeldeco', 'f-letter': 'cinzel', 'f-cond': 'antonio', 'f-body': 'garamond' } },
  ]

  const DEFAULT_TEXTS = {
    nome: 'Marchello',
    cidade: 'Extrema — MG',
    desde: '2020',
    heroFrase: 'Tatuagem autoral. Neotradicional · Blackwork · Fine line.',
    estilos: 'Neotradicional, Blackwork, Realismo, Fine line, Ornamental, Old school',
    manifesto:
      'Cada traço começa como decalque e termina como parte de quem você é. Desenhos autorais, feitos à mão, pensados pra envelhecer bonito na pele — e pra nunca existirem duas vezes.',
    flashLead: 'Os 12 desenhos mais fortes da cartela. Todos exclusivos: cada um é tatuado uma única vez e depois sai da cartela pra sempre.',
    bio1: 'Tatuador desde 2020, Marchello faz de tudo, mas é no neotradicional que o traço dele fala mais alto: contornos firmes, sombras profundas e cor só onde ela importa.',
    bio2: 'Cada projeto nasce de uma conversa, vira desenho no papel e só depois encontra a pele. Sem pressa, sem cópia.',
    tatuagens: '1000+',
    contatoTitulo: 'Bora marcar a sua próxima?',
    whatsapp: '+55 35 9 9870-7678',
    instagram: '@marchello.ink',
    endereco: 'Praça Presidente Vargas, 40 — Centro, Extrema/MG · CEP 37640-076',
    horario: '',
  }
  const TEXT_FIELDS = [
    { id: 'nome', label: 'Nome que aparece no site' },
    { id: 'cidade', label: 'Cidade' },
    { id: 'desde', label: 'Tatua desde (ano)' },
    { id: 'heroFrase', label: 'Frase da abertura', rows: 2 },
    { id: 'estilos', label: 'Estilos que aparecem nas faixas (separe por vírgula)', rows: 2 },
    { id: 'manifesto', label: 'Manifesto (texto grande logo depois da abertura)', rows: 4 },
    { id: 'flashLead', label: 'Texto da vitrine de destaques', rows: 3 },
    { id: 'bio1', label: 'Sobre você: 1º parágrafo', rows: 4 },
    { id: 'bio2', label: 'Sobre você: 2º parágrafo', rows: 3 },
    { id: 'tatuagens', label: 'Quantas tatuagens já fez (aprox.)', hint: 'Hoje está 1000+, que é um número provisório.' },
    { id: 'contatoTitulo', label: 'Chamada do contato' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'endereco', label: 'Endereço do estúdio', rows: 2 },
    { id: 'horario', label: 'Horário de atendimento (hoje não aparece no site)', placeholder: 'Ex.: terça a sábado, 10h às 19h', rows: 2 },
  ]

  const SECTIONS = [
    { id: 'manifesto', name: 'Manifesto', desc: 'Texto grande que vai sendo pintado palavra por palavra.' },
    { id: 'flash', name: 'Vitrine de destaques', desc: 'As 12 melhores artes do flash.' },
    { id: 'cartela', name: 'Cartela completa', desc: 'Todas as 44 artes, com filtro por estilo.' },
    { id: 'decalque', name: 'Do papel à pele', desc: 'O decalque roxo virando tatuagem, com uma arte real sua.' },
    { id: 'sobre', name: 'Sobre o artista', desc: 'Sua foto, bio e números.' },
    { id: 'contato', name: 'Contato e rodapé', desc: 'WhatsApp, Instagram e endereço.' },
  ]

  const ic = (d) => `<svg class="m-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`
  const NEW_SECTIONS = [
    { id: 'portfolio', name: 'Tatuagens já feitas', desc: 'Fotos reais na pele, cicatrizadas.', icon: 'M4 6h16v12H4zM4 15l5-5 4 4 3-3 4 4M15 9.5h.01', spec: 'Galeria de fotos de tatuagens prontas (pedir fotos ao cliente).' },
    { id: 'depoimentos', name: 'Depoimentos', desc: 'Frases ou prints de quem já tatuou.', icon: 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5', spec: 'Seção de depoimentos (pedir prints/frases).' },
    { id: 'faq', name: 'Perguntas frequentes', desc: 'Dói? Quanto custa? Como agendar?', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 16.5h.01', spec: 'FAQ em acordeão (pedir as perguntas e respostas).' },
    { id: 'cuidados', name: 'Cuidados pós-tattoo', desc: 'Passo a passo da cicatrização.', icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11zM9.5 14.5l2 2 3.5-4', spec: 'Seção de cuidados pós-tatuagem em passos.' },
    { id: 'orcamento', name: 'Formulário de orçamento', desc: 'Ideia, tamanho, local do corpo e referência.', icon: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 15h7M9 18h4', spec: 'Formulário de orçamento que monta a mensagem e abre o WhatsApp (sem back-end).' },
    { id: 'instagram', name: 'Feed do Instagram', desc: 'Últimos posts do @marchello.ink.', icon: 'M4 4h16v16H4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 7h.01', spec: 'Grade com os últimos posts do Instagram (embed ou imagens fixas).' },
    { id: 'mapa', name: 'Mapa do estúdio', desc: 'Mapa com rota até o estúdio.', icon: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', spec: 'Mapa (embed do Google Maps) na seção de contato.' },
    { id: 'precos', name: 'Faixa de preços', desc: 'A partir de quanto, por tamanho.', icon: 'M3 12l9-9h8v8l-9 9zM15.5 8.5h.01', spec: 'Tabela "a partir de" por tamanho (pedir valores).' },
    { id: 'agenda', name: 'Datas disponíveis', desc: 'Agenda do mês e flash days.', icon: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2', spec: 'Calendário/lista de datas livres e flash days (editável no código).' },
    { id: 'video', name: 'Vídeo do processo', desc: 'Timelapse de uma sessão.', icon: 'M4 5h16v14H4zM10 9l5 3-5 3z', spec: 'Vídeo/timelapse em loop (pedir o arquivo).' },
    { id: 'estudio', name: 'Fotos do estúdio', desc: 'O espaço, a higiene, os materiais.', icon: 'M3 20h18M5 20V9l7-5 7 5v11M10 20v-6h4v6', spec: 'Galeria do estúdio (pedir fotos).' },
  ]

  /* ------------------------------------------------------------------ */
  /* Etapas e itens                                                      */
  /* ------------------------------------------------------------------ */

  const fontCat = (key, title, desc, sample) => ({
    id: `f-${key}`,
    title,
    desc,
    stage: 'font',
    options: FONTS[key].map((f) => ({
      ...f,
      spec: `Google Fonts "${f.name.replace(' itálico', '')}"${f.w ? ` ${f.w}` : ''}${f.it ? ' italic' : ''} em --${key === 'body' ? 'sans' : key}`,
      vars: { [`--pv-f-${key}`]: `${f.css}, ${FONT_FALLBACK[key]}`, [`--pv-w-${key}`]: f.w || 400, [`--pv-st-${key}`]: f.it ? 'italic' : 'normal' },
      html: sample(f),
    })),
  })

  const STEPS = [
    {
      id: 'identidade',
      short: 'Cores',
      title: 'Cores e identidade',
      intro: 'A base de tudo: as cores, o logo e a textura do fundo. Ao escolher uma paleta, todas as miniaturas da página mudam de cor junto.',
      cats: [
        {
          id: 'paleta',
          title: 'Paleta de cores',
          desc: 'As 4 cores que pintam o site inteiro.',
          stage: 'palette',
          options: PALETTES.map((p) => ({
            ...p,
            spec: p.custom ? 'Paleta personalizada (ver cores abaixo)' : `--paper ${p.c.paper} · --ink ${p.c.ink} · --red ${p.c.accent} · --brass ${p.c.gold}`,
            vars: { '--pv-paper': p.c.paper, '--pv-ink': p.c.ink, '--pv-accent': p.c.accent, '--pv-gold': p.c.gold },
            html: `<span class="pal"><span class="pal-top"><span class="f-display">Marchello</span>${ribbon(`${S} flash ${S}`)}</span><span class="pal-dark"><span class="f-letter">${S} agenda aberta ${S}</span><b class="f-cond">Bora marcar</b></span><span class="pal-sw">${['paper', 'ink', 'accent', 'gold'].map((k) => `<i style="background:var(--pv-${k})"></i>`).join('')}</span></span>`,
          })),
        },
        {
          id: 'contraste',
          title: 'Claro e escuro',
          desc: 'Como o fundo claro (papel) e o escuro (tinta) se dividem pelas seções.',
          stage: 'wide',
          options: [
            { id: 'alterna', name: 'Alternando', current: true, desc: 'Abertura e cartela no papel claro; flash, sobre e rodapé no escuro.', spec: 'Mantém alternância atual', html: stripes(['p', 'i', 'p', 'p', 'i', 'i']) },
            { id: 'escuro', name: 'Quase tudo escuro', desc: 'Site noturno, fundo preto do começo ao fim. As artes saltam mais.', spec: 'Todas as seções com fundo --ink e texto --paper; cards continuam claros', html: stripes(['i', 'i', 'i', 'i', 'i', 'i']) },
            { id: 'claro', name: 'Quase tudo claro', desc: 'Papel em tudo, preto só no rodapé. Mais leve e limpo.', spec: 'Todas as seções em --paper; só o rodapé em --ink', html: stripes(['p', 'p', 'p', 'p', 'p', 'i']) },
            { id: 'sistema', name: 'Segue o celular', desc: 'Fica escuro se o celular da pessoa estiver no modo escuro.', spec: 'prefers-color-scheme: versão clara (atual) e versão escura completa', html: `<span class="cx-split">${stripes(['p', 'i', 'p', 'p', 'i', 'i'])}${stripes(['i', 'i', 'i', 'i', 'i', 'i'])}<b>☀︎ / ☾</b></span>` },
            { id: 'botao', name: 'Botão pra trocar', desc: 'Um botãozinho no menu deixa a pessoa escolher claro ou escuro.', spec: 'Toggle claro/escuro no menu, lembrado em localStorage', html: `${stripes(['p', 'i', 'p', 'p', 'i', 'i'])}<span class="cx-toggle"><i></i></span>` },
          ],
        },
        {
          id: 'logo',
          title: 'Logo / marca',
          desc: 'O que aparece no canto do menu e nos selos.',
          stage: 'logo',
          options: [
            { id: 'm', name: '“M.” gótico', current: true, desc: 'A inicial na fonte dos títulos, com o ponto vermelho.', spec: 'Mantém "M." em --display', html: logoHTML('m') },
            { id: 'selo', name: 'Selo redondo', desc: 'Monograma dentro de um selo com o nome em volta.', spec: 'Logo em selo circular SVG: nome em textPath + inicial no centro', html: logoHTML('selo') },
            { id: 'nome', name: 'Nome completo', desc: '“Marchello” por extenso, com “ink · tattoo” embaixo.', spec: 'Logo tipográfico: nome em --display + "ink · tattoo" em --letter', html: logoHTML('nome') },
            { id: 'assinatura', name: 'Assinatura', desc: 'Seu nome como se fosse assinado à mão.', spec: 'Logo em script (Mrs Saint Delafield) ou assinatura real vetorizada', html: logoHTML('assinatura') },
            { id: 'andorinha', name: 'Andorinha + nome', desc: 'A andorinha old school do site junto do nome.', spec: 'Logo com a andorinha (FlashArt swallow) + nome em --condensed', html: logoHTML('andorinha') },
            { id: 'enviar', name: 'Tenho um logo', desc: 'Já tenho logo pronto e vou mandar o arquivo.', spec: 'Cliente vai enviar arquivo de logo próprio', html: logoHTML('enviar') },
          ],
        },
        {
          id: 'textura',
          title: 'Textura do fundo',
          desc: 'O “acabamento” do papel por trás de tudo.',
          stage: 'tex',
          options: [
            { id: 'grao', name: 'Grão de papel', current: true, desc: 'Ruído fininho e animado, como papel e filme antigo.', spec: 'Mantém .grain animado (opacity .08)' },
            { id: 'envelhecido', name: 'Papel envelhecido', desc: 'Manchas de tempo e bordas mais escuras, como cartela velha.', spec: 'Fundo com manchas (radial-gradients) + vinheta nas bordas + grão' },
            { id: 'kraft', name: 'Papel kraft', desc: 'Papel pardo com fibras, ar artesanal.', spec: 'Textura kraft: tom pardo multiplicado + fibras' },
            { id: 'xerox', name: 'Xerox / fotocópia', desc: 'Granulado forte e pontinhos pretos, estética punk.', spec: 'Ruído forte + speckles, contraste alto' },
            { id: 'pele', name: 'Pele', desc: 'Tom quente e poros sutis, como se o site fosse pele.', spec: 'Overlay quente (skin #d39c7c ~12%) + ruído fino de poros' },
            { id: 'liso', name: 'Liso', desc: 'Sem textura nenhuma. Mais limpo e moderno.', spec: 'Remove .grain' },
          ].map((o) => ({ ...o, html: `<span class="tx" data-tex="${o.id}"><span class="f-display">Marchello</span><span class="f-letter">${S} flash ${S}</span></span>` })),
        },
      ],
    },
    {
      id: 'tipografia',
      short: 'Letras',
      title: 'Tipografia',
      intro: 'São 4 tipos de letra no site. Dá pra trocar cada um ou usar uma combinação pronta logo abaixo.',
      presets: true,
      cats: [
        fontCat('display', 'Letra dos títulos', 'O nome gigante na abertura, os títulos das seções e o nome das artes.', (f) => `<span class="fs fs-display"><b class="f-display" ${f.wide ? 'style="font-size:12.5cqw"' : ''}>Marchello</b><small class="f-display">Flash sheet · Gueixa</small></span>`),
        fontCat('letter', 'Letra de letreiro', 'Detalhes: faixas, etiquetas “Nº 01”, “★ manifesto ★”.', () => `<span class="fs fs-letter"><span class="f-letter">${S} agenda aberta ${S}</span>${ribbon(`${S} Tattoo · desde 2020 ${S}`)}<small class="f-letter">Nº 07 · Neotradicional</small></span>`),
        fontCat('cond', 'Letra condensada', 'Chamadas grandes em caixa alta e as faixas de estilos.', () => `<span class="fs fs-cond"><b class="f-cond">Bora marcar a sua próxima?</b><small class="f-cond">Neotradicional · Blackwork · Fine line</small></span>`),
        fontCat('body', 'Letra dos textos', 'Parágrafos, bio, descrições e botões.', (f) => `<span class="fs fs-body ${f.big ? 'is-big' : ''} ${f.small ? 'is-small' : ''}"><span class="f-body">Cada traço começa como <em>decalque</em> e termina como parte de quem você é.</span><small class="f-body">Aa Bb Cc · 0123 · ação</small></span>`),
      ],
    },
    {
      id: 'visual',
      short: 'Visual',
      title: 'Estilo visual',
      intro: 'O jeito das ilustrações, molduras, cantos e divisões. É aqui que se decide se o site continua flash old school ou muda de cara.',
      cats: [
        {
          id: 'arte',
          title: 'Estilo das ilustrações e ornamentos',
          desc: 'Os desenhos decorativos espalhados pelo site (andorinhas, faixas, molduras). Suas artes do flash não mudam.',
          stage: 'wide',
          options: [
            { id: 'oldschool', name: 'Flash old school + neotradicional', current: true, desc: 'Andorinhas, faixas, estrelas e cantoneiras de cartela.', spec: 'Mantém ornamentos atuais (andorinhas, ribbon, cantoneiras, ★)', html: `<span class="ar ar-old"><span class="ar-sw l">${SWALLOW}</span>${ribbon(`${S} flash ${S}`)}<span class="ar-sw r">${SWALLOW}</span></span>` },
            { id: 'ornamental', name: 'Neotradicional ornamental', desc: 'Molduras em arco, filigranas, joias e curvas art nouveau.', spec: 'Ornamentos art nouveau: molduras em arco, filigranas, joias (SVG)', html: artOrnamental() },
            { id: 'blackwork', name: 'Blackwork geométrico', desc: 'Mandalas, pontilhismo e geometria sagrada em preto.', spec: 'Ornamentos geométricos/dotwork (mandalas, pontilhado) em SVG', html: artBlackwork() },
            { id: 'fineline', name: 'Fine line minimalista', desc: 'Traços finíssimos, ramos e muito respiro.', spec: 'Ornamentos em linha fina (stroke 1px), botânicos, muito espaço vazio', html: artFineline() },
            { id: 'japones', name: 'Japonês (irezumi)', desc: 'Ondas, nuvens e sol vermelho.', spec: 'Ornamentos japoneses: ondas seigaiha, nuvens, sol (SVG)', html: artJapones() },
            { id: 'gotico', name: 'Gótico / sacro', desc: 'Arcos de igreja, vitrais, velas e cruzes.', spec: 'Ornamentos góticos: arcos ogivais, vitral, velas, cruz (SVG)', html: artGotico() },
            { id: 'punk', name: 'Colagem punk / xerox', desc: 'Recortes, fita crepe e letras de bilhete de resgate.', spec: 'Estética colagem: recortes tortos, fita crepe, letras ransom, xerox', html: `<span class="ar ar-punk"><span class="pk-paper a"></span><span class="pk-paper b"></span><span class="pk-word"><b class="r1">I</b><b class="r2">N</b><b class="r3">K</b></span><span class="pk-tape"></span><span class="pk-sub f-letter">tattoo · extrema</span></span>` },
          ],
        },
        {
          id: 'simbolo',
          title: 'Símbolo decorativo',
          desc: 'O sinal que aparece entre palavras: “★ manifesto ★”, nas faixas e nos pontos da pincelada.',
          stage: 'sym',
          options: [
            ['estrela', 'Estrela', true, 'A estrela old school de hoje.'],
            ['brilho', 'Brilho', false, 'Estrela de 4 pontas, mais delicada.'],
            ['gota', 'Gota de tinta', false, 'Uma gota, ligando com a tinta do site.'],
            ['losango', 'Losango', false, 'Geométrico e discreto.'],
            ['lua', 'Lua', false, 'Lua crescente, mais místico.'],
            ['cruz', 'Cruz de malta', false, 'Cruz pattée, clima tradicional/sacro.'],
            ['coracao', 'Coração', false, 'Coração old school.'],
            ['nenhum', 'Nenhum', false, 'Sem símbolo, só o texto.'],
          ].map(([id, name, current, desc]) => ({
            id,
            name,
            current,
            desc,
            spec: id === 'nenhum' ? 'Remove os ★ dos textos e da pincelada' : `Troca ★ por símbolo "${name}" (SVG) em eyebrows, marquee, ribbon e ink-stops`,
            vars: { '--pv-sym': symMask(id), '--pv-sym-w': id === 'nenhum' ? '0' : '.72em' },
            html: `<span class="sy"><span class="sy-big">${S}</span><span class="f-letter sy-eye">${S} manifesto ${S}</span><span class="sy-band f-cond"><span>Blackwork ${S} Fine line ${S} Realismo ${S}</span></span></span>`,
          })),
        },
        {
          id: 'moldura',
          title: 'Moldura das artes do flash',
          desc: 'Como cada arte aparece na vitrine e na cartela.',
          stage: 'card',
          options: [
            { id: 'atual', name: 'Cartela com cantoneiras', current: true, desc: 'Moldura dupla, cantoneiras e número no topo.', spec: 'Mantém .flash-card-tilt atual' },
            { id: 'polaroid', name: 'Polaroid', desc: 'Foto instantânea com o nome escrito à mão.', spec: 'Card estilo polaroid: fundo branco, margem inferior grande, nome em script' },
            { id: 'fita', name: 'Colada com fita', desc: 'Papel solto, torto, preso com fita crepe.', spec: 'Card de papel sem borda, rotação leve, 2 fitas crepe nos cantos' },
            { id: 'arco', name: 'Arco ornamental', desc: 'Moldura em arco, como janela de igreja ou espelho antigo.', spec: 'Card em arco (border-radius topo 999px) com borda dupla' },
            { id: 'ticket', name: 'Ingresso picotado', desc: 'Bordas picotadas e linha tracejada, como ticket.', spec: 'Card ticket: recortes laterais (mask radial), linha tracejada, número' },
            { id: 'escura', name: 'Moldura escura e dourada', desc: 'Card preto com filete dourado. Mais luxuoso.', spec: 'Card --ink com borda interna --brass, textos dourados' },
            { id: 'solta', name: 'Sem moldura', desc: 'Só a arte solta no fundo, com o nome embaixo.', spec: 'Remove moldura: arte direto no fundo + legenda' },
          ].map((o) => ({ ...o, html: `<span class="fr" data-frame="${o.id}">${card()}</span>` })),
        },
        {
          id: 'imagens',
          title: 'Tratamento das artes',
          desc: 'Um filtro aplicado nas imagens do flash (as artes originais não mudam).',
          stage: 'card',
          options: [
            { id: 'original', name: 'Original', current: true, desc: 'As cores como você desenhou.', spec: 'Sem filtro' },
            { id: 'pb', name: 'P&B que ganha cor', desc: 'Em preto e branco; a cor aparece quando passa o mouse ou rola até ela.', spec: 'filter: grayscale(1) → cor no hover/inview' },
            { id: 'sepia', name: 'Envelhecida', desc: 'Tom sépia, como cartela antiga de estúdio.', spec: 'filter: sepia(.65) contrast(1.05)' },
            { id: 'contraste', name: 'Alto contraste', desc: 'Pretos mais fortes, cara de impressão.', spec: 'filter: contrast(1.5) saturate(.9)' },
            { id: 'duotone', name: 'Duas cores', desc: 'Só o preto e a cor de destaque da paleta.', spec: 'Duotone: grayscale + mix-blend multiply sobre --red' },
            { id: 'pele', name: 'Na pele', desc: 'A arte aparece como se já estivesse tatuada.', spec: 'Fundo de pele + mix-blend-mode multiply na arte' },
          ].map((o) => ({ ...o, html: `<span class="fr" data-img="${o.id}">${card('mulher-peonia', 'Mulher e peônia', '12')}</span>` })),
        },
        {
          id: 'cantos',
          title: 'Cantos e formas',
          desc: 'O formato dos cards, botões e etiquetas.',
          stage: 'shape',
          options: [
            { id: 'retos', name: 'Retos', current: true, desc: 'Quase sem arredondar, como papel cortado.', spec: 'border-radius ~3px (atual)', r: '3px' },
            { id: 'suaves', name: 'Levemente arredondados', desc: 'Arredondado discreto, mais moderno.', spec: 'border-radius 10px', r: '10px' },
            { id: 'redondos', name: 'Bem arredondados', desc: 'Formas macias, botões em pílula.', spec: 'border-radius 22px + botões pílula', r: '22px' },
            { id: 'chanfro', name: 'Chanfrados', desc: 'Cantos cortados na diagonal, como etiqueta.', spec: 'clip-path com cantos chanfrados', r: '0px' },
            { id: 'organico', name: 'Orgânicos', desc: 'Bordas irregulares, como mancha de tinta.', spec: 'border-radius irregular (blob) / filtro de borda de tinta', r: '14px' },
          ].map((o) => ({ ...o, vars: { '--pv-radius': o.r }, html: `<span class="sh" data-corner="${o.id}"><span class="sh-card"><span class="f-display">Gueixa</span><i></i></span><span class="sh-btn f-cond">Quero essa</span><span class="sh-chip f-body">Blackwork</span></span>` })),
        },
        {
          id: 'divisores',
          title: 'Divisão entre seções',
          desc: 'Como uma parte do site termina e a outra começa.',
          stage: 'div',
          options: [
            { id: 'reto', name: 'Corte reto', current: true, desc: 'Muda de cor em linha reta.', spec: 'Sem divisor (atual)' },
            { id: 'rasgado', name: 'Papel rasgado', desc: 'Borda irregular de papel rasgado.', spec: 'Divisor SVG de papel rasgado entre seções' },
            { id: 'escorrido', name: 'Tinta escorrendo', desc: 'A tinta da seção de cima escorre na de baixo.', spec: 'Divisor SVG de escorridos (animados no scroll)' },
            { id: 'onda', name: 'Onda', desc: 'Ondinha, combina com estilo japonês.', spec: 'Divisor SVG ondulado' },
            { id: 'ornamento', name: 'Filete com símbolo', desc: 'Linha fina com o símbolo no meio.', spec: 'Filete + símbolo centralizado entre seções' },
            { id: 'diagonal', name: 'Diagonal', desc: 'Corte inclinado, mais dinâmico.', spec: 'Divisor diagonal (clip-path) entre seções' },
          ].map((o) => ({ ...o, html: `<span class="dvw" data-div="${o.id}"><span class="dvw-top"><span class="f-display">Flash</span></span>${dividerHTML(o.id)}<span class="dvw-bot"><span class="f-display">Cartela</span></span></span>` })),
        },
      ],
    },
    {
      id: 'animacoes',
      short: 'Animações',
      title: 'Animações',
      intro: 'Todas as miniaturas daqui estão se mexendo de verdade. Escolha quanto o site se mexe e o jeito de cada efeito.',
      cats: [
        {
          id: 'intensidade',
          title: 'Quantidade de animação',
          desc: 'O quanto o site inteiro se mexe. Menos animação = carrega mais rápido.',
          stage: 'anim',
          options: [
            { id: 'maxima', name: 'Ainda mais', level: 5, desc: 'Tudo de hoje e mais: partículas, mais 3D, mais tinta.', spec: 'Intensidade máxima: adicionar efeitos (partículas de tinta, mais parallax/3D)' },
            { id: 'atual', name: 'Bastante (atual)', level: 4, current: true, desc: 'Como está hoje: tudo se mexe, cheio de efeitos.', spec: 'Mantém' },
            { id: 'moderada', name: 'Moderada', level: 3, desc: 'Fica a pincelada e a entrada dos textos; sai o que pesa.', spec: 'Remover efeitos pesados (tilt, pincel no mouse, drips no scroll); manter reveals' },
            { id: 'sutil', name: 'Sutil', level: 2, desc: 'Só aparições suaves e curtas.', spec: 'Só fades/slides curtos; sem pin/scrub/canvas' },
            { id: 'nenhuma', name: 'Nenhuma', level: 1, desc: 'Site parado. Mais rápido e direto.', spec: 'Desligar animações (equivalente a prefers-reduced-motion)' },
          ].map((o) => ({ ...o, html: `<span class="in" style="--lv:${o.level}"><span class="in-meter">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= o.level ? 'on' : ''}"></i>`).join('')}</span><span class="in-demo"><span class="in-a"></span><span class="in-b"></span><span class="in-c f-display">M</span></span></span>` })),
        },
        {
          id: 'preloader',
          title: 'Tela de entrada',
          desc: 'O que aparece por 2–3 segundos enquanto o site carrega.',
          stage: 'anim',
          options: [
            { id: 'gota', name: 'Gota de tinta', current: true, desc: 'Contador até 100, uma gota cai, a tinta inunda a tela e sobe como cortina.', spec: 'Mantém Preloader atual' },
            { id: 'agulha', name: 'Agulha desenhando', desc: 'A inicial é desenhada traço a traço, como se fosse tatuada.', spec: 'Preloader: inicial em SVG desenhada com DrawSVG, depois fade' },
            { id: 'linha', name: 'Linha e nome', desc: 'Uma linha fina corre a tela e o nome aparece.', spec: 'Preloader: linha de progresso + nome com reveal' },
            { id: 'rasgo', name: 'Papel rasgando', desc: 'A tela é um papel que rasga no meio e abre o site.', spec: 'Preloader: duas metades com borda rasgada que se separam' },
            { id: 'carimbo', name: 'Carimbo', desc: 'O selo da marca é carimbado na tela.', spec: 'Preloader: selo carimbado (scale+rotate) com respingos' },
            { id: 'sem', name: 'Sem tela de entrada', desc: 'O site abre direto, sem espera.', spec: 'Remover Preloader' },
          ].map((o) => ({ ...o, html: preloaderHTML(o.id) })),
        },
        {
          id: 'entrada',
          title: 'Como os textos aparecem',
          desc: 'A animação dos títulos quando entram na tela.',
          stage: 'anim',
          options: [
            { id: 'sobe', name: 'Letras sobem girando', current: true, desc: 'Cada letra sobe com um giro leve, uma depois da outra.', spec: 'Mantém SplitText chars yPercent+rotate' },
            { id: 'suave', name: 'Surge suave', desc: 'O título inteiro aparece subindo devagar.', spec: 'Reveal simples: opacity + y 20px, sem split' },
            { id: 'maquina', name: 'Máquina de escrever', desc: 'Letra por letra, com cursor piscando.', spec: 'Typewriter: chars com steps + caret' },
            { id: 'borrao', name: 'Tinta borrando', desc: 'Começa borrado como tinta e vai ficando nítido.', spec: 'Reveal com blur(10px)→0 + letter-spacing' },
            { id: 'traco', name: 'Traço desenhado', desc: 'O contorno da letra é desenhado e depois preenchido.', spec: 'Títulos em SVG text com stroke-dash desenhando + fill' },
            { id: 'carimbo', name: 'Carimbo', desc: 'O título cai na tela como um carimbo.', spec: 'Reveal com scale 1.6→1 + rotate, ease back' },
            { id: 'cortina', name: 'Cortina', desc: 'Uma máscara corre e revela o texto.', spec: 'Reveal com clip-path inset da esquerda pra direita' },
          ].map((o) => ({ ...o, html: entradaHTML(o.id) })),
        },
        {
          id: 'rolagem',
          title: 'Efeito ao rolar a página',
          desc: 'O que acompanha a pessoa enquanto ela desce pelo site.',
          stage: 'anim',
          options: [
            { id: 'pincel', name: 'Pincelada de tinta', current: true, desc: 'Um traço de pincel desce pela margem e estoura numa mancha em cada seção.', spec: 'Mantém InkBrush' },
            { id: 'agulha', name: 'Linha de agulha', desc: 'Uma linha fina e precisa, como traço de fine line.', spec: 'Trocar InkBrush por linha fina (1–2px) com ponta de agulha' },
            { id: 'gotas', name: 'Gotas escorrendo', desc: 'Escorridos de tinta descem do topo conforme rola.', spec: 'Drips no topo de cada seção crescendo com scroll' },
            { id: 'barra', name: 'Barra de progresso', desc: 'Uma barrinha no topo mostra quanto falta.', spec: 'Barra fixa no topo com scaleX = progresso' },
            { id: 'parallax', name: 'Artes em camadas', desc: 'As artes se movem em velocidades diferentes, dando profundidade.', spec: 'Parallax em camadas nas artes/ornamentos' },
            { id: 'nenhum', name: 'Nenhum', desc: 'Rola normal, sem efeito.', spec: 'Remover InkBrush e ink-stops' },
          ].map((o) => ({ ...o, html: rolagemHTML(o.id) })),
        },
        {
          id: 'hover',
          title: 'Ao passar o mouse nas artes',
          desc: 'No computador, o que a arte faz quando o mouse passa por cima.',
          stage: 'anim',
          options: [
            { id: 'tilt', name: 'Inclina em 3D', current: true, desc: 'O card inclina seguindo o mouse, com um brilho.', spec: 'Mantém tilt 3D + brilho' },
            { id: 'zoom', name: 'Zoom na arte', desc: 'A arte aproxima um pouco dentro da moldura.', spec: 'Hover: img scale 1.12 dentro do card' },
            { id: 'cor', name: 'Ganha cor', desc: 'Sai do preto e branco pra cor.', spec: 'Hover: grayscale 1 → 0' },
            { id: 'levanta', name: 'Levanta', desc: 'O card sobe e ganha sombra, como papel saindo da mesa.', spec: 'Hover: translateY(-10px) + sombra' },
            { id: 'info', name: 'Mostra detalhes', desc: 'Sobe uma faixa com nome, estilo e tamanho.', spec: 'Hover: overlay com nome/estilo/tamanho' },
            { id: 'nada', name: 'Nada', desc: 'Fica parado.', spec: 'Sem hover' },
          ].map((o) => ({ ...o, html: `<span class="hv" data-hv="${o.id}">${card('rei-caveira', 'Rei caveira', '04')}<span class="hv-info f-body"><b class="f-display">Rei caveira</b>Neotradicional · 18 cm</span><span class="fake-cursor">${cursorArrow}</span></span>` })),
        },
        {
          id: 'cursor',
          title: 'Cursor do mouse',
          desc: 'No computador, o formato da setinha do mouse.',
          stage: 'anim',
          options: [
            { id: 'anel', name: 'Ponto e anel', current: true, desc: 'Ponto com um anel que segue atrás e mostra palavrinhas (“bora!”).', spec: 'Mantém Cursor atual' },
            { id: 'gota', name: 'Gota de tinta', desc: 'Uma gotinha no lugar da seta.', spec: 'Cursor: gota SVG que cresce sobre links' },
            { id: 'maquina', name: 'Máquina de tattoo', desc: 'Uma maquininha que vibra sobre os botões.', spec: 'Cursor: ícone de máquina/agulha que vibra no hover' },
            { id: 'estrela', name: 'Estrela girando', desc: 'O símbolo do site girando devagar.', spec: 'Cursor: símbolo decorativo girando' },
            { id: 'rastro', name: 'Rastro de tinta', desc: 'Deixa um rastro de pontinhos de tinta.', spec: 'Cursor com rastro de tinta (canvas)' },
            { id: 'normal', name: 'Seta normal', desc: 'A seta de sempre do computador.', spec: 'Remover Cursor customizado' },
          ].map((o) => ({ ...o, html: cursorHTML(o.id) })),
        },
        {
          id: 'clique',
          title: 'Efeito ao clicar',
          desc: 'O que acontece no ponto onde a pessoa clica.',
          stage: 'anim',
          options: [
            { id: 'respingo', name: 'Respingo de tinta', current: true, desc: 'Uma mancha com respingos.', spec: 'Mantém Splatter' },
            { id: 'onda', name: 'Onda', desc: 'Um anel que se expande.', spec: 'Clique: ripple circular' },
            { id: 'simbolos', name: 'Chuva de símbolos', desc: 'Estrelinhas (ou o símbolo escolhido) espirram.', spec: 'Clique: burst de símbolos' },
            { id: 'gota', name: 'Gota que cai', desc: 'Uma gota escorre a partir do clique.', spec: 'Clique: gota que escorre' },
            { id: 'nada', name: 'Nada', desc: 'Sem efeito.', spec: 'Remover Splatter' },
          ].map((o) => ({ ...o, html: cliqueHTML(o.id) })),
        },
        {
          id: 'marquee',
          title: 'Faixa de estilos',
          desc: 'A faixa que passa com “Neotradicional ★ Blackwork ★ …” logo depois da abertura.',
          stage: 'anim',
          options: [
            { id: 'cruzadas', name: 'Duas faixas cruzadas', current: true, desc: 'Preta e vermelha, inclinadas, aceleram com o scroll.', spec: 'Mantém Marquee' },
            { id: 'unica', name: 'Uma faixa reta', desc: 'Uma faixa só, mais limpa.', spec: 'Marquee com uma faixa reta' },
            { id: 'contorno', name: 'Texto gigante vazado', desc: 'Letras enormes só no contorno, passando devagar.', spec: 'Marquee de texto outline gigante' },
            { id: 'artes', name: 'Faixa de artes', desc: 'No lugar das palavras, passam as artes do flash.', spec: 'Marquee de imagens do flash' },
            { id: 'nenhuma', name: 'Sem faixa', desc: 'Tira essa parte.', spec: 'Remover Marquee' },
          ].map((o) => ({ ...o, html: marqueeHTML(o.id) })),
        },
        {
          id: 'som',
          title: 'Som',
          desc: 'Hoje o site é mudo.',
          stage: 'anim',
          options: [
            { id: 'mudo', name: 'Sem som', current: true, desc: 'Silêncio total.', spec: 'Mantém sem áudio' },
            { id: 'maquina', name: 'Máquina na entrada', desc: 'Um zumbido curto de máquina de tattoo ao abrir (se a pessoa tocar na tela).', spec: 'Áudio curto de máquina no preloader após gesto do usuário' },
            { id: 'cliques', name: 'Sons nos cliques', desc: 'Sonzinhos sutis ao clicar e trocar de arte.', spec: 'SFX curtos em cliques/lightbox (com botão mudo)' },
            { id: 'trilha', name: 'Trilha ambiente', desc: 'Música de fundo com botão liga/desliga.', spec: 'Trilha ambiente opcional com toggle (começa desligada)' },
            { id: 'decalque', name: 'Só no decalque', desc: 'O zumbido aparece só na seção do papel à pele.', spec: 'Áudio da máquina sincronizado com a seção StencilTransfer' },
          ].map((o) => ({ ...o, html: `<span class="so" data-so="${o.id}"><span class="so-ic">${o.id === 'mudo' ? '🔇' : o.id === 'trilha' ? '♫' : o.id === 'cliques' ? '◉' : '♪'}</span><span class="so-bars">${Array.from({ length: 9 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</span></span>` })),
        },
      ],
    },
    {
      id: 'estrutura',
      short: 'Estrutura',
      title: 'Estrutura e partes do site',
      intro: 'Como cada parte é montada, o que aparece em cada arte e quais seções ficam, saem ou entram.',
      cats: [
        {
          id: 'hero',
          title: 'Abertura do site',
          desc: 'A primeira tela que a pessoa vê.',
          stage: 'wide',
          options: [
            { id: 'atual', name: 'Nome gigante com tinta', current: true, desc: 'Seu nome enorme “sangrando” tinta, faixa, andorinhas e selo girando.', spec: 'Mantém Hero' },
            { id: 'foto', name: 'Sua foto em tela cheia', desc: 'Sua foto tatuando ocupa a tela, com o nome por cima.', spec: 'Hero com retrato full-bleed + overlay escuro + nome' },
            { id: 'arte', name: 'Uma arte em destaque', desc: 'Nome e texto de um lado, uma arte do flash do outro.', spec: 'Hero dividido: texto + card de arte destaque (rotativo)' },
            { id: 'colagem', name: 'Colagem de artes', desc: 'Várias artes espalhadas em volta do nome.', spec: 'Hero com nome central e cards do flash espalhados (parallax)' },
            { id: 'video', name: 'Vídeo do estúdio', desc: 'Um vídeo curto em loop no fundo (você manda o vídeo).', spec: 'Hero com vídeo em loop (pedir arquivo) + nome' },
            { id: 'minimal', name: 'Minimalista', desc: 'Nome pequeno e uma frase grande. Direto ao ponto.', spec: 'Hero tipográfico minimal: frase grande em --condensed' },
          ].map((o) => ({ ...o, html: heroHTML(o.id) })),
        },
        {
          id: 'menu',
          title: 'Menu',
          desc: 'A navegação entre as partes do site.',
          stage: 'wide',
          options: [
            { id: 'atual', name: 'Barra que some ao rolar', current: true, desc: 'Logo e links no topo; some quando desce e volta quando sobe.', spec: 'Mantém Nav' },
            { id: 'hamburguer', name: 'Botão ≡ com tela cheia', desc: 'Só um botão; ao tocar, abre um menu grande na tela toda.', spec: 'Nav hambúrguer com overlay fullscreen e links grandes' },
            { id: 'fixo', name: 'Fixo com botão Agendar', desc: 'Sempre visível, com um botão de agendar em destaque.', spec: 'Nav fixa sempre visível + CTA "Agendar" (WhatsApp)' },
            { id: 'app', name: 'Barra embaixo (estilo app)', desc: 'No celular, os botões ficam embaixo, perto do dedo.', spec: 'Tab bar inferior no mobile com ícones' },
            { id: 'lateral', name: 'Lateral', desc: 'Uma coluna fina na lateral com os links em pé.', spec: 'Nav vertical fixa à esquerda (desktop)' },
            { id: 'centro', name: 'Logo no meio', desc: 'Logo centralizado, links dos dois lados.', spec: 'Nav com logo central e links divididos' },
          ].map((o) => ({ ...o, html: `<span class="nvw">${navHTML(o.id)}<span class="nvw-page">${lines(4)}</span></span>` })),
        },
        {
          id: 'galeria',
          title: 'Vitrine de destaques',
          desc: 'Como as 12 melhores artes são mostradas.',
          stage: 'wide',
          options: [
            { id: 'horizontal', name: 'Passando de lado', current: true, desc: 'A tela trava e as artes passam na horizontal enquanto rola.', spec: 'Mantém FlashGallery (pin horizontal)' },
            { id: 'grade', name: 'Grade', desc: 'Todas lado a lado, em 3 ou 4 colunas.', spec: 'Grid 3–4 colunas com reveal' },
            { id: 'carrossel', name: 'Carrossel com setas', desc: 'Uma grande no meio; setas e arrastar pra trocar.', spec: 'Carrossel central com setas/drag e dots' },
            { id: 'pilha', name: 'Pilha de cartas', desc: 'As artes empilhadas; arrasta a de cima pra ver a próxima.', spec: 'Stack de cards com swipe (Draggable)' },
            { id: 'uma', name: 'Uma por vez', desc: 'Cada arte ocupa a tela inteira, uma depois da outra.', spec: 'Seções fullscreen por arte (snap), nome grande' },
            { id: 'mosaico', name: 'Mosaico', desc: 'Tamanhos diferentes encaixados, estilo Pinterest.', spec: 'Masonry com alturas naturais' },
          ].map((o) => ({ ...o, html: galeriaHTML(o.id) })),
        },
        {
          id: 'cartela',
          title: 'Cartela completa',
          desc: 'Como as 44 artes disponíveis são listadas.',
          stage: 'wide',
          options: [
            { id: 'grade', name: 'Grade com filtros', current: true, desc: 'Botões por estilo em cima e a grade de artes embaixo.', spec: 'Mantém FlashCatalog (grid + filtros com Flip)' },
            { id: 'parede', name: 'Parede de flash', desc: 'As artes coladas tortas numa parede, como no estúdio.', spec: 'Cards rotacionados aleatórios com fita, fundo de parede' },
            { id: 'folha', name: 'Folha de flash impressa', desc: 'Todas numa folha só, numeradas, como cartela de papel.', spec: 'Uma “folha” grande com todas as artes numeradas, sem cards' },
            { id: 'lista', name: 'Lista com nomes', desc: 'Uma linha por arte com miniatura, nome e estilo.', spec: 'Lista em linhas com thumb + nome + estilo + seta' },
            { id: 'faixas', name: 'Uma faixa por estilo', desc: 'Uma fileira que arrasta pro lado pra cada estilo.', spec: 'Rows horizontais por estilo (scroll-snap)' },
          ].map((o) => ({ ...o, html: cartelaHTML(o.id) })),
        },
        {
          id: 'clique-arte',
          title: 'Ao tocar numa arte',
          desc: 'O que acontece quando a pessoa escolhe uma arte.',
          stage: 'wide',
          options: [
            { id: 'tela', name: 'Abre em tela cheia', current: true, desc: 'A arte voa pra tela cheia, com setas e o botão “Quero essa” (WhatsApp).', spec: 'Mantém Lightbox' },
            { id: 'whats', name: 'Vai direto pro WhatsApp', desc: 'Já abre a conversa com o nome da arte.', spec: 'Clique abre wa.me com nome/nº da arte, sem lightbox' },
            { id: 'ficha', name: 'Ficha completa', desc: 'Abre uma ficha com tamanho, valor e onde fica bem no corpo.', spec: 'Lightbox com painel de detalhes (tamanho, preço, regiões)' },
            { id: 'favoritas', name: 'Lista de favoritas', desc: 'Marca com ♥ várias artes e manda todas juntas.', spec: 'Favoritar artes (localStorage) + enviar lista no WhatsApp' },
            { id: 'zoom', name: 'Lupa', desc: 'Dá zoom ali mesmo pra ver os detalhes do traço.', spec: 'Zoom/lupa inline na imagem' },
          ].map((o) => ({ ...o, html: cliqueArteHTML(o.id) })),
        },
        {
          id: 'info',
          title: 'O que aparece em cada arte',
          desc: 'Pode marcar várias.',
          type: 'multi',
          stage: 'card',
          options: [
            { id: 'nome', name: 'Nome', current: true, desc: '“Gueixa”, “Medusa”…', spec: 'Nome da arte' },
            { id: 'numero', name: 'Número', current: true, desc: '“Nº 01”, como em cartela.', spec: 'Número da arte' },
            { id: 'estilo', name: 'Estilo', current: true, desc: 'Neotradicional, Blackwork…', spec: 'Estilo da arte' },
            { id: 'tamanho', name: 'Tamanho sugerido', desc: '“mín. 15 cm”.', spec: 'Tamanho sugerido (pedir por arte)' },
            { id: 'preco', name: 'Valor', desc: '“a partir de R$ 400”.', spec: 'Preço (refPrice já existe em flash.ts, confirmar valores)' },
            { id: 'selo', name: 'Selo “disponível”', desc: 'Etiqueta de disponível / reservada.', spec: 'Selo de status: disponível/reservada' },
            { id: 'corpo', name: 'Onde fica bem', desc: '“braço, perna, costela”.', spec: 'Regiões do corpo sugeridas por arte' },
            { id: 'vendidas', name: 'Mostrar já tatuadas', desc: 'Exibe também as que já foram, com selo “tatuada”.', spec: 'Exibir sold:true com selo "já tatuada" (hoje são escondidas)' },
          ].map((o) => ({ ...o, html: `<span class="nf" data-nf="${o.id}">${infoCard()}</span>` })),
        },
        {
          id: 'botoes',
          title: 'Botões de chamada',
          desc: 'O botão principal de “Chamar no WhatsApp”.',
          stage: 'shape',
          options: [
            { id: 'selo', name: 'Selo girando', current: true, desc: 'Selo redondo com texto girando; puxa o mouse como ímã.', spec: 'Mantém CTA RotatingBadge magnético' },
            { id: 'solido', name: 'Botão sólido', desc: 'Retângulo cheio na cor de destaque.', spec: 'CTA retangular sólido --red, --condensed' },
            { id: 'faixa', name: 'Faixa old school', desc: 'O botão é uma faixa de tatuagem.', spec: 'CTA em formato ribbon' },
            { id: 'pilula', name: 'Pílula contornada', desc: 'Contorno fino que enche de tinta ao passar o mouse.', spec: 'CTA pílula outline com fill no hover' },
            { id: 'carimbo', name: 'Carimbo', desc: 'Parece carimbado, borda dupla e meio torto.', spec: 'CTA estilo carimbo (borda dupla, rotate -4deg, textura)' },
            { id: 'flutuante', name: 'Botão flutuante', desc: 'Bolinha do WhatsApp fixa no canto o tempo todo.', spec: 'Botão flutuante fixo do WhatsApp (além do CTA)' },
          ].map((o) => ({ ...o, html: `<span class="btw" data-bt="${o.id}">${o.id === 'flutuante' ? `<span class="btw-page">${lines(5)}</span>` : ''}${buttonHTML(o.id)}</span>` })),
        },
        { id: 'secoes', title: 'Seções do site', desc: 'Reordene com as setas, desligue o que não quer e marque o que quer adicionar.', type: 'sections' },
      ],
    },
    {
      id: 'textos',
      short: 'Textos',
      title: 'Textos',
      intro: 'O jeito de falar e o que está escrito. Os campos já vêm com o texto de hoje: é só editar o que quiser mudar.',
      cats: [
        {
          id: 'tom',
          title: 'Tom de voz',
          desc: 'O jeito que o site conversa com a pessoa.',
          stage: 'wide',
          options: [
            { id: 'proximo', name: 'Próximo e descontraído', current: true, t: 'Bora marcar a sua próxima?', c: 'Chamar no WhatsApp', desc: 'Como um amigo chamando.', spec: 'Mantém tom atual' },
            { id: 'profissional', name: 'Profissional', t: 'Agende sua sessão', c: 'Solicitar orçamento', desc: 'Sério, claro e direto.', spec: 'Reescrever textos em tom profissional' },
            { id: 'poetico', name: 'Poético', t: 'Toda pele guarda uma história', c: 'Contar a minha', desc: 'Artístico, fala de arte e memória.', spec: 'Reescrever textos em tom poético/artístico' },
            { id: 'rebelde', name: 'Ousado', t: 'Sem cópia. Sem medo. Só tinta.', c: 'Quero a minha', desc: 'Atitude, frases curtas e fortes.', spec: 'Reescrever textos em tom ousado/rebelde' },
            { id: 'minimal', name: 'Minimalista', t: 'Agenda aberta.', c: 'Agendar', desc: 'O mínimo de palavras.', spec: 'Enxugar textos ao mínimo' },
            { id: 'humor', name: 'Bem-humorado', t: 'Sua mãe vai amar. (Talvez.)', c: 'Bora arriscar', desc: 'Leve, com piadinha.', spec: 'Reescrever textos com humor leve' },
          ].map((o) => ({ ...o, html: `<span class="tm"><span class="f-letter tm-eye">${S} agenda aberta ${S}</span><b class="f-cond">${o.t}</b><span class="tm-cta f-body">${o.c} ↗</span></span>` })),
        },
        { id: 'textos', title: 'O que está escrito', desc: 'Edite só o que quiser mudar. O que ficar igual não muda.', type: 'texts' },
      ],
    },
  ]

  /* ---------- geradores de miniaturas animadas ---------- */

  function stripes(list) {
    const names = ['abertura', 'flash', 'cartela', 'decalque', 'sobre', 'rodapé']
    return `<span class="cx">${list.map((c, i) => `<i class="${c === 'i' ? 'is-ink' : ''}"><b class="f-body">${names[i]}</b></i>`).join('')}</span>`
  }

  function artOrnamental() {
    return `<span class="ar"><svg viewBox="0 0 160 100" class="m-orn" aria-hidden="true">
      <path class="ln" d="M52 94V44a28 28 0 0 1 56 0v50"/><path class="ln th" d="M58 94V45a22 22 0 0 1 44 0v49"/>
      <path class="ln" d="M80 16v-4"/><circle class="ac" cx="80" cy="9" r="4.5"/><path class="ln th" d="M70 12c4 4 16 4 20 0"/>
      <path class="ln" d="M52 62c-14 0-22-8-22-18 0-7 5-12 11-12 5 0 8 4 8 8 0 3-2 5-5 5"/><path class="ln" d="M108 62c14 0 22-8 22-18 0-7-5-12-11-12-5 0-8 4-8 8 0 3 2 5 5 5"/>
      <path class="ln th" d="M30 94c8-10 22-14 22-14M130 94c-8-10-22-14-22-14M22 94h116"/>
      <circle class="ln" cx="80" cy="60" r="11"/><path class="ln th" d="M74 58c3-5 9-5 12 0M72 64c5 4 11 4 16 0M80 49v-6"/><circle class="ac" cx="80" cy="60" r="3"/>
      <circle class="fl" cx="41" cy="44" r="1.8"/><circle class="fl" cx="119" cy="44" r="1.8"/></svg></span>`
  }

  function artBlackwork() {
    let tri = ''
    for (let i = 0; i < 12; i++) tri += `<path class="fl" d="M0-27l4 9h-8z" transform="rotate(${i * 30})"/>`
    let rays = ''
    for (let i = 0; i < 24; i++) rays += `<path class="ln th" d="M0-36v-8" transform="rotate(${i * 15})"/>`
    return `<span class="ar"><svg viewBox="0 0 160 100" class="m-orn" aria-hidden="true"><g transform="translate(80 50)">
      <circle class="ln" r="46"/><circle class="ln dots" r="40"/>${rays}<circle class="ln" r="32"/>${tri}<circle class="ln th" r="16"/><circle class="fl" r="8"/><circle class="pf" r="3"/></g>
      <g class="dotfield">${Array.from({ length: 36 }, (_, i) => `<circle class="fl" cx="${8 + (i % 6) * 5}" cy="${18 + Math.floor(i / 6) * 12 + (i % 2) * 3}" r="${0.6 + ((i * 7) % 5) * 0.25}"/>`).join('')}${Array.from({ length: 36 }, (_, i) => `<circle class="fl" cx="${127 + (i % 6) * 5}" cy="${18 + Math.floor(i / 6) * 12 + (i % 2) * 3}" r="${0.6 + ((i * 3) % 5) * 0.25}"/>`).join('')}</g></svg></span>`
  }

  function artFineline() {
    return `<span class="ar"><svg viewBox="0 0 160 100" class="m-orn hair" aria-hidden="true">
      <path class="ln" d="M28 86C56 76 92 54 132 18"/>
      ${[[44, 79, -20], [58, 72, 30], [72, 64, -30], [86, 55, 25], [100, 45, -35], [113, 35, 20], [124, 26, -30]].map(([x, y, r]) => `<ellipse class="ln" cx="${x}" cy="${y}" rx="7" ry="2.6" transform="rotate(${r} ${x} ${y})"/>`).join('')}
      <circle class="ln" cx="126" cy="72" r="7"/><path class="ln" d="M126 61v-4M126 87v-4M115 72h-4M141 72h-4"/>
      <path class="ln" d="M24 30c4-3 8-3 10 0 2-3 6-3 10 0"/><circle class="ac" cx="30" cy="50" r="1.4"/></svg></span>`
  }

  function artJapones() {
    let waves = ''
    for (let row = 0; row < 3; row++)
      for (let i = -1; i < 9; i++) {
        const x = i * 20 + (row % 2) * 10
        const y = 72 + row * 10
        waves += `<g transform="translate(${x} ${y})"><path class="pf ln" d="M0 10a10 10 0 0 1 20 0z"/><path class="ln th" d="M4 10a6 6 0 0 1 12 0M7.5 10a2.5 2.5 0 0 1 5 0"/></g>`
      }
    return `<span class="ar"><svg viewBox="0 0 160 100" class="m-orn" aria-hidden="true"><circle class="ac" cx="114" cy="34" r="18"/>
      <path class="ln pf" d="M18 44c0-7 8-10 13-5 2-8 14-9 17-1 7-3 12 4 8 9H22c-3 0-4-1-4-3z"/><path class="ln th" d="M30 44c0-3 3-5 5-3"/>
      <path class="ln pf" d="M92 56c0-6 7-8 11-4 2-6 12-7 14-1 6-2 10 3 7 7H95c-2 0-3-1-3-2z"/>${waves}</svg></span>`
  }

  function artGotico() {
    return `<span class="ar"><svg viewBox="0 0 160 100" class="m-orn" aria-hidden="true">
      <path class="ln" d="M58 96V48Q58 26 80 12q22 14 22 36v48"/><path class="ln th" d="M64 96V49Q64 32 80 20q16 12 16 29v47"/>
      <path class="ln th" d="M80 96V52M64 70h32"/><circle class="ln th" cx="80" cy="44" r="7"/><path class="ac" d="M80 38l1.6 4.4L86 44l-4.4 1.6L80 50l-1.6-4.4L74 44l4.4-1.6z"/>
      <path class="ln" d="M80 2v8M76 5.5h8"/>
      <rect class="ln pf" x="30" y="66" width="8" height="30"/><path class="ac" d="M34 54c-3 5-4 8-4 10a4 4 0 0 0 8 0c0-2-1-5-4-10z"/><path class="ln th" d="M34 66v-2"/>
      <rect class="ln pf" x="122" y="72" width="8" height="24"/><path class="ac" d="M126 60c-3 5-4 8-4 10a4 4 0 0 0 8 0c0-2-1-5-4-10z"/>
      <path class="ln th" d="M20 96h120"/></svg></span>`
  }

  function preloaderHTML(v) {
    const site = `<span class="pl-site"><span class="f-display">Marchello</span><i class="m-line"></i></span>`
    switch (v) {
      case 'agulha':
        return `<span class="pl pl-agulha">${site}<span class="pl-cover"><svg viewBox="0 0 80 100" class="pl-m" aria-hidden="true"><path pathLength="1" d="M18 82V22l22 38 22-38v60"/></svg></span></span>`
      case 'linha':
        return `<span class="pl pl-linha">${site}<span class="pl-cover"><span class="pl-name f-display">Marchello</span><i class="pl-bar"></i><span class="pl-pct f-body">carregando</span></span></span>`
      case 'rasgo':
        return `<span class="pl pl-rasgo">${site}<span class="pl-half t"><span class="f-letter">Marchello Ink</span></span><span class="pl-half b"></span></span>`
      case 'carimbo':
        return `<span class="pl pl-carimbo">${site}<span class="pl-cover"><span class="pl-stamp">${logoHTML('selo')}</span><i class="pl-spk s1"></i><i class="pl-spk s2"></i><i class="pl-spk s3"></i></span></span>`
      case 'sem':
        return `<span class="pl pl-sem">${site}<span class="pl-tag f-body">abre direto</span></span>`
      default:
        return `<span class="pl pl-gota">${site}<span class="pl-cover"><span class="pl-meta f-body">Marchello Ink<br>preparando a tinta</span><span class="pl-count f-display"></span><i class="pl-needle"></i><i class="pl-drop"></i><i class="pl-flood"></i></span></span>`
    }
  }

  function entradaHTML(v) {
    if (v === 'traco')
      return `<span class="en en-traco"><svg viewBox="0 0 200 60" aria-hidden="true"><text x="100" y="44" text-anchor="middle" class="f-display">Marchello</text></svg></span>`
    if (v === 'maquina') return `<span class="en en-maquina"><span class="en-w f-display">${chars('Marchello')}<i class="en-caret"></i></span></span>`
    return `<span class="en en-${v}"><span class="en-w f-display">${chars('Marchello')}</span></span>`
  }

  function rolagemHTML(v) {
    const page = `<span class="rl-page"><span class="rl-scroll">${lines(6)}<span class="rl-block"></span>${lines(5)}<span class="rl-block"></span>${lines(6)}</span></span>`
    switch (v) {
      case 'agulha':
        return `<span class="rl rl-agulha">${page}<i class="rl-needle"></i></span>`
      case 'gotas':
        return `<span class="rl rl-gotas">${page}<span class="rl-drips"><i style="left:12%;--d:0s"></i><i style="left:30%;--d:.4s"></i><i style="left:55%;--d:.2s"></i><i style="left:74%;--d:.6s"></i><i style="left:90%;--d:.3s"></i></span></span>`
      case 'barra':
        return `<span class="rl rl-barra">${page}<i class="rl-bar"></i></span>`
      case 'parallax':
        return `<span class="rl rl-parallax">${page}<span class="rl-layer a">${thumb('gueixa')}</span><span class="rl-layer b">${thumb('medusa')}</span></span>`
      case 'nenhum':
        return `<span class="rl rl-nenhum">${page}</span>`
      default:
        return `<span class="rl rl-pincel">${page}<svg class="rl-brush" viewBox="0 0 160 100" aria-hidden="true"><path pathLength="1" d="M14 -4C10 18 18 30 16 46c-1 8 30 6 70 8s58 4 58 14c0 10-2 22 2 36"/></svg><span class="rl-stop s1">${S}</span><span class="rl-stop s2">${S}</span></span>`
    }
  }

  function cursorHTML(v) {
    const inner = {
      anel: `<i class="cr-dot"></i><i class="cr-ring"><b class="f-body">bora!</b></i>`,
      gota: `<i class="cr-gota"></i>`,
      maquina: `<svg class="cr-maq" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 26l5-5M10 22l9-9 3 3-9 9zM18 12l3-6 5 5-6 3M23 5l4 4"/></svg>`,
      estrela: `<i class="cr-sym">${S}</i>`,
      normal: cursorArrow,
    }[v]
    const movers =
      v === 'rastro'
        ? [5, 4, 3, 2, 1, 0].map((t) => `<span class="cr-mover" style="--t:${t}"><i class="cr-tr" style="opacity:${1 - t * 0.15};scale:${1 - t * 0.12}"></i></span>`).join('')
        : `<span class="cr-mover">${inner}</span>`
    return `<span class="cr" data-cr="${v}"><span class="cr-page">${lines(3)}<span class="cr-btn f-cond">Quero essa</span></span>${movers}</span>`
  }

  function cliqueHTML(v) {
    const fx = {
      respingo: `<i class="ck-blob"></i>${[0, 1, 2, 3, 4, 5].map((i) => `<i class="ck-dot" style="--a:${i * 60 + 15}deg;--d:${18 + (i % 3) * 8}cqw"></i>`).join('')}`,
      onda: `<i class="ck-ring"></i><i class="ck-ring r2"></i>`,
      simbolos: [0, 1, 2, 3, 4, 5, 6].map((i) => `<i class="ck-sym" style="--a:${i * 51}deg">${S}</i>`).join(''),
      gota: `<i class="ck-drip"></i>`,
      nada: '',
    }[v]
    return `<span class="ck" data-ck="${v}"><span class="ck-at">${fx}</span><span class="fake-cursor ck-cursor">${cursorArrow}</span></span>`
  }

  function galeriaHTML(v) {
    const g = GALLERY
    switch (v) {
      case 'grade':
        return `<span class="gl gl-grade">${g.slice(0, 8).map((s) => thumb(s)).join('')}</span>`
      case 'carrossel':
        return `<span class="gl gl-carrossel"><span class="gl-arr">‹</span><span class="gl-cr-track">${thumb(g[3], 'side')}${thumb(g[0], 'main')}${thumb(g[1], 'side')}</span><span class="gl-arr">›</span><span class="gl-dots"><i class="on"></i><i></i><i></i><i></i></span></span>`
      case 'pilha':
        return `<span class="gl gl-pilha">${thumb(g[2], 'p3')}${thumb(g[1], 'p2')}${thumb(g[0], 'p1')}<span class="gl-hint f-body">← arraste →</span></span>`
      case 'uma':
        return `<span class="gl gl-uma">${thumb(g[1], 'big')}<span class="gl-uma-copy"><span class="f-letter">Nº 02</span><b class="f-display">Medusa</b><span class="f-body">Neotradicional</span></span></span>`
      case 'mosaico':
        return `<span class="gl gl-mosaico">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => thumb(g[i], `h${i % 3}`)).join('')}</span>`
      default:
        return `<span class="gl gl-horizontal"><span class="gl-intro"><span class="f-letter">${S} destaques ${S}</span><b class="f-display">Flash</b></span><span class="gl-track">${g.map((s, i) => `<span class="gl-card" style="--r:${i % 2 ? 2.5 : -2}deg">${thumb(s)}</span>`).join('')}</span><i class="gl-prog"></i></span>`
    }
  }

  function cartelaHTML(v) {
    const g = [...GALLERY, 'sol-nuvens', 'mao-rosas', 'kitsune', 'oni']
    switch (v) {
      case 'parede':
        return `<span class="ct ct-parede">${g.slice(0, 9).map((s, i) => `<span class="ct-pin" style="--r:${[-6, 4, -2, 7, -5, 3, -8, 5, -3][i]}deg">${thumb(s)}<i></i></span>`).join('')}</span>`
      case 'folha':
        return `<span class="ct ct-folha"><span class="ct-sheet">${g.slice(0, 12).map((s, i) => `<span class="ct-item">${thumb(s)}<b class="f-letter">${i + 1}</b></span>`).join('')}</span></span>`
      case 'lista':
        return `<span class="ct ct-lista">${[['gueixa', 'Gueixa', 'Neotradicional'], ['medusa', 'Medusa', 'Neotradicional'], ['rosa-aranha', 'Rosa aranha', 'Blackwork'], ['lirio', 'Lírio', 'Fine line']].map(([s, n, st]) => `<span class="ct-row">${thumb(s)}<b class="f-display">${n}</b><span class="f-body">${st}</span><i>→</i></span>`).join('')}</span>`
      case 'faixas':
        return `<span class="ct ct-faixas">${['Neotradicional', 'Blackwork', 'Fine line'].map((st, r) => `<span class="ct-lane"><b class="f-letter">${st}</b><span class="ct-lane-row">${g.slice(r * 4, r * 4 + 6).map((s) => thumb(s)).join('')}</span></span>`).join('')}</span>`
      default:
        return `<span class="ct ct-grade"><span class="ct-chips f-body"><i class="on">Todas</i><i>Neotradicional</i><i>Blackwork</i><i>Fine line</i></span><span class="ct-grid">${g.slice(0, 8).map((s) => thumb(s)).join('')}</span></span>`
    }
  }

  function cliqueArteHTML(v) {
    switch (v) {
      case 'whats':
        return `<span class="ca ca-whats"><span class="ca-chat"><span class="ca-bubble f-body">Oi! Quero a arte <b>Nº 01 · Gueixa</b> 🖤</span><span class="ca-bubble me f-body">Bora! Que tamanho?</span></span><span class="ca-wa">${buttonHTML('flutuante')}</span></span>`
      case 'ficha':
        return `<span class="ca ca-ficha">${thumb('gueixa', 'pic')}<span class="ca-sheet f-body"><b class="f-display">Gueixa</b><span>Neotradicional</span><span>Tamanho: mín. 15 cm</span><span>Valor: a partir de R$ 450</span><span>Fica bem: braço, coxa</span><span class="m-btn-solid f-cond">Quero essa</span></span></span>`
      case 'favoritas':
        return `<span class="ca ca-fav">${['gueixa', 'medusa', 'pirata', 'kitsune'].map((s, i) => `<span class="ca-fav-c">${thumb(s)}<i class="${i % 2 ? '' : 'on'}">♥</i></span>`).join('')}<span class="ca-fav-bar f-body">2 favoritas · <b>enviar no WhatsApp</b></span></span>`
      case 'zoom':
        return `<span class="ca ca-zoom">${thumb('medusa', 'pic')}<span class="ca-lens"><img src="${IMG('medusa')}" alt="" loading="lazy"></span></span>`
      default:
        return `<span class="ca ca-tela"><span class="ca-over"><span class="ca-arr">‹</span>${thumb('gueixa', 'pic')}<span class="ca-arr">›</span><span class="ca-cap f-body"><b class="f-display">Gueixa</b><span class="m-btn-solid f-cond">Quero essa ↗</span></span></span></span>`
    }
  }

  function infoCard() {
    return `<span class="nf-card"><span class="nf-head f-letter"><span class="nf-numero">Nº 07</span><span class="nf-estilo">Neotradicional</span></span>
      <span class="nf-img"><img src="${IMG('deusa-da-lua')}" alt="" loading="lazy"><span class="nf-selo f-letter">disponível</span><span class="nf-vendidas f-letter">já tatuada</span></span>
      <b class="nf-nome f-display">Deusa da lua</b><span class="nf-extra f-body"><span class="nf-tamanho">mín. 15 cm</span><span class="nf-preco">R$ 450</span><span class="nf-corpo">braço · coxa</span></span></span>`
  }

  /* ------------------------------------------------------------------ */
  /* Estado                                                              */
  /* ------------------------------------------------------------------ */

  const ALL_CATS = STEPS.flatMap((s) => s.cats.map((c) => ({ ...c, step: s })))
  const CAT = Object.fromEntries(ALL_CATS.map((c) => [c.id, c]))
  const OPT = (catId, optId) => CAT[catId]?.options?.find((o) => o.id === optId)

  const defaults = () => {
    const sel = {}
    for (const c of ALL_CATS) {
      if (!c.options) continue
      sel[c.id] = c.type === 'multi' ? c.options.filter((o) => o.current).map((o) => o.id) : c.options.find((o) => o.current).id
    }
    return {
      sel,
      touched: {},
      notes: {},
      colors: { ...PALETTES.find((p) => p.custom).c },
      texts: { ...DEFAULT_TEXTS },
      sections: { order: SECTIONS.map((s) => s.id), off: [], add: [] },
      client: '',
      refs: '',
      general: '',
    }
  }
  let state = defaults()

  const save = () => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(compact()))
    } catch {}
  }

  // Só o que difere do padrão, pra o código ficar curto.
  function compact() {
    const d = defaults()
    const out = { v: 1 }
    const sel = {}
    for (const k in state.sel) if (JSON.stringify(state.sel[k]) !== JSON.stringify(d.sel[k])) sel[k] = state.sel[k]
    if (Object.keys(sel).length) out.s = sel
    const touched = Object.keys(state.touched).filter((k) => state.touched[k])
    if (touched.length) out.k = touched
    const notes = Object.fromEntries(Object.entries(state.notes).filter(([, v]) => v && v.trim()))
    if (Object.keys(notes).length) out.n = notes
    if (state.sel.paleta === 'custom') out.c = state.colors
    const texts = Object.fromEntries(Object.entries(state.texts).filter(([k, v]) => v !== DEFAULT_TEXTS[k]))
    if (Object.keys(texts).length) out.t = texts
    const sec = state.sections
    if (JSON.stringify(sec) !== JSON.stringify(d.sections)) out.x = sec
    if (state.client) out.cl = state.client
    if (state.refs) out.rf = state.refs
    if (state.general) out.g = state.general
    return out
  }

  function expand(o) {
    const s = defaults()
    if (!o || typeof o !== 'object') return s
    for (const k in o.s || {}) if (CAT[k]) s.sel[k] = o.s[k]
    for (const k of o.k || []) s.touched[k] = true
    Object.assign(s.notes, o.n || {})
    if (o.c) Object.assign(s.colors, o.c)
    Object.assign(s.texts, o.t || {})
    if (o.x) {
      const order = (o.x.order || []).filter((id) => SECTIONS.some((x) => x.id === id))
      for (const x of SECTIONS) if (!order.includes(x.id)) order.push(x.id)
      s.sections = { order, off: o.x.off || [], add: o.x.add || [] }
    }
    s.client = o.cl || ''
    s.refs = o.rf || ''
    s.general = o.g || ''
    return s
  }

  /* ---------- codificação (deflate + base64url) ---------- */

  const b64 = (bytes) => {
    let bin = ''
    bytes.forEach((b) => (bin += String.fromCharCode(b)))
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  const unb64 = (str) => {
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'))
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
  }
  const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer())

  async function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj))
    if (typeof CompressionStream === 'function') {
      try {
        return `MI1.${b64(await pipe(bytes, new CompressionStream('deflate-raw')))}`
      } catch {}
    }
    return `MI0.${b64(bytes)}`
  }

  async function decode(text) {
    const m = String(text).match(/MI([01])[.:]([A-Za-z0-9_-]+)/)
    if (!m) throw new Error('Código não encontrado')
    let bytes = unb64(m[2])
    if (m[1] === '1') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
    return JSON.parse(new TextDecoder().decode(bytes))
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  const root = document.documentElement
  const varsStyle = (vars) => (vars ? esc(Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')) : '')

  function renderSteps() {
    const main = $('#steps')
    let n = 0
    main.innerHTML =
      STEPS.map((step, si) => {
        const cats = step.cats
          .map((c) => {
            n++
            return renderCat(c, n)
          })
          .join('')
        const next = STEPS[si + 1]
        return `<section class="step" id="etapa-${step.id}" data-step="${step.id}">
          <header class="step-head"><span class="step-n">${String(si + 1).padStart(2, '0')}</span><div><h2>${step.title}</h2><p>${step.intro}</p></div></header>
          ${step.presets ? presetsHTML() : ''}
          ${cats}
          <a class="step-next" href="#etapa-${next ? next.id : 'finalizar'}">Próximo: ${next ? next.title : 'gerar o código'} →</a>
        </section>`
      }).join('') + finalHTML()

    $('#bar-steps').innerHTML =
      STEPS.map((s, i) => `<a href="#etapa-${s.id}" data-step-link="${s.id}"><b>${i + 1}</b>${s.short}</a>`).join('') +
      `<a href="#etapa-finalizar" data-step-link="finalizar"><b>✓</b>Código</a>`
  }

  function renderCat(c, n) {
    const num = String(n).padStart(2, '0')
    const head = `<header class="cat-head"><span class="cat-num">${num}</span><div class="cat-titles"><h3>${c.title}</h3><p>${c.desc}</p></div><span class="cat-status" data-status="${c.id}"></span></header>`
    const note = `<details class="note" ${state.notes[c.id] ? 'open' : ''}><summary>Comentar este item</summary><textarea data-note="${c.id}" rows="2" placeholder="Ex.: gostei dessa, mas com o vermelho mais vivo">${esc(state.notes[c.id] || '')}</textarea></details>`
    if (c.type === 'sections') return `<article class="cat" id="cat-${c.id}" data-cat="${c.id}">${head}<div class="sec" id="sec-box"></div>${note}</article>`
    if (c.type === 'texts') return `<article class="cat" id="cat-${c.id}" data-cat="${c.id}">${head}<div class="tf" id="tf-box">${textsHTML()}</div>${note}</article>`
    const multi = c.type === 'multi'
    const opts = c.options
      .map((o) => {
        const custom = o.custom
          ? `<span class="pal-pick">${Object.keys(COLOR_LABEL)
              .map((k) => `<span class="pal-pick-i"><input type="color" data-color="${k}" value="${state.colors[k]}" aria-label="Cor: ${COLOR_LABEL[k]}"><small>${COLOR_LABEL[k]}</small></span>`)
              .join('')}</span>`
          : ''
        const stageVars = o.custom ? '' : varsStyle(c.id === 'paleta' || c.id.startsWith('f-') || c.id === 'simbolo' || c.id === 'cantos' ? o.vars : null)
        return `<label class="opt" data-opt="${o.id}">
          <input type="${multi ? 'checkbox' : 'radio'}" name="c-${c.id}" value="${o.id}" data-cat="${c.id}">
          <span class="stage stage-${c.stage || 'wide'} ${o.custom ? 'is-custom' : ''}" style="${stageVars}"><span class="stage-in">${o.html || ''}</span></span>
          <span class="opt-body"><span class="opt-name">${o.name}${o.current ? ' <span class="opt-tag">atual</span>' : ''}</span><span class="opt-desc">${o.desc}</span>${custom}</span>
          <span class="opt-check" aria-hidden="true">✓</span>
        </label>`
      })
      .join('')
    return `<article class="cat" id="cat-${c.id}" data-cat="${c.id}">${head}
      <div class="opts" role="${multi ? 'group' : 'radiogroup'}" aria-label="${esc(c.title)}">${opts}</div>
      <p class="opts-hint">${c.options.length} opções · arraste pro lado →</p>${note}</article>`
  }

  function presetsHTML() {
    return `<div class="presets"><span>Combinações prontas:</span>${TYPE_PRESETS.map(
      (p, i) => `<button type="button" class="preset" data-preset="${i}"><b style="font-family:${FONTS.display.find((f) => f.id === p.f['f-display']).css}">Aa</b>${p.name}</button>`,
    ).join('')}</div>`
  }

  function textsHTML() {
    return TEXT_FIELDS.map((f) => {
      const val = state.texts[f.id] ?? ''
      const changed = val !== DEFAULT_TEXTS[f.id]
      const tag = f.rows > 1 ? 'textarea' : 'input'
      const input =
        tag === 'textarea'
          ? `<textarea id="tf-${f.id}" data-text="${f.id}" rows="${f.rows}" placeholder="${esc(f.placeholder || '')}">${esc(val)}</textarea>`
          : `<input id="tf-${f.id}" data-text="${f.id}" value="${esc(val)}" placeholder="${esc(f.placeholder || '')}">`
      return `<div class="tf-i ${changed ? 'is-changed' : ''} ${f.rows > 1 ? 'is-wide' : ''}" data-tf="${f.id}"><div class="tf-l"><label for="tf-${f.id}">${f.label}</label><button type="button" class="tf-reset" data-reset="${f.id}">voltar ao original</button></div>${input}${f.hint ? `<small>${f.hint}</small>` : ''}</div>`
    }).join('')
  }

  function renderSections() {
    const box = $('#sec-box')
    if (!box) return
    const { order, off, add } = state.sections
    box.innerHTML = `<ol class="sec-list">
        <li class="sec-row is-fixed"><span class="sec-pos">·</span><span class="sec-txt"><b>Abertura</b><small>Sempre a primeira.</small></span></li>
        ${order
          .map((id, i) => {
            const s = SECTIONS.find((x) => x.id === id)
            const isOff = off.includes(id)
            return `<li class="sec-row ${isOff ? 'is-off' : ''}" data-sec="${id}">
              <span class="sec-pos">${i + 1}</span>
              <span class="sec-txt"><b>${s.name}</b><small>${s.desc}</small></span>
              <span class="sec-move"><button type="button" data-move="-1" aria-label="Subir ${s.name}" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="1" aria-label="Descer ${s.name}" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></span>
              <label class="sec-sw"><input type="checkbox" ${isOff ? '' : 'checked'} data-keep="${id}"><span>${isOff ? 'Tirar' : 'Manter'}</span></label>
            </li>`
          })
          .join('')}
      </ol>
      <h4 class="sec-add-t">Quer adicionar alguma seção nova?</h4>
      <div class="sec-add">${NEW_SECTIONS.map(
        (s) => `<label class="sec-new ${add.includes(s.id) ? 'is-on' : ''}"><input type="checkbox" data-add="${s.id}" ${add.includes(s.id) ? 'checked' : ''}>${ic(s.icon)}<span><b>${s.name}</b><small>${s.desc}</small></span><i class="opt-check">✓</i></label>`,
      ).join('')}</div>`
  }

  function finalHTML() {
    return `<section class="step step-final" id="etapa-finalizar" data-step="finalizar">
      <header class="step-head"><span class="step-n">✓</span><div><h2>Gerar o código</h2><p>Confira o resumo, escreva o que mais quiser e mande o código. Ele leva todas as suas escolhas.</p></div></header>
      <div class="final-form">
        <label>Seu nome<input id="f-client" placeholder="Ex.: Marchello" value="${esc(state.client)}"></label>
        <label>Tem alguma referência que você curte? (perfil, site, artista)<textarea id="f-refs" rows="2" placeholder="Ex.: @fulano.tattoo, o site do estúdio X">${esc(state.refs)}</textarea></label>
        <label>Mais alguma coisa? Ideias, dúvidas, o que não gostou<textarea id="f-general" rows="4" placeholder="Fica à vontade">${esc(state.general)}</textarea></label>
      </div>
      <div class="summary" id="summary"></div>
      <div class="code">
        <div class="code-head"><strong>Seu código</strong><small id="code-size"></small></div>
        <textarea id="code" readonly rows="10" aria-label="Código com as escolhas"></textarea>
        <div class="code-actions">
          <a class="btn btn-wa" id="send-wa" href="#" target="_blank" rel="noreferrer">Mandar no WhatsApp</a>
          <button class="btn" type="button" id="copy">Copiar código</button>
          <button class="btn btn-ghost" type="button" id="download">Baixar arquivo</button>
        </div>
        <p class="code-tip">Se a mensagem do WhatsApp sair cortada, use “Copiar código” e cole na conversa.</p>
      </div>
      <details class="load"><summary>Já tenho um código e quero abrir</summary><textarea id="load-code" rows="3" placeholder="Cole aqui o código (ou a mensagem inteira)"></textarea><button class="btn" type="button" id="load-btn">Abrir escolhas</button></details>
      <button type="button" class="reset" id="reset">Apagar tudo e recomeçar</button>
    </section>`
  }

  /* ---------- prévia ao vivo ---------- */

  function palette() {
    return state.sel.paleta === 'custom' ? state.colors : PALETTES.find((p) => p.id === state.sel.paleta)?.c || PALETTES[0].c
  }

  function applyVars() {
    const p = palette()
    const st = root.style
    st.setProperty('--pv-paper', p.paper)
    st.setProperty('--pv-ink', p.ink)
    st.setProperty('--pv-accent', p.accent)
    st.setProperty('--pv-gold', p.gold)
    for (const key of ['display', 'letter', 'cond', 'body']) {
      const f = FONTS[key].find((x) => x.id === state.sel[`f-${key}`]) || FONTS[key][0]
      st.setProperty(`--pv-f-${key}`, `${f.css}, ${FONT_FALLBACK[key]}`)
      st.setProperty(`--pv-w-${key}`, f.w || 400)
      st.setProperty(`--pv-st-${key}`, f.it ? 'italic' : 'normal')
    }
    st.setProperty('--pv-sym', symMask(state.sel.simbolo))
    st.setProperty('--pv-sym-w', state.sel.simbolo === 'nenhum' ? '0' : '.72em')
    st.setProperty('--pv-radius', OPT('cantos', state.sel.cantos)?.r || '3px')
    // a bolinha da paleta personalizada mostra as cores escolhidas
    const custom = $('.opt[data-opt="custom"] .stage')
    if (custom) for (const k in state.colors) custom.style.setProperty(`--pv-${k}`, state.colors[k])
  }

  function renderSite() {
    const site = $('#site')
    const s = state.sel
    const off = state.sections.off
    const mode = s.contraste
    const dark = (sec) => {
      if (mode === 'escuro') return true
      if (mode === 'claro') return sec === 'footer'
      return ['flash', 'sobre', 'footer'].includes(sec)
    }
    const cls = (sec) => (dark(sec) ? 'is-dark' : '')
    const tone = OPT('tom', s.tom)
    const contactTitle = state.texts.contatoTitulo !== DEFAULT_TEXTS.contatoTitulo ? state.texts.contatoTitulo : tone.t
    const ctaLabel = state.texts.contatoTitulo !== DEFAULT_TEXTS.contatoTitulo ? 'Chamar no WhatsApp' : tone.c
    const div = dividerHTML(s.divisores)
    const dv = (from, to) => (div ? `<div class="s-div ${cls(from)}-from ${cls(to)}-to" data-from="${dark(from) ? 'd' : 'l'}" data-to="${dark(to) ? 'd' : 'l'}">${div}</div>` : '')
    const flashCards = ['gueixa', 'medusa', 'pirata']
      .map((slug, i) => card(slug, ['Gueixa', 'Medusa', 'Pirata'][i], `0${i + 1}`, 'Neotradicional'))
      .join('')

    const blocks = {
      manifesto: () => `<section class="s s-manifesto ${cls('manifesto')}"><p class="m-eyebrow f-letter">${S} manifesto ${S}</p><p class="s-mani f-body">${esc(state.texts.manifesto).replace(/(decalque|autorais|pele)/g, '<em class="f-display">$1</em>')}</p><p class="s-sign f-display">${esc(state.texts.nome)}</p></section>`,
      flash: () => `<section class="s s-flash ${cls('flash')}"><p class="m-eyebrow f-letter">${S} flash day / destaques ${S}</p><h4 class="f-display">Flash <span class="outline">sheet</span></h4><p class="s-lead f-body">${esc(state.texts.flashLead)}</p>
        <div class="s-gal" data-gal="${s.galeria}">${s.galeria === 'horizontal' || s.galeria === 'carrossel' || s.galeria === 'pilha' || s.galeria === 'uma' ? `<div class="s-gal-row">${flashCards}</div>` : `<div class="s-gal-grid">${flashCards}${card('rei-caveira', 'Rei caveira', '04')}</div>`}</div></section>`,
      cartela: () => `<section class="s s-cartela ${cls('cartela')}"><p class="m-eyebrow f-letter">${S} cartela completa ${S}</p><h4 class="f-display">Tudo que tá livre</h4><div class="s-cat">${cartelaHTML(s.cartela)}</div></section>`,
      decalque: () => `<section class="s s-decalque ${cls('decalque')}"><p class="m-eyebrow f-letter">${S} do papel à pele ${S}</p><h4 class="f-display">Decalque</h4><div class="s-dec"><img src="../decalque/cor.webp" alt="" loading="lazy"><span class="s-dec-steps f-body"><b>Desenho</b><b>Decalque</b><b>Traço</b><b>Cor e sombra</b></span></div></section>`,
      sobre: () => `<section class="s s-sobre ${cls('sobre')}"><div class="s-pic"><img src="${PORTRAIT}" alt="" loading="lazy"></div><div><p class="m-eyebrow f-letter">${S} o artista ${S}</p><h4 class="f-display">${esc(state.texts.nome)}</h4><p class="f-body">${esc(state.texts.bio1)}</p>
        <dl class="s-stats f-cond"><div><dt class="f-body">anos</dt><dd>${new Date().getFullYear() - (parseInt(state.texts.desde, 10) || 2020)}</dd></div><div><dt class="f-body">tatuagens</dt><dd>${esc(state.texts.tatuagens)}</dd></div></dl></div></section>`,
      contato: () => `<section class="s s-contato ${cls('contato')}"><p class="m-eyebrow f-letter">${S} agenda aberta ${S}</p><h4 class="f-cond">${esc(contactTitle)}</h4><div class="s-cta" data-bt="${s.botoes}">${buttonHTML(s.botoes === 'flutuante' ? 'solido' : s.botoes, ctaLabel)}</div>
        <ul class="s-contacts f-body"><li><span>WhatsApp</span>${esc(state.texts.whatsapp)}</li><li><span>Instagram</span>${esc(state.texts.instagram)}</li><li><span>Estúdio</span>${esc(state.texts.endereco)}</li>${state.texts.horario ? `<li><span>Horário</span>${esc(state.texts.horario)}</li>` : ''}</ul></section>`,
    }
    const order = state.sections.order.filter((id) => !off.includes(id))
    const newOnes = state.sections.add.map((id) => NEW_SECTIONS.find((x) => x.id === id)).filter(Boolean)

    const nav = `<div class="s-nav ${cls('hero')} ${s.menu === 'app' ? 'is-bottom is-dark' : ''}">${navHTML(s.menu, true)}</div>`
    let html = s.rolagem === 'barra' ? '<i class="s-progress"></i>' : ''
    if (s.menu !== 'app') html += nav
    html += `<section class="s s-hero ${cls('hero')}">${heroHTML(s.hero, true)}</section>`
    if (s.marquee !== 'nenhuma') html += `<section class="s s-mq">${marqueeHTML(s.marquee, true)}</section>`
    let prev = 'hero'
    for (const id of order) {
      if (id === 'contato') continue
      html += dv(prev, id) + blocks[id]()
      prev = id
    }
    for (const n of newOnes) html += `<section class="s s-new ${cls('cartela')}">${ic(n.icon)}<b class="f-display">${n.name}</b><span class="f-body">${n.desc}</span><small class="f-body">seção nova</small></section>`
    if (order.includes('contato')) html += dv(prev, 'contato') + blocks.contato()
    html += `<footer class="s s-footer is-dark"><div class="f-display s-big">${esc(state.texts.nome)}</div><div class="s-foot f-body"><span>© ${new Date().getFullYear()} ${esc(state.texts.nome)} Ink</span><span>Voltar ao topo ↑</span></div></footer>`
    if (s.botoes === 'flutuante') html += `<span class="s-float">${buttonHTML('flutuante')}</span>`
    if (s.menu === 'app') html += nav

    site.dataset.frame = s.moldura
    site.dataset.div = s.divisores
    site.dataset.img = s.imagens
    site.dataset.corner = s.cantos
    site.dataset.tex = s.textura
    site.dataset.mode = mode
    site.innerHTML = html
  }

  /* ---------- status, progresso, resumo ---------- */

  const isChanged = (c) => {
    if (c.type === 'sections') return JSON.stringify(state.sections) !== JSON.stringify(defaults().sections)
    if (c.type === 'texts') return Object.keys(DEFAULT_TEXTS).some((k) => state.texts[k] !== DEFAULT_TEXTS[k])
    const d = defaults().sel[c.id]
    if (c.id === 'paleta' && state.sel.paleta === 'custom') return true
    return JSON.stringify(state.sel[c.id]) !== JSON.stringify(d)
  }
  const optNames = (c) => [].concat(state.sel[c.id]).map((id) => OPT(c.id, id)?.name).filter(Boolean)

  function updateStatus() {
    let decided = 0
    for (const c of ALL_CATS) {
      const el = $(`[data-status="${c.id}"]`)
      const changed = isChanged(c)
      const touched = state.touched[c.id] || changed
      if (touched) decided++
      if (!el) continue
      el.className = `cat-status ${changed ? 'is-changed' : touched ? 'is-kept' : ''}`
      if (c.type === 'sections') el.textContent = changed ? 'Vai mudar' : touched ? 'Mantém' : 'Como está'
      else if (c.type === 'texts') el.textContent = changed ? 'Textos editados' : 'Como está'
      else if (c.type === 'multi') el.textContent = changed ? 'Vai mudar' : touched ? 'Mantém' : 'Como está'
      else el.textContent = changed ? `Muda: ${optNames(c)[0]}` : touched ? 'Mantém o atual' : 'Como está'
      $(`#cat-${c.id}`)?.classList.toggle('is-done', !!touched)
    }
    $('#bar-progress').innerHTML = `<b>${decided}</b>/${ALL_CATS.length} itens vistos`
    for (const step of STEPS) {
      const all = step.cats.length
      const done = step.cats.filter((c) => state.touched[c.id] || isChanged(c)).length
      $(`[data-step-link="${step.id}"]`)?.classList.toggle('is-complete', done === all)
    }
  }

  function syncInputs() {
    for (const c of ALL_CATS) {
      if (!c.options) continue
      const vals = [].concat(state.sel[c.id])
      for (const input of $$(`input[data-cat="${c.id}"]`)) {
        input.checked = vals.includes(input.value)
        input.closest('.opt').classList.toggle('is-on', input.checked)
      }
    }
    for (const el of $$('[data-note]')) el.value = state.notes[el.dataset.note] || ''
    for (const el of $$('[data-color]')) el.value = state.colors[el.dataset.color]
    $('#f-client').value = state.client
    $('#f-refs').value = state.refs
    $('#f-general').value = state.general
    const tf = $('#tf-box')
    if (tf) tf.innerHTML = textsHTML()
    renderSections()
  }

  function summaryData() {
    const changes = []
    const kept = []
    for (const c of ALL_CATS) {
      if (c.type === 'sections' || c.type === 'texts') continue
      if (isChanged(c)) {
        let detail = []
        if (c.type === 'multi') {
          const d = defaults().sel[c.id]
          const now = state.sel[c.id]
          const added = now.filter((x) => !d.includes(x)).map((id) => OPT(c.id, id))
          const removed = d.filter((x) => !now.includes(x)).map((id) => OPT(c.id, id))
          detail = [
            ...added.map((o) => ({ label: `+ ${o.name}`, spec: o.spec })),
            ...removed.map((o) => ({ label: `− tirar ${o.name}`, spec: o.spec })),
          ]
        } else {
          const o = OPT(c.id, state.sel[c.id])
          let spec = o.spec
          if (c.id === 'paleta' && o.custom) spec = `--paper ${state.colors.paper} · --ink ${state.colors.ink} · --red ${state.colors.accent} · --brass ${state.colors.gold}`
          detail = [{ label: o.name, id: o.id, spec }]
        }
        changes.push({ c, detail, note: state.notes[c.id] })
      } else kept.push({ c, note: state.notes[c.id] })
    }
    const texts = Object.keys(DEFAULT_TEXTS)
      .filter((k) => state.texts[k] !== DEFAULT_TEXTS[k])
      .map((k) => ({ k, label: TEXT_FIELDS.find((f) => f.id === k)?.label || k, from: DEFAULT_TEXTS[k], to: state.texts[k] }))
    return { changes, kept, texts }
  }

  function renderSummary() {
    const { changes, kept, texts } = summaryData()
    const secChanged = isChanged(CAT.secoes)
    const box = $('#summary')
    const item = (x) =>
      `<li><a href="#cat-${x.c.id}">${x.c.title}</a><span>${x.detail.map((d) => esc(d.label)).join(', ')}</span>${x.note ? `<em>“${esc(x.note)}”</em>` : ''}</li>`
    box.innerHTML = `
      <div class="sum-col"><h4>Vai mudar <b>${changes.length + (secChanged ? 1 : 0) + (texts.length ? 1 : 0)}</b></h4>
        ${changes.length || secChanged || texts.length ? `<ul>${changes.map(item).join('')}
          ${secChanged ? `<li><a href="#cat-secoes">Seções</a><span>${sectionsLine()}</span></li>` : ''}
          ${texts.length ? `<li><a href="#cat-textos">Textos</a><span>${texts.map((t) => esc(t.label)).join(', ')}</span></li>` : ''}</ul>` : '<p class="sum-empty">Nada ainda. Tudo continua como está.</p>'}
      </div>
      <div class="sum-col is-kept"><h4>Continua igual <b>${kept.length}</b></h4><p>${kept.map((x) => `<a href="#cat-${x.c.id}">${x.c.title}</a>`).join(' · ')}</p></div>`
  }

  function sectionsLine() {
    const { order, off, add } = state.sections
    const names = (ids, list) => ids.map((id) => list.find((x) => x.id === id)?.name).filter(Boolean)
    const parts = []
    const d = defaults().sections.order
    if (JSON.stringify(order) !== JSON.stringify(d)) parts.push(`nova ordem: ${names(order.filter((id) => !off.includes(id)), SECTIONS).join(' → ')}`)
    if (off.length) parts.push(`tirar: ${names(off, SECTIONS).join(', ')}`)
    if (add.length) parts.push(`adicionar: ${names(add, NEW_SECTIONS).join(', ')}`)
    return esc(parts.join(' · '))
  }

  async function buildCode() {
    const { changes, kept, texts } = summaryData()
    const data = await encode(compact())
    const now = new Date()
    const date = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const L = []
    L.push('==== MARCHELLO INK · ESCOLHAS DO SITE ====')
    L.push(`Cliente: ${state.client || '(sem nome)'} · ${date}`)
    L.push('')
    const secChanged = isChanged(CAT.secoes)
    const total = changes.length + (secChanged ? 1 : 0) + (texts.length ? 1 : 0)
    L.push(`>> O QUE MUDA (${total})`)
    if (!total) L.push('Nada. Tudo continua como está.')
    let i = 0
    for (const x of changes) {
      i++
      L.push(`${i}. [${x.c.step.short} / ${x.c.title}] ${x.detail.map((d) => d.label).join(', ')}${x.detail[0]?.id ? `  ‹${x.c.id}=${x.detail[0].id}›` : `  ‹${x.c.id}›`}`)
      for (const d of x.detail) if (d.spec) L.push(`   ↳ ${x.detail.length > 1 ? `${d.label}: ` : ''}${d.spec}`)
      if (x.note) L.push(`   ↳ comentário: "${x.note.trim()}"`)
    }
    if (secChanged) {
      i++
      const { order, off, add } = state.sections
      L.push(`${i}. [Estrutura / Seções]  ‹secoes›`)
      L.push(`   ↳ ordem: Abertura → ${order.filter((id) => !off.includes(id)).map((id) => SECTIONS.find((s) => s.id === id).name).join(' → ')}`)
      if (off.length) L.push(`   ↳ tirar: ${off.map((id) => SECTIONS.find((s) => s.id === id).name).join(', ')}`)
      for (const id of add) {
        const n = NEW_SECTIONS.find((s) => s.id === id)
        L.push(`   ↳ adicionar: ${n.name} — ${n.spec}`)
      }
      if (state.notes.secoes) L.push(`   ↳ comentário: "${state.notes.secoes.trim()}"`)
    }
    if (texts.length) {
      i++
      L.push(`${i}. [Textos / O que está escrito]  ‹textos›`)
      for (const t of texts) {
        L.push(`   ↳ ${t.label}:`)
        L.push(`     antes: "${t.from || '(vazio)'}"`)
        L.push(`     agora: "${t.to || '(vazio)'}"`)
      }
      if (state.notes.textos) L.push(`   ↳ comentário: "${state.notes.textos.trim()}"`)
    }
    L.push('')
    L.push(`>> CONTINUA COMO ESTÁ (${kept.length})`)
    L.push(kept.map((x) => x.c.title).join(' · ') || '—')
    const keptNotes = kept.filter((x) => x.note && x.note.trim())
    if (keptNotes.length) {
      L.push('Comentários nesses itens:')
      for (const x of keptNotes) L.push(`- ${x.c.title}: "${x.note.trim()}"`)
    }
    if (!secChanged && state.notes.secoes) L.push(`- Seções: "${state.notes.secoes.trim()}"`)
    if (!texts.length && state.notes.textos) L.push(`- Textos: "${state.notes.textos.trim()}"`)
    if (state.refs.trim()) {
      L.push('')
      L.push('>> REFERÊNCIAS')
      L.push(state.refs.trim())
    }
    if (state.general.trim()) {
      L.push('')
      L.push('>> OBSERVAÇÕES')
      L.push(state.general.trim())
    }
    L.push('')
    L.push('>> ABRIR ESTAS ESCOLHAS NA PÁGINA (não apague)')
    L.push(`${location.origin}${location.pathname.replace(/index\.html$/, '')}#c=${data}`)
    L.push('==== FIM ====')
    return L.join('\n')
  }

  let codeTimer = 0
  function scheduleCode() {
    clearTimeout(codeTimer)
    codeTimer = setTimeout(async () => {
      const code = await buildCode()
      const ta = $('#code')
      ta.value = code
      $('#code-size').textContent = `${code.length.toLocaleString('pt-BR')} caracteres`
      const base = WHATSAPP_DEV ? `https://wa.me/${WHATSAPP_DEV}` : 'https://wa.me/'
      $('#send-wa').href = `${base}?text=${encodeURIComponent(code)}`
    }, 250)
  }

  function refresh({ inputs = false } = {}) {
    applyVars()
    if (inputs) syncInputs()
    renderSite()
    updateStatus()
    renderSummary()
    scheduleCode()
    save()
  }

  /* ------------------------------------------------------------------ */
  /* Eventos                                                             */
  /* ------------------------------------------------------------------ */

  function bind() {
    const main = $('#steps')

    main.addEventListener('change', (e) => {
      const t = e.target
      if (t.matches('input[data-cat]')) {
        const c = CAT[t.dataset.cat]
        if (c.type === 'multi') state.sel[c.id] = $$(`input[data-cat="${c.id}"]:checked`).map((x) => x.value)
        else state.sel[c.id] = t.value
        state.touched[c.id] = true
        for (const input of $$(`input[data-cat="${c.id}"]`)) input.closest('.opt').classList.toggle('is-on', input.checked)
        refresh()
      } else if (t.matches('[data-keep]')) {
        const id = t.dataset.keep
        const off = new Set(state.sections.off)
        t.checked ? off.delete(id) : off.add(id)
        state.sections.off = [...off]
        state.touched.secoes = true
        renderSections()
        refresh()
      } else if (t.matches('[data-add]')) {
        const id = t.dataset.add
        const add = new Set(state.sections.add)
        t.checked ? add.add(id) : add.delete(id)
        state.sections.add = NEW_SECTIONS.map((s) => s.id).filter((x) => add.has(x))
        state.touched.secoes = true
        renderSections()
        refresh()
      }
    })

    main.addEventListener('input', (e) => {
      const t = e.target
      if (t.matches('[data-color]')) {
        state.colors[t.dataset.color] = t.value
        state.sel.paleta = 'custom'
        state.touched.paleta = true
        for (const input of $$('input[data-cat="paleta"]')) {
          input.checked = input.value === 'custom'
          input.closest('.opt').classList.toggle('is-on', input.checked)
        }
        refresh()
      } else if (t.matches('[data-note]')) {
        state.notes[t.dataset.note] = t.value
        updateStatus()
        renderSummary()
        scheduleCode()
        save()
      } else if (t.matches('[data-text]')) {
        state.texts[t.dataset.text] = t.value
        state.touched.textos = true
        t.closest('.tf-i').classList.toggle('is-changed', t.value !== DEFAULT_TEXTS[t.dataset.text])
        refresh()
      } else if (t.id === 'f-client' || t.id === 'f-refs' || t.id === 'f-general') {
        state[{ 'f-client': 'client', 'f-refs': 'refs', 'f-general': 'general' }[t.id]] = t.value
        scheduleCode()
        save()
      }
    })

    main.addEventListener('click', async (e) => {
      // clicar na opção que já está marcada (ex.: "manter o atual") também conta como visto
      if (e.target.matches('input[data-cat]')) {
        if (!state.touched[e.target.dataset.cat]) {
          state.touched[e.target.dataset.cat] = true
          updateStatus()
          renderSummary()
          scheduleCode()
          save()
        }
        return
      }
      const t = e.target.closest('button, a')
      if (!t) return
      if (t.dataset.preset != null) {
        const p = TYPE_PRESETS[+t.dataset.preset]
        Object.assign(state.sel, p.f)
        for (const k in p.f) state.touched[k] = true
        refresh({ inputs: true })
        toast(`Combinação “${p.name}” aplicada`)
      } else if (t.dataset.move) {
        const id = t.closest('[data-sec]').dataset.sec
        const order = state.sections.order
        const i = order.indexOf(id)
        const j = i + +t.dataset.move
        if (j < 0 || j >= order.length) return
        ;[order[i], order[j]] = [order[j], order[i]]
        state.touched.secoes = true
        renderSections()
        $(`[data-sec="${id}"] [data-move="${t.dataset.move}"]`)?.focus()
        refresh()
      } else if (t.dataset.reset) {
        const k = t.dataset.reset
        e.preventDefault()
        state.texts[k] = DEFAULT_TEXTS[k]
        const field = $(`[data-text="${k}"]`)
        field.value = DEFAULT_TEXTS[k]
        field.closest('.tf-i').classList.remove('is-changed')
        refresh()
      } else if (t.id === 'copy') {
        await copy($('#code').value)
      } else if (t.id === 'download') {
        const blob = new Blob([$('#code').value], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `escolhas-marchello-ink${state.client ? '-' + state.client.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''}.txt`
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 2000)
      } else if (t.id === 'send-wa') {
        if ($('#code').value.length > 6000) toast('Mensagem grande: se sair cortada, use “Copiar código”')
      } else if (t.id === 'load-btn') {
        try {
          state = expand(await decode($('#load-code').value))
          refresh({ inputs: true })
          toast('Escolhas abertas!')
          $('#load-code').value = ''
        } catch {
          toast('Não achei um código válido aí')
        }
      } else if (t.id === 'reset') {
        if (!confirm('Apagar todas as escolhas e voltar tudo pro site atual?')) return
        state = defaults()
        refresh({ inputs: true })
        toast('Tudo voltou pro atual')
      }
    })

    // prévia no celular
    const preview = $('#preview')
    $('#open-preview').addEventListener('click', () => {
      preview.classList.add('is-open')
      document.body.classList.add('lock')
    })
    $('#close-preview').addEventListener('click', () => {
      preview.classList.remove('is-open')
      document.body.classList.remove('lock')
    })
    const scroller = $('#preview-scroll')
    scroller.addEventListener(
      'scroll',
      () => {
        const max = scroller.scrollHeight - scroller.clientHeight
        $('#site').style.setProperty('--p', max > 0 ? (scroller.scrollTop / max).toFixed(3) : 0)
      },
      { passive: true },
    )

    // etapa ativa na barra
    const links = $$('[data-step-link]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries)
          if (en.isIntersecting) for (const l of links) l.classList.toggle('is-active', l.dataset.stepLink === en.target.dataset.step)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    $$('.step').forEach((s) => io.observe(s))

    // pausa animações fora da tela
    const vis = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('in-view', en.isIntersecting)), { rootMargin: '80px' })
    $$('.stage').forEach((s) => vis.observe(s))
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
      toast('Código copiado! Agora é só colar no WhatsApp')
    } catch {
      const ta = $('#code')
      ta.focus()
      ta.select()
      document.execCommand('copy')
      toast('Código copiado!')
    }
  }

  let toastT = 0
  function toast(msg) {
    const el = $('#toast')
    el.textContent = msg
    el.classList.add('is-on')
    clearTimeout(toastT)
    toastT = setTimeout(() => el.classList.remove('is-on'), 2600)
  }

  /* ------------------------------------------------------------------ */
  /* Início                                                              */
  /* ------------------------------------------------------------------ */

  async function init() {
    let loaded = 'none'
    const hash = location.hash.match(/c=([^&]+)/)
    if (hash) {
      try {
        state = expand(await decode(decodeURIComponent(hash[1])))
        loaded = 'hash'
        // tira o código da URL: daqui pra frente vale o que for salvo neste aparelho
        history.replaceState(null, '', location.pathname)
      } catch {}
    }
    if (loaded === 'none') {
      try {
        const raw = localStorage.getItem(STORE_KEY)
        if (raw) {
          state = expand(JSON.parse(raw))
          loaded = 'local'
        }
      } catch {}
    }
    renderSteps()
    syncInputs()
    bind()
    refresh()
    // no celular as opções viram carrossel: já abre mostrando a escolhida
    for (const box of $$('.opts')) {
      const on = box.querySelector('.opt.is-on')
      if (on && box.scrollWidth > box.clientWidth) box.scrollLeft += on.getBoundingClientRect().left - box.getBoundingClientRect().left - 16
    }
    if (loaded === 'hash') toast('Escolhas abertas pelo link')
    else if (loaded === 'local' && Object.keys(compact()).length > 1) toast('Continuando de onde você parou')
  }

  init()
})()
