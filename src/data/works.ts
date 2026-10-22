// Trabalhos (tatuagens prontas) e fotos do artista. Gerado por "npm run drive" (tools/drive): não edite à mão.
// Curadoria (títulos, tags, ordem): tools/drive/curation.mjs

export type WorkTag = 'neo' | 'rostos' | 'anime' | 'floral' | 'grandes' | 'cor'

export type Work = { slug: string; title: string; tags: WorkTag[]; score: number; w: number; h: number; color: string }

export const works: Work[] = [
  { slug: "costas-mulher-magnolias", title: "Costas: mulher e magnólias", tags: ["grandes","rostos","neo"], score: 10, w: 1280, h: 1600, color: "#686868" },
  { slug: "costas-dragao", title: "Costas: dragão e samurai", tags: ["grandes","neo","cor"], score: 10, w: 901, h: 1600, color: "#484848" },
  { slug: "passaro-magnolias", title: "Pássaro e magnólias", tags: ["neo","cor"], score: 9.5, w: 1280, h: 1600, color: "#a8a8a8" },
  { slug: "medusa-braco", title: "Medusa", tags: ["rostos","neo"], score: 9.5, w: 899, h: 1600, color: "#181818" },
  { slug: "luffy", title: "Luffy", tags: ["anime","grandes"], score: 9.5, w: 1281, h: 1600, color: "#686868" },
  { slug: "dragao-vermelho", title: "Dragão oriental", tags: ["neo","cor"], score: 9.5, w: 1200, h: 1600, color: "#181818" },
  { slug: "mulher-loba", title: "Mulher loba", tags: ["rostos","neo"], score: 9, w: 1200, h: 1600, color: "#282828" },
  { slug: "rosto-relogio", title: "Rosto e relógio", tags: ["rostos"], score: 9, w: 1280, h: 1600, color: "#585858" },
  { slug: "samurai-vermelho", title: "Samurai em vermelho", tags: ["neo","cor"], score: 9, w: 901, h: 1600, color: "#686868" },
  { slug: "costas-florais", title: "Costas florais", tags: ["grandes","floral"], score: 9, w: 1200, h: 1600, color: "#e8d8d8" },
  { slug: "serpente", title: "Serpente", tags: ["grandes","neo"], score: 9, w: 1200, h: 1600, color: "#b8b8b8" },
  { slug: "sanji", title: "Sanji", tags: ["anime","cor"], score: 9, w: 1200, h: 1600, color: "#685858" },
  { slug: "braco-fechado", title: "Braço fechado", tags: ["grandes","rostos","anime"], score: 8.5, w: 901, h: 1600, color: "#181818" },
  { slug: "dragao-lua", title: "Dragão e lua", tags: ["neo"], score: 8.5, w: 1200, h: 1600, color: "#080808" },
  { slug: "garca", title: "Garça", tags: ["neo","grandes"], score: 8.5, w: 1214, h: 1600, color: "#484848" },
  { slug: "amaterasu", title: "Amaterasu (Ōkami)", tags: ["anime","cor"], score: 8.5, w: 1220, h: 1600, color: "#080808" },
  { slug: "peonia-serpente", title: "Peônia e serpente", tags: ["floral","neo"], score: 8.5, w: 900, h: 1600, color: "#080808" },
  { slug: "vegeta", title: "Vegeta", tags: ["anime"], score: 8.5, w: 1083, h: 1353, color: "#484848" },
  { slug: "oni-chamas", title: "Oni em chamas", tags: ["neo"], score: 8, w: 1202, h: 1600, color: "#282828" },
  { slug: "adaga-rosas", title: "Adaga e rosas", tags: ["neo","cor"], score: 8, w: 900, h: 1600, color: "#181818" },
  { slug: "lobo-cogumelo", title: "Lobo e cogumelo", tags: ["neo"], score: 8, w: 1187, h: 1600, color: "#181818" },
  { slug: "raposa-torii", title: "Raposa e torii", tags: ["neo","cor"], score: 8, w: 900, h: 1600, color: "#585858" },
  { slug: "feraligatr", title: "Feraligatr (Pokémon)", tags: ["anime","cor"], score: 8, w: 900, h: 1600, color: "#c8c8c8" },
  { slug: "cavaleiro", title: "Cavaleiro", tags: ["rostos"], score: 8, w: 901, h: 1600, color: "#787878" },
  { slug: "lirios-sol", title: "Lírios e sol", tags: ["floral"], score: 7.5, w: 900, h: 1600, color: "#181818" },
  { slug: "rosto-flor", title: "Rosto e flor", tags: ["floral","rostos"], score: 7.5, w: 900, h: 1600, color: "#181818" },
  { slug: "besouro", title: "Besouro", tags: ["neo","cor"], score: 7.5, w: 900, h: 1600, color: "#181818" },
  { slug: "aranha", title: "Aranha", tags: ["neo","cor"], score: 7.5, w: 900, h: 1600, color: "#484848" },
  { slug: "rosto-lamina", title: "Rosto e lâmina", tags: ["rostos","floral"], score: 7.5, w: 1079, h: 1350, color: "#383838" },
  { slug: "dragao-blackwork", title: "Dragão", tags: ["neo"], score: 7.5, w: 1200, h: 1600, color: "#181818" },
  { slug: "rosa", title: "Rosa", tags: ["floral"], score: 7.5, w: 900, h: 1600, color: "#181818" },
  { slug: "peonias", title: "Peônias", tags: ["floral"], score: 7.5, w: 900, h: 1600, color: "#888888" },
  { slug: "floral", title: "Floral", tags: ["floral"], score: 7.5, w: 901, h: 1600, color: "#e8b8a8" },
  { slug: "gatos-flores", title: "Gatos e flores", tags: ["floral"], score: 7, w: 900, h: 1600, color: "#080808" },
  { slug: "flores-mao", title: "Flores na mão", tags: ["floral"], score: 7, w: 900, h: 1600, color: "#585858" },
  { slug: "libelula", title: "Libélula", tags: ["neo","cor"], score: 7, w: 900, h: 1600, color: "#080808" },
  { slug: "escorpiao-aranha", title: "Escorpião e aranha", tags: ["neo","cor"], score: 7, w: 1080, h: 1370, color: "#888888" },
  { slug: "centopeia", title: "Centopeia", tags: ["neo"], score: 7, w: 900, h: 1600, color: "#686868" },
]

export type Photo = { alt: string; w: number; h: number; color: string }

export const photos = {
  "maos": { alt: "Mãos de luva preta tatuando sob a luz do ring light", w: 1440, h: 1800, color: "#181818" },
  "olhar": { alt: "Close do olhar do Marchello por trás dos óculos durante uma sessão", w: 1440, h: 1800, color: "#e8d8c8" },
  "retrato": { alt: "Marchello de máscara e óculos, concentrado enquanto tatua", w: 1440, h: 1800, color: "#181818" },
  "estudio": { alt: "Marchello tatuando no estúdio, com quadros de flash na parede", w: 1800, h: 1200, color: "#181818" },
} satisfies Record<string, Photo>

const base = import.meta.env.BASE_URL
export const workImg = (slug: string, small = false) => `${base}trabalhos/${slug}${small ? '-sm' : ''}.webp`
export const photoImg = (slug: keyof typeof photos, small = false) => `${base}fotos/${slug}${small ? '-sm' : ''}.webp`
