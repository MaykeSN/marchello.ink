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

## Onde mexer

- **`src/data/site.ts`**: todo o conteúdo (nome, bio, números, contatos, lista do flash e etapas do decalque). Os itens marcados com `TODO` são placeholders.
- **`public/flash/`**: artes da galeria (WebP recortados dos stories "Disponíveis"). Pra trocar, adicione o arquivo e a entrada em `flash` no `site.ts`.
- **`public/decalque/`**: `linhas.svg` é o traço vetorizado (potrace) da tatuagem usada na seção do decalque; `cor.webp` é a versão final colorida. O SVG é usado como máscara CSS pra pintar a mesma linha de roxo (decalque) ou preto (traço).
- **`public/marchello.webp`**: retrato da seção "sobre".
- **`assets-src/`** (fora do git): originais pesados (zip de stories, fotos). Não vão pro site.
- **`src/art/FlashArt.tsx`**: ilustrações em SVG ainda usadas em detalhes (andorinhas do hero).
- **`src/styles/global.css`**: paleta (variáveis em `:root`), tipografia e layout.

## Seções e animações

1. **Preloader**: contador, gota de tinta caindo, a tinta inunda a tela e sobe como uma cortina.
2. **Hero**: nome em blackletter "sangrando" (filtro SVG de turbulência), escorridos de tinta que crescem com o scroll, faixa e andorinhas old school e um pincel de tinta seguindo o mouse.
3. **Pincelada de tinta**: um traço de pincel (canvas fixo) cuja ponta acompanha o scroll e passa por um ponto (★) em cada seção, estourando numa mancha com respingos ao chegar. Ele desce pela margem e só cruza a página na divisa entre seções.
4. **Marquee**: faixas cruzadas que aceleram e inclinam conforme a velocidade do scroll.
5. **Manifesto**: o texto vai sendo tingido palavra por palavra.
6. **Flash**: galeria horizontal fixada com as artes reais. Cada uma "brota" como mancha de tinta no papel; os cards têm moldura dupla, cantoneiras, tilt 3D e carimbo.
7. **Decalque**: com uma tatuagem real do Marchello. O papel encosta na pele, descola em 3D e deixa o decalque roxo; o traço preto é tatuado de cima pra baixo, entram sombra e cor, e a pele "cicatriza" com brilho.
8. **Sobre**: retrato revelado por máscara, títulos por letra e contadores.
9. **Contato**: título revelado por linha, botão magnético do WhatsApp e linhas que se enchem de tinta no hover.

Extras: cursor customizado com rótulos (`data-cursor="texto"`), respingo de tinta no clique e grão de papel animado. Com `prefers-reduced-motion`, o preloader e o scroll suave são desligados.

## Próximos passos

- Confirmar com o Marchello: artes ainda disponíveis, tamanhos e o número de tatuagens (TODOs em `site.ts`).
- Usar as cartelas de flash (stories com várias artes e preços) numa seção própria.
- Meta tags de compartilhamento (Open Graph) e deploy.
