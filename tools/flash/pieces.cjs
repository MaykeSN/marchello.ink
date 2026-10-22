// Peças recortadas dos stories. Coordenadas em escala de exibição 900x2000 (o print real é 1220x2712).
// src:    índice do print em assets-src/stories (1-based, ordem alfabética)
// box:    [x0, y0, x1, y1] área da peça        ex: áreas a apagar (marca d'água, vizinhos, textos)
// single: story de uma arte só (mantém a cor)  sold: já tatuada (X vermelho), fica fora do site
// inkMode/localT/wmZone/wp: ajustes de detecção pra mockups em braço e marca d'água
// price:  valor que aparecia na cartela (referência, não vai pro site)
module.exports = [
  // ---- avulsas (stories de uma arte só) ----
  // ---- PNG originais da pasta Disponiveis do Drive (junho/2026) ----
  { file: 'disponiveis/1DRROS2n_gNrDJJM2qKH0gaYQ8hL1el-h.png', slug: 'dragao-oni', name: 'Dragão e oni', style: 'Neotradicional', single: true, wp: 0.95 },
  { file: 'disponiveis/10pTcd3lUVnoNthx1ilepprlbUKHCK0Pm.png', slug: 'gorgona', name: 'Górgona', style: 'Neotradicional', single: true, wp: 0.95 },
  { file: 'disponiveis/1eyTr5vnWWpQZkrrvMra-FTtAdGSJk7kE.png', slug: 'dragao-oriental', name: 'Dragão oriental', style: 'Neotradicional', single: true, wp: 0.9, inkMode: 'local', localT: 14, bgMode: 'local', size: 'projeto de perna' },
  { src: 2, slug: 'gueixa', name: 'Gueixa', style: 'Neotradicional', box: [132, 320, 830, 1632], single: true, wmZone: 262, wp: 0.93, ex: [[0,315,158,640],[132,315,262,350]] },
  { src: 6, slug: 'sacerdotisa-carneiro', name: 'Sacerdotisa do carneiro', style: 'Neotradicional', box: [110, 425, 800, 1500], single: true, wp: 0.93, inkMode: 'local' },
  { src: 13, slug: 'rei-caveira', name: 'Rei caveira', style: 'Neotradicional', box: [108, 176, 800, 1625], single: true, wp: 0.92, inkMode: 'dark', ex: [[0, 1420, 382, 1532], [108, 205, 740, 250], [108, 250, 362, 300]] },
  { file: 'disponiveis/1bj-zpnHPwO-x7A42OXo2Xrr15fAm1o_M.png', slug: 'pirata', name: 'Pirata', style: 'Neotradicional', box: [360, 0, 1620, 2880], single: true, wp: 0.95, bgClampX: 360 },
  { file: 'disponiveis/1QYunIf1QGt_xoRFsP8QRTER9drsA_8-I.png', slug: 'medusa', name: 'Medusa', style: 'Neotradicional', single: true, wp: 0.95, bgClampX: 430, wmZone: 430, wmTop: 0, wmDark: 70 },
  { file: 'disponiveis/1yxAERTYvscVbAdgSRfbI3wmdPfaAIG47.png', slug: 'melancolia', name: 'Melancolia', style: 'Realismo', single: true, wp: 0.95 },
  { src: 3, slug: 'valquiria', name: 'Valquíria', style: 'Neotradicional', box: [140, 320, 890, 1600], single: true, wmZone: 262, wp: 0.93, inkMode: 'local', localT: 18, ex: [[0,315,285,780]] },
  { src: 4, slug: 'deusa-da-lua', name: 'Deusa da lua', style: 'Neotradicional', box: [190, 340, 900, 1505], single: true, wmZone: 262, wp: 0.93, inkMode: 'local', localT: 18, size: 'mín. 15 cm', ex: [[0,330,262,540]] },
  { src: 5, slug: 'encapuzada', name: 'Encapuzada', style: 'Neotradicional', box: [190, 290, 870, 1600], single: true, wmZone: 262, wp: 0.93, inkMode: 'local', localT: 14, ex: [[0,285,256,880],[190,285,262,700]] },
  { src: 1, slug: 'passaro-rosa', name: 'Pássaro e rosa', style: 'Blackwork', box: [140, 380, 860, 1570], single: true, wmZone: 262, wp: 0.93, inkMode: 'local', localT: 14 },

  // ---- cartela 1 (2 abr 2024) ----
  { src: 7, slug: 'lirio', name: 'Lírio', style: 'Fine line', box: [58, 422, 238, 702], price: 150 },
  { src: 7, slug: 'gato-cafe', name: 'Gato do café', style: 'Fine line', box: [240, 425, 398, 678], price: 150 },
  { src: 7, slug: 'sol-rosto', name: 'Sol', style: 'Blackwork', box: [395, 398, 718, 712], price: 250 },
  { src: 7, slug: 'estrela', name: 'Estrela', style: 'Mini', box: [732, 442, 862, 618], price: 100 },
  { src: 7, slug: 'besouro-alado', name: 'Besouro alado', style: 'Neotradicional', box: [32, 712, 438, 982], sold: true },
  { src: 7, slug: 'isqueiro-love', name: 'Isqueiro "love"', style: 'Neotradicional', box: [438, 712, 612, 1038], price: 200, ex: [[438,1025,612,1040]] },
  { src: 7, slug: 'coracao-chamas', name: 'Coração em chamas', style: 'Neotradicional', box: [628, 668, 862, 1032], sold: true },
  { src: 7, slug: 'coracao-adaga', name: 'Coração e adaga', style: 'Neotradicional', box: [78, 938, 322, 1338], price: 200, ex: [[270,936,325,1000]] },
  { src: 7, slug: 'lua-aranha', name: 'Lua e aranha', style: 'Blackwork', box: [338, 1028, 622, 1342], sold: true },
  { src: 7, slug: 'morcego', name: 'Morcego', style: 'Neotradicional', box: [652, 1028, 882, 1312], sold: true },
  { src: 7, slug: 'lua-brilho', name: 'Lua e brilho', style: 'Mini', box: [38, 1338, 207, 1522], price: 150 },
  { src: 7, slug: 'coracao-que-chora', name: 'Coração que chora', style: 'Neotradicional', box: [203, 1282, 397, 1497], price: 150, ex: [[352,1430,400,1500]] },
  { src: 7, slug: 'arame-farpado', name: 'Arame farpado', style: 'Mini', box: [353, 1382, 527, 1562], price: 100 },
  { src: 7, slug: 'lua-estrelas', name: 'Lua e estrelas', style: 'Mini', box: [538, 1348, 712, 1598], price: 150 },
  { src: 7, slug: 'brilho', name: 'Brilho', style: 'Mini', box: [722, 1338, 842, 1512], price: 100 },

  // ---- cartela 2 (2 abr 2024) ----
  { src: 8, slug: 'garca', name: 'Garça', style: 'Blackwork', box: [58, 368, 652, 822], price: 350, ex: [[240, 690, 330, 830], [455, 612, 660, 830]] },
  { src: 8, slug: 'corvo', name: 'Corvo', style: 'Blackwork', box: [458, 618, 872, 932], price: 200 },
  { src: 8, slug: 'pardal-adaga', name: 'Pardal e adaga', style: 'Neotradicional', box: [58, 692, 422, 1592], price: 500, ex: [[58, 692, 240, 830]] },
  { src: 8, slug: 'pardal-galho', name: 'Pardal no galho', style: 'Neotradicional', box: [423, 892, 868, 1602], price: 400 },

  // ---- cartela 3 (26 abr 2024) ----
  { src: 9, slug: 'olho-no-coracao', name: 'Olho no coração', style: 'Neotradicional', box: [48, 378, 312, 972], price: 500 },
  { src: 9, slug: 'sol-nuvens', name: 'Sol entre nuvens', style: 'Neotradicional', box: [433, 393, 862, 812], price: 350, ex: [[433,705,500,815]] },
  { src: 9, slug: 'portal-lua', name: 'Portal da lua', style: 'Neotradicional', box: [313, 712, 582, 1272], sold: true },
  { src: 9, slug: 'mao-rosas', name: 'Mão com rosas', style: 'Neotradicional', box: [578, 832, 888, 1312], price: 500 },
  { src: 9, slug: 'sagrado-coracao', name: 'Sagrado coração', style: 'Neotradicional', box: [33, 982, 312, 1328], price: 250 },
  { src: 9, slug: 'adaga-lirios', name: 'Adaga e lírios', style: 'Neotradicional', box: [98, 1298, 762, 1568], price: 500 },

  // ---- cartela 4 (26 abr 2024) ----
  { src: 10, slug: 'mosca', name: 'Mosca', style: 'Blackwork', box: [38, 382, 338, 752], price: 200 },
  { src: 10, slug: 'raposa-kitsune', name: 'Raposa e kitsune', style: 'Neotradicional', box: [363, 348, 632, 1202], price: 450, ex: [[560,1100,640,1205],[585,980,640,1205]] },
  { src: 10, slug: 'olho-cristal', name: 'Olho de cristal', style: 'Neotradicional', box: [593, 458, 862, 848], price: 200 },
  { src: 10, slug: 'raposa-amarrada', name: 'Raposa amarrada', style: 'Neotradicional', box: [53, 778, 388, 1548], price: 450 },
  { src: 10, slug: 'mulher-peonia', name: 'Mulher e peônia', style: 'Neotradicional', box: [523, 878, 862, 1548], price: 450 },

  // ---- cartela 5 (26 abr 2024) ----
  { src: 11, slug: 'kitsune-sinos', name: 'Kitsune com sinos', style: 'Neotradicional', box: [93, 418, 447, 832], sold: true },
  { src: 11, slug: 'oni', name: 'Máscara oni', style: 'Neotradicional', box: [553, 403, 862, 787], price: 250 },
  { src: 11, slug: 'kitsune-flor', name: 'Kitsune e flor', style: 'Neotradicional', box: [73, 778, 387, 1177], sold: true },
  { src: 11, slug: 'hannya', name: 'Hannya', style: 'Neotradicional', box: [473, 758, 872, 1272], sold: true },
  { src: 11, slug: 'kitsune', name: 'Kitsune', style: 'Neotradicional', box: [113, 1168, 412, 1542], price: 150 },
  { src: 11, slug: 'oni-borla', name: 'Oni com borla', style: 'Neotradicional', box: [478, 1203, 832, 1562], price: 250, ex: [[640,1200,840,1232]] },

  // ---- cartela 6 (26 abr 2024) ----
  { src: 12, slug: 'passaro-costelas', name: 'Pássaro e costelas', style: 'Blackwork', box: [38, 393, 282, 967], price: 350, ex: [[222,800,290,975]] },
  { src: 12, slug: 'besouro', name: 'Besouro', style: 'Neotradicional', box: [298, 393, 747, 752], sold: true },
  { src: 12, slug: 'rosa-aranha', name: 'Rosa aranha', style: 'Blackwork', box: [228, 673, 472, 1137], price: 200 },
  { src: 12, slug: 'cavalo-marinho', name: 'Cavalo-marinho', style: 'Neotradicional', box: [468, 768, 692, 1152], price: 200, ex: [[600,1075,700,1155],[468,768,485,880]] },
  { src: 12, slug: 'mulher-lamina', name: 'Mulher e lâmina', style: 'Neotradicional', box: [683, 458, 882, 1182], price: 450, ex: [[683,1060,725,1185]] },
  { src: 12, slug: 'rosto-em-flor', name: 'Rosto em flor', style: 'Fine line', box: [23, 1088, 397, 1592], price: 350 },
  { src: 12, slug: 'mascara-mariposas', name: 'Máscara e mariposas', style: 'Neotradicional', box: [438, 1073, 852, 1577], price: 400, ex: [[800,1073,855,1130]] },
]
