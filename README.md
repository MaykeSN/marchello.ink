# Marchello Ink

Landing page do tatuador Marchello (neotradicional, Extrema/MG): só front-end, com bastante animação.

Direção atual: visual **flash old school** com toques neotradicionais, paleta **oxblood e osso**, tema **do papel à pele** e uma **pincelada de tinta** que acompanha o scroll.

## Stack

| Peça | Para quê |
| --- | --- |
| **Vite + React + TypeScript** | Build rápido, componentes, tipagem |
| **GSAP 3** (ScrollTrigger, DrawSVG, SplitText) | Todas as animações. Os plugins premium são gratuitos desde a 3.13 |
| **Lenis** | Scroll suave, sincronizado com o ScrollTrigger |
| SVG + Canvas | Artes "tatuadas" traço a traço, filtros de tinta, pincel no mouse |

O build final é estático (`dist/`), então dá pra hospedar em Vercel, Netlify, GitHub Pages etc.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Deploy

O site publica sozinho no GitHub Pages a cada push na `main` (workflow em `.github/workflows/deploy.yml`): **https://maykesn.github.io/marchello.ink/**

- Em **Settings → Pages**, o Source precisa estar em **GitHub Actions**. Em "Deploy from a branch" o GitHub publica o código-fonte cru e a página fica em branco.
- Pra publicar de novo sem commit: **Actions → Deploy no GitHub Pages → Run workflow**.
- O prefixo `/marchello.ink/` vem do Pages via `BASE_PATH`. Com domínio próprio ele vira `/` sozinho.

## Onde mexer

- **`src/data/site.ts`**: todo o conteúdo (nome, bio, números, contatos, lista do flash e etapas do decalque). Os itens marcados com `TODO` são placeholders.
- **`src/data/flash.ts`**: catálogo das artes disponíveis (gerado, não edite à mão). Veja "Artes do flash" abaixo.
- **`public/decalque/`**: `linhas.svg` é o traço vetorizado (potrace) da tatuagem usada na seção do decalque; `cor.webp` é a versão final colorida. O SVG é usado como máscara CSS pra pintar a mesma linha de roxo (decalque) ou preto (traço).
- **`src/data/works.ts`**: tatuagens prontas e fotos do artista (gerado por `npm run drive`). Veja "Fotos do Drive" abaixo.
- **`assets-src/`** (fora do git): originais pesados (zip, prints dos stories, fotos) e as artes já tatuadas. Não vão pro site.
- **`src/art/FlashArt.tsx`**: ilustrações em SVG ainda usadas em detalhes (andorinhas do hero).
- **`src/styles/global.css`**: paleta (variáveis em `:root`), tipografia e layout.
- **`public/escolhas/`**: página "Monte o seu site", em que o cliente escolhe paleta, fontes, animações, estrutura e textos (com o atual marcado e no mínimo 5 opções por item) e gera um código com as escolhas. Publicada em `/escolhas/`. Cada opção tem um `spec` em `escolhas.js` com a descrição técnica que vai no código, e o link no fim do código reabre as escolhas na página. Em dev, abra `/escolhas/index.html`, porque em `/escolhas/` o Vite serve a SPA.

## Seções e animações

