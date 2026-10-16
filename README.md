# Marchello Ink

Landing page do tatuador Marchello: só front-end, com bastante animação.

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
- **`src/art/FlashArt.tsx`**: as artes em SVG. Classes: `.ln` = traço (animado com DrawSVG), `.fl` = preenchimento preto, `.ac` = vermelho, `.pf` = cor do papel.
- **`src/styles/global.css`**: paleta (variáveis em `:root`), tipografia e layout.

## Seções e animações

1. **Preloader**: contador, gota de tinta caindo, a tinta inunda a tela e sobe como uma cortina.
2. **Hero**: nome em blackletter "sangrando" (filtro SVG de turbulência), escorridos de tinta que crescem com o scroll, rosa sendo tatuada e um pincel de tinta seguindo o mouse.
3. **Fio de tinta**: uma linha vermelha que é "tatuada" ao longo da página toda, com a ponta da agulha na frente.
4. **Marquee**: faixas cruzadas que aceleram e inclinam conforme a velocidade do scroll.
5. **Manifesto**: o texto vai sendo tingido palavra por palavra.
6. **Flash**: galeria horizontal fixada. Cada arte é desenhada ao entrar na tela, e os cards têm tilt 3D e carimbo.
7. **Decalque**: o papel encosta na pele, descola em 3D e deixa o decalque roxo. A tinta preta cobre o roxo, a pele avermelha e depois "cicatriza" com brilho.
8. **Sobre**: retrato revelado por máscara, títulos por letra e contadores.
9. **Contato**: título revelado por linha, botão magnético do WhatsApp e linhas que se enchem de tinta no hover.

Extras: cursor customizado com rótulos (`data-cursor="texto"`), respingo de tinta no clique e grão de papel animado. Com `prefers-reduced-motion`, o preloader e o scroll suave são desligados.

## Próximos passos

- Trocar os placeholders de `site.ts` pelos dados reais.
- Fotos reais: retrato em `About.tsx` e, se quiser, fotos de tatuagens no flash (hoje são SVGs).
- Meta tags de compartilhamento (Open Graph) e deploy.
