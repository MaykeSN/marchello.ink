// Catálogo das artes disponíveis. Gerado por "npm run flash" (tools/flash): não edite à mão.
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
  { slug: 'gueixa', name: 'Gueixa', style: 'Neotradicional', tier: 'destaque', score: 10, w: 738, h: 1300, note: 'A peça mais marcante: neotradicional com o vermelho como único ponto de cor. A marca @marchello.ink passa sobre a testa.' },
  { slug: 'sacerdotisa-carneiro', name: 'Sacerdotisa do carneiro', style: 'Neotradicional', tier: 'destaque', score: 10, w: 857, h: 1300, note: 'Neotradicional com laranja e muitos detalhes ornamentais. É a mesma arte da seção do decalque.' },
  { slug: 'medusa', name: 'Medusa', style: 'Neotradicional', tier: 'destaque', score: 10, w: 847, h: 1300, note: 'Desenho de 2025, traço maduro e contraste perfeito. Agora em PNG original, com a marca d’água da lateral removida.' },
  { slug: 'dragao-oni', name: 'Dragão e oni', style: 'Neotradicional', tier: 'destaque', score: 9.5, w: 1100, h: 1300, note: 'Novo no Drive: dragão com máscara oni e vermelho, em PNG original. Uma das peças mais fortes.' },
  { slug: 'rei-caveira', name: 'Rei caveira', style: 'Neotradicional', tier: 'destaque', score: 9.5, w: 704, h: 1300, note: 'Projeto de antebraço de 2025, muito forte. Veio de mockup em braço, limpo pra fundo de papel.' },
  { slug: 'pirata', name: 'Pirata', style: 'Neotradicional', tier: 'destaque', score: 9.5, w: 556, h: 1300, note: 'Projeto de braço de 2025, com personagem e narrativa. Agora em PNG original, em alta resolução.' },
  { slug: 'melancolia', name: 'Melancolia', style: 'Realismo', tier: 'destaque', score: 9.5, w: 792, h: 1300, note: 'Anjo com violoncelo, projeto grande. Versão PNG do Drive, só no traço: luz e sombra são feitas na pele.' },
  { slug: 'gorgona', name: 'Górgona', style: 'Neotradicional', tier: 'destaque', score: 9, w: 766, h: 1300, note: 'Novo no Drive: medusa de frente com serpentes, contraste alto e arquivo original limpo.' },
  { slug: 'deusa-da-lua', name: 'Deusa da lua', style: 'Neotradicional', tier: 'destaque', score: 9, w: 800, h: 1300, size: 'mín. 15 cm', note: 'Neotradicional clássico, simétrico, com pedido de mínimo 15 cm.' },
  { slug: 'mascara-mariposas', name: 'Máscara e mariposas', style: 'Neotradicional', tier: 'destaque', score: 9, w: 1066, h: 1297, refPrice: 400, note: 'A melhor da cartela 6: rosto, máscara e mariposas bem integrados.' },
  { slug: 'valquiria', name: 'Valquíria', style: 'Neotradicional', tier: 'destaque', score: 8.5, w: 745, h: 1300, note: 'Ótima composição. A marca @marchello.ink atravessa o rosto.' },
  { slug: 'pardal-adaga', name: 'Pardal e adaga', style: 'Neotradicional', tier: 'destaque', score: 8.5, w: 603, h: 1300, refPrice: 500, note: 'Pássaro muito bem desenhado sobre a adaga, uma peça vertical forte.' },
  { slug: 'olho-no-coracao', name: 'Olho no coração', style: 'Neotradicional', tier: 'destaque', score: 8.5, w: 646, h: 1300, refPrice: 500, note: 'Neotradicional de livro: adaga, coração, olho e rosa.' },
  { slug: 'mulher-peonia', name: 'Mulher e peônia', style: 'Neotradicional', tier: 'destaque', score: 8.5, w: 726, h: 1300, refPrice: 450, note: 'Rosto e flor no estilo característico dele, com boa leitura em tamanho médio.' },
  { slug: 'dragao-oriental', name: 'Dragão oriental', style: 'Neotradicional', tier: 'cartela', score: 8, w: 719, h: 1300, size: 'projeto de perna', note: 'Novo no Drive: dragão oriental desenhado sobre a perna. Projeto grande, traço fino.' },
  { slug: 'sol-nuvens', name: 'Sol entre nuvens', style: 'Neotradicional', tier: 'cartela', score: 8, w: 1088, h: 1078, refPrice: 350, note: 'Sol com nuvens orientais e olho, boa peça média.' },
  { slug: 'mao-rosas', name: 'Mão com rosas', style: 'Neotradicional', tier: 'cartela', score: 8, w: 847, h: 1238, refPrice: 500, note: 'Mão com rosas e pulseira de contas, delicada e bem resolvida.' },
  { slug: 'sagrado-coracao', name: 'Sagrado coração', style: 'Neotradicional', tier: 'cartela', score: 8, w: 738, h: 879, refPrice: 250, note: 'Sagrado coração com rosas, clássico que sempre vende.' },
  { slug: 'raposa-kitsune', name: 'Raposa e kitsune', style: 'Neotradicional', tier: 'cartela', score: 8, w: 499, h: 1300, refPrice: 450, note: 'Raposa com máscara kitsune e cordas, com movimento bonito.' },
  { slug: 'mulher-lamina', name: 'Mulher e lâmina', style: 'Neotradicional', tier: 'cartela', score: 8, w: 455, h: 1300, refPrice: 450, note: 'Rosto refletido na lâmina, ideia original e vertical.' },
  { slug: 'raposa-amarrada', name: 'Raposa amarrada', style: 'Neotradicional', tier: 'cartela', score: 7.5, w: 639, h: 1300, refPrice: 450, note: 'Bonita, mas o sombreado é mais claro e perde força em tamanho pequeno.' },
  { slug: 'oni', name: 'Máscara oni', style: 'Neotradicional', tier: 'cartela', score: 7.5, w: 802, h: 986, refPrice: 250, note: 'Máscara oni bem construída.' },
  { slug: 'passaro-costelas', name: 'Pássaro e costelas', style: 'Blackwork', tier: 'cartela', score: 7.5, w: 628, h: 1300, refPrice: 350, note: 'Pássaro com costelas expostas, blackwork com personalidade.' },
  { slug: 'rosa-aranha', name: 'Rosa aranha', style: 'Blackwork', tier: 'cartela', score: 7.5, w: 688, h: 1193, refPrice: 200, note: 'Rosa com pernas de aranha, conceito forte e simples.' },
  { slug: 'cavalo-marinho', name: 'Cavalo-marinho', style: 'Neotradicional', tier: 'cartela', score: 7.5, w: 609, h: 991, refPrice: 200, note: 'Cavalo-marinho com barbatanas de dragão, diferente.' },
  { slug: 'rosto-em-flor', name: 'Rosto em flor', style: 'Fine line', tier: 'cartela', score: 7.5, w: 989, h: 1297, refPrice: 350, note: 'Traço fino e delicado. Precisa de tamanho pra não perder detalhe.' },
  { slug: 'encapuzada', name: 'Encapuzada', style: 'Neotradicional', tier: 'cartela', score: 7, w: 573, h: 1300, note: 'Rosto bom, mas a parte de baixo é bem clara e a marca d’água passa no meio.' },
  { slug: 'passaro-rosa', name: 'Pássaro e rosa', style: 'Blackwork', tier: 'cartela', score: 7, w: 822, h: 1300, note: 'Pássaro com rosa, sombreado leve.' },
  { slug: 'isqueiro-love', name: 'Isqueiro "love"', style: 'Neotradicional', tier: 'cartela', score: 7, w: 493, h: 813, refPrice: 200, note: 'Isqueiro "love" com coração de fumaça, divertido e pequeno.' },
  { slug: 'coracao-adaga', name: 'Coração e adaga', style: 'Neotradicional', tier: 'cartela', score: 7, w: 666, h: 1023, refPrice: 200, note: 'Coração anatômico com adaga e chamas. Correto, mas comum.' },
  { slug: 'garca', name: 'Garça', style: 'Blackwork', tier: 'cartela', score: 7, w: 1300, h: 1030, refPrice: 350, note: 'Garça em voo, horizontal, bom pra costela ou antebraço.' },
  { slug: 'olho-cristal', name: 'Olho de cristal', style: 'Neotradicional', tier: 'cartela', score: 7, w: 644, h: 993, refPrice: 200, note: 'Olho em cristal partido com lua.' },
  { slug: 'kitsune', name: 'Kitsune', style: 'Neotradicional', tier: 'cartela', score: 7, w: 777, h: 959, refPrice: 150, note: 'Máscara kitsune simples e fofa, boa como primeira tattoo.' },
  { slug: 'oni-borla', name: 'Oni com borla', style: 'Neotradicional', tier: 'cartela', score: 7, w: 915, h: 918, refPrice: 250, note: 'Meia máscara oni, que funciona melhor em conjunto.' },
  { slug: 'sol-rosto', name: 'Sol', style: 'Blackwork', tier: 'cartela', score: 6.5, w: 838, h: 818, refPrice: 250, note: 'Sol com rosto, peça clássica de fine line.' },
  { slug: 'coracao-que-chora', name: 'Coração que chora', style: 'Neotradicional', tier: 'cartela', score: 6.5, w: 498, h: 556, refPrice: 150, note: 'Coração com olho chorando, simples.' },
  { slug: 'pardal-galho', name: 'Pardal no galho', style: 'Neotradicional', tier: 'cartela', score: 6.5, w: 852, h: 1300, refPrice: 400, note: 'Traço claro, perde contraste na tela.' },
  { slug: 'lirio', name: 'Lírio', style: 'Fine line', tier: 'cartela', score: 6, w: 489, h: 724, refPrice: 150, note: 'Bonito, mas a imagem de origem é pequena (pouca resolução).' },
  { slug: 'lua-brilho', name: 'Lua e brilho', style: 'Mini', tier: 'mini', score: 6, w: 439, h: 476, refPrice: 150, note: 'Mini: lua com estrela fina.' },
  { slug: 'lua-estrelas', name: 'Lua e estrelas', style: 'Mini', tier: 'mini', score: 6, w: 471, h: 643, refPrice: 150, note: 'Mini: lua com brilhos.' },
  { slug: 'adaga-lirios', name: 'Adaga e lírios', style: 'Neotradicional', tier: 'cartela', score: 6, w: 1300, h: 606, refPrice: 500, note: 'Muito horizontal e fino: fica pequeno nas cartelas.' },
  { slug: 'mosca', name: 'Mosca', style: 'Blackwork', tier: 'cartela', score: 6, w: 792, h: 957, refPrice: 200, note: 'Inseto simples, sem muito destaque.' },
  { slug: 'arame-farpado', name: 'Arame farpado', style: 'Mini', tier: 'mini', score: 5.5, w: 452, h: 461, refPrice: 100, note: 'Mini: arame farpado.' },
  { slug: 'corvo', name: 'Corvo', style: 'Blackwork', tier: 'cartela', score: 5.5, w: 1054, h: 838, refPrice: 200, note: 'Parece esboço, sem acabamento final.' },
  { slug: 'gato-cafe', name: 'Gato do café', style: 'Fine line', tier: 'cartela', score: 5, w: 418, h: 658, refPrice: 150, note: 'Traço muito claro e imagem de origem pequena: a mais fraca pra vitrine.' },
  { slug: 'estrela', name: 'Estrela', style: 'Mini', tier: 'mini', score: 5, w: 332, h: 444, refPrice: 100, note: 'Mini: estrela de 8 pontas.' },
  { slug: 'brilho', name: 'Brilho', style: 'Mini', tier: 'mini', score: 5, w: 324, h: 457, refPrice: 100, note: 'Mini: brilho de 4 pontas.' },
]

/** Já tatuadas (tinham X vermelho nos stories): fora do site, ficam só no catálogo. */
export const alreadyTattooed = ['Besouro alado', 'Coração em chamas', 'Lua e aranha', 'Morcego', 'Portal da lua', 'Kitsune com sinos', 'Kitsune e flor', 'Hannya', 'Besouro']

export const featured = flash.filter((f) => f.tier === 'destaque')

export const flashImg = (slug: string, small = false) => `${import.meta.env.BASE_URL}flash/${slug}${small ? '-sm' : ''}.webp`