1. **Preloader**: contador, gota de tinta caindo, a tinta inunda a tela e sobe como uma cortina.
2. **Hero**: nome em blackletter "sangrando" (filtro SVG de turbulência), escorridos de tinta que crescem com o scroll, faixa e andorinhas old school e um pincel de tinta seguindo o mouse.
3. **Pincelada de tinta**: um traço de pincel (canvas fixo) cuja ponta acompanha o scroll e passa por um ponto (★) em cada seção, estourando numa mancha com respingos ao chegar. Ele desce pela margem e só cruza a página na divisa entre seções.
4. **Marquee**: faixas cruzadas que aceleram e inclinam conforme a velocidade do scroll.
5. **Manifesto**: o texto vai sendo tingido palavra por palavra.
6. **Flash (destaques)**: galeria horizontal fixada com as 14 artes de nota mais alta. Cada uma "brota" como mancha de tinta no papel; os cards têm moldura dupla, cantoneiras e tilt 3D.
7. **Cartela completa**: as 47 artes disponíveis em grade, com filtro por estilo (Neotradicional, Blackwork, Fine line & realismo, Minis) que reorganiza a grade com Flip.
8. **Visualizador**: clicar numa arte faz ela "voar" até a tela cheia (Flip), com setas/teclado pra navegar e o botão "Quero essa", que abre o WhatsApp com o nome e o número da arte.
9. **Decalque**: com uma tatuagem real do Marchello. O papel encosta na pele, descola em 3D e deixa o decalque roxo; o traço preto é tatuado de cima pra baixo, entram sombra e cor, e a pele "cicatriza" com brilho.
10. **Trabalhos ("Na pele")**: foto do estúdio com parallax e um mosaico com as tatuagens prontas, filtro por estilo e o mesmo visualizador, com "Quero algo assim" no WhatsApp.
11. **Sobre**: retrato profissional revelado por máscara, uma segunda foto flutuando em parallax, títulos por letra e contadores.
12. **Contato**: título revelado por linha, botão magnético do WhatsApp e linhas que se enchem de tinta no hover.

Extras: cursor customizado com rótulos (`data-cursor="texto"`), respingo de tinta no clique e grão de papel animado. Com `prefers-reduced-motion`, o preloader e o scroll suave são desligados.

## Artes do flash

As artes vêm dos prints dos stories "Disponíveis" do Instagram. O pipeline em `tools/flash/` limpa e recorta cada uma:

1. Coloque os prints em `assets-src/stories/` (fora do git).
2. Em `tools/flash/pieces.cjs`, cada peça tem a caixa onde está no print (escala 900x2000), o nome, o estilo e áreas a apagar (marca d'água, textos, pedaços de vizinhas). `sold: true` marca as já tatuadas.
3. Em `tools/flash/grades.cjs` fica a nota de curadoria (0–10). Nota 8,5 ou mais vira destaque.
4. `npm run flash` processa tudo: estima e remove o fundo (fumaça, sombra do braço), apaga preços e X vermelhos, recorta justo, exporta `public/flash/<slug>.webp` (grande) e `<slug>-sm.webp` (cartela) e regenera `src/data/flash.ts`.

Pra processar só algumas: `node tools/flash/process.cjs gueixa medusa && node tools/flash/gen-data.cjs`.

## Fotos do Drive

As fotos vêm da pasta pública do Google Drive do Marchello ("Marchello Trabalhos"). Pra atualizar:

```bash
npm run drive
```

1. `tools/drive/sync.mjs` lista as pastas (sem login), baixa só o que é novo pra `assets-src/drive/` (fora do git) e ignora arquivos repetidos. Vídeos só com `node tools/drive/sync.mjs --videos`.
2. `tools/drive/process.mjs` gera `public/trabalhos/` e `public/fotos/` em WebP (grande e miniatura, sem EXIF nem GPS) e regenera `src/data/works.ts`.
3. Títulos, tags, ordem e o que fica de fora estão em `tools/drive/curation.mjs`, pelo ID do arquivo no Drive. Foto nova sem curadoria entra com título genérico e o script avisa no final.

Os PNG da pasta **Disponiveis** alimentam o flash: em `tools/flash/pieces.cjs`, uma peça com `file: 'disponiveis/<id>.png'` usa o original do Drive no lugar do print do story. Depois de `npm run drive`, rode `npm run flash`.

## Próximos passos

- Confirmar com o Marchello: quais artes ainda estão disponíveis (os stories são de 2024 e 2025), tamanhos e se os preços podem aparecer no site.
- Pedir as artes originais (sem marca d'água) da gueixa, valquíria e encapuzada, que têm a marca @marchello.ink sobre o desenho.
- Usar os vídeos do Drive (criação no iPad e tatuagens prontas) como loops curtos. Precisa do ffmpeg.
- Meta tags de compartilhamento (Open Graph) e deploy.
