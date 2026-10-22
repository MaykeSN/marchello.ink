// Curadoria das fotos do Drive, por ID do arquivo no Drive.
// Arquivo novo no Drive que não estiver aqui entra com título genérico e tag pela pasta (e o process avisa).
//
// tags:  neo · rostos · anime · floral · grandes · cor
// score: ordem na seção Trabalhos (maior primeiro); >= 9 ganha destaque (card maior)
// trim:  corta tarjas pretas (prints de galeria)
// skip:  fica fora do site (motivo ao lado)

export const works = {
  // ---- Tatuagens ----
  '1GOL6k2KGHdRGWwhLw0QyVkIWNXB5q32V': { slug: 'costas-mulher-magnolias', title: 'Costas: mulher e magnólias', tags: ['grandes', 'rostos', 'neo'], score: 10 },
  '1AosLM4agupt9PaQeo1TIF2-o2JbxxUKI': { slug: 'costas-dragao', title: 'Costas: dragão e samurai', tags: ['grandes', 'neo', 'cor'], score: 10 },
  '1q-SpnuZoBP_GZy-69k1assi_dBqnRqMT': { slug: 'luffy', title: 'Luffy', tags: ['anime', 'grandes'], score: 9.5 },
  '1GYBk2D9Lzf7KRu2rdvyYJFqSJBAiaqYr': { slug: 'dragao-vermelho', title: 'Dragão oriental', tags: ['neo', 'cor'], score: 9.5 },
  '14dmheUvybtAuJ0pRbGDpni2dRSjtZQsW': { slug: 'sanji', title: 'Sanji', tags: ['anime', 'cor'], score: 9 },
  '1jOjdTFxy02Cf5LAwvEBf6YeSGN57WcTr': { slug: 'serpente', title: 'Serpente', tags: ['grandes', 'neo'], score: 9 },
  '1vUhtsXR8_kh8k-VR_sDhVe5MxqgZj0Dw': { slug: 'costas-florais', title: 'Costas florais', tags: ['grandes', 'floral'], score: 9 },
  '1fSBJ2MkcYOTfA7yuyjS9_ls-ZoeHLxsU': { slug: 'garca', title: 'Garça', tags: ['neo', 'grandes'], score: 8.5 },
  '17WdcHuFhwmpq5E3mzPEU5gtSjrG78kMN': { slug: 'amaterasu', title: 'Amaterasu (Ōkami)', tags: ['anime', 'cor'], score: 8.5 },
  '1r79M5xi5axk1KhPabJ9MXobhq4NhY4tL': { slug: 'vegeta', title: 'Vegeta', tags: ['anime'], score: 8.5 },
  '17bW6EPI9qg9tGbugMqPqLwMpbodKMHpJ': { slug: 'dragao-lua', title: 'Dragão e lua', tags: ['neo'], score: 8.5 },
  '1Jo8t8RLg-J_8ImB9MF7vElhaWrREIW8k': { slug: 'peonia-serpente', title: 'Peônia e serpente', tags: ['floral', 'neo'], score: 8.5 },
  '13TBNaoKMhDD_zxTNsdWu6Lenk12oVHUW': { slug: 'feraligatr', title: 'Feraligatr (Pokémon)', tags: ['anime', 'cor'], score: 8 },
  '10BJ4cHE1S6tgyQxYnGp0Qg7w46kOBn5H': { slug: 'raposa-torii', title: 'Raposa e torii', tags: ['neo', 'cor'], score: 8 },
  '1qsnTa_KQ3S02ApO6hWlwrXBqmJs6go_2': { slug: 'cavaleiro', title: 'Cavaleiro', tags: ['rostos'], score: 8 },
  '11SvvgULeVQBguRv1q5i2ifzqbgmaxnkb': { slug: 'dragao-blackwork', title: 'Dragão', tags: ['neo'], score: 7.5 },
  '11TdoRqEnX3KUPtSCPiS4Suk07MhUyS7E': { slug: 'rosa', title: 'Rosa', tags: ['floral'], score: 7.5 },
  '1D5SeNTp3NLTIgpzGqsvCihEdPGE9nssw': { slug: 'peonias', title: 'Peônias', tags: ['floral'], score: 7.5 },
  '1CWKE3PmXbSH7qio5De5oLyTwgT0uXARm': { slug: 'floral', title: 'Floral', tags: ['floral'], score: 7.5 },
  '1cDPaVCQgiULSKudIFE3PS4TWWsfq3BmR': { slug: 'centopeia', title: 'Centopeia', tags: ['neo'], score: 7 },
  '11iZ4XJk3wk9Od5InqUrYrTgXCATbhZxQ': { skip: 'mesma foto do Pássaro e magnólias (pasta Flashs)' },
  '17gDslDtvcdQlvK85EgNZFMJF6NY2EFuJ': { skip: 'mesma foto do Lobo e cogumelo (pasta Flashs)' },
  '1EllP25S83awswoZzjUAGXt0YZ0lDu6wP': { skip: 'print do Instagram com a interface aparecendo' },

  // ---- Tatuagens/Rostos ----
  '1ZZXZzghRfnOS-A8Q2aLr0ATb8G5A0GzM': { slug: 'medusa-braco', title: 'Medusa', tags: ['rostos', 'neo'], score: 9.5 },
  '1XRllv4DrKseQ6dXKONqcaZ7BZOxcWcUR': { slug: 'rosto-relogio', title: 'Rosto e relógio', tags: ['rostos'], score: 9 },
  '116l7wjIHjaYqFJofjWsRVbj2NNi0Pq-w': { slug: 'mulher-loba', title: 'Mulher loba', tags: ['rostos', 'neo'], score: 9 },
  '1LffXK9_XDD3Gfy9zniq0F2aQ33r4whGE': { slug: 'samurai-vermelho', title: 'Samurai em vermelho', tags: ['neo', 'cor'], score: 9 },
  '1pKUmFwHfgycqFBZmnP5fbylf0uk3SFKx': { slug: 'braco-fechado', title: 'Braço fechado', tags: ['grandes', 'rostos', 'anime'], score: 8.5 },
  '1vIwvJTnytcLLTBcWOab9kua1mmmGJNlo': { slug: 'rosto-lamina', title: 'Rosto e lâmina', tags: ['rostos', 'floral'], score: 7.5 },
  '1LMFEyrmhyqZ9JnCQJZ3Ucs75uJWHoKAf': { skip: 'mesma tatuagem do Rosto e relógio, com outro corte' },

  // ---- Flashs (desenhos do flash já tatuados) ----
  '1Pzw4qzY_puW71CUP9Flv_fcUSRfIPMbN': { slug: 'passaro-magnolias', title: 'Pássaro e magnólias', tags: ['neo', 'cor'], score: 9.5 },
  '1U7NbZmyMD_kD1XK2XOu1GeG_EujcXIZZ': { slug: 'adaga-rosas', title: 'Adaga e rosas', tags: ['neo', 'cor'], score: 8 },
  '13-3_dXfJrRXdcLQjxOx70ensLiHZlizQ': { slug: 'lobo-cogumelo', title: 'Lobo e cogumelo', tags: ['neo'], score: 8 },
  '1GEiey0H3gASXNpNFMq64Eb2MkdJRUwt4': { slug: 'oni-chamas', title: 'Oni em chamas', tags: ['neo'], score: 8 },
  '1jjISSWsQGzodP_Kp_36mLCBVR5oIQZkx': { slug: 'rosto-flor', title: 'Rosto e flor', tags: ['floral', 'rostos'], score: 7.5 },
  '11UgBixuUdd_GoI__pgKQwyQ0QI8mgDsG': { slug: 'lirios-sol', title: 'Lírios e sol', tags: ['floral'], score: 7.5 },
  '1RYbPcdI9EAQqMcb2vcpdcNWnG6kon9r-': { slug: 'besouro', title: 'Besouro', tags: ['neo', 'cor'], score: 7.5 },
  '1M3vcNv7sh_goPMiv7Pkw_ZVbZmisP_vK': { slug: 'aranha', title: 'Aranha', tags: ['neo', 'cor'], score: 7.5, trim: true },
  '11Ww-RqV3QU9QnPpsZaPnMXEXrazukOfd': { slug: 'gatos-flores', title: 'Gatos e flores', tags: ['floral'], score: 7 },
  '1vSP8f2z1ZceZx1Xdgy1EMEN-e714Tv88': { slug: 'flores-mao', title: 'Flores na mão', tags: ['floral'], score: 7 },
  '1mitmplBrpmjVJwyBPfWSm6XrLCvMLXkD': { slug: 'libelula', title: 'Libélula', tags: ['neo', 'cor'], score: 7, trim: true },
  '1vBWtlbC48G6M2XITMlauiBj42tsc6ls0': { slug: 'escorpiao-aranha', title: 'Escorpião e aranha', tags: ['neo', 'cor'], score: 7, trim: true },
}

// Fotos profissionais (raiz do Drive)
export const photos = {
  '17hmMUe8TTT8UkqWmCihvQmrRh0EHjB2S': { slug: 'retrato', alt: 'Marchello de máscara e óculos, concentrado enquanto tatua' },
  '11nR7ebioaqX_9oFYPKLp_E9cApi2Kzm6': { slug: 'maos', alt: 'Mãos de luva preta tatuando sob a luz do ring light' },
  '11dL_sRi3jGa4B5Qvc6t8SPv1nG1q-Lhw': { slug: 'estudio', alt: 'Marchello tatuando no estúdio, com quadros de flash na parede' },
  '11oDvak5iSjFRv-jSJedKnqdYhc92H3l3': { slug: 'olhar', alt: 'Close do olhar do Marchello por trás dos óculos durante uma sessão' },
  '11uBiubx3t8aHP7tzPWgszxGNtt2mobnq': { skip: 'parecida com a do estúdio e em resolução menor' },
}

// Pasta padrão -> tags, pra arquivos novos ainda sem curadoria
export const defaultTags = { 'Tatuagens/Rostos': ['rostos'], Flashs: ['neo'], Tatuagens: [] }
