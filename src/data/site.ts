// Conteúdo do site — troque os placeholders pelos dados reais do artista.
import type { ArtId } from '../art/FlashArt'

export const artist = {
  name: 'Marchello',
  brand: 'Marchello Ink',
  city: 'São Paulo — SP', // TODO: cidade real
  since: 2014, // TODO: ano real
  bio: [
    'Tatuador há mais de uma década, Marchello transforma referências do old school, do blackwork e da ilustração antiga em desenhos que só existem uma vez.',
    'Cada projeto nasce de uma conversa, vira desenho no papel e só depois encontra a pele. Sem pressa, sem cópia.',
  ],
  stats: [
    { value: 10, suffix: '+', label: 'anos de estúdio' },
    { value: 3000, suffix: '+', label: 'tatuagens feitas' },
    { value: 100, suffix: '%', label: 'desenho autoral' },
  ],
  styles: ['Blackwork', 'Fine line', 'Old school', 'Neotradicional', 'Ornamental', 'Lettering'],
}

// TODO: dados reais de contato
export const contacts = [
  { label: 'WhatsApp', value: '+55 11 90000-0000', href: 'https://wa.me/5511900000000' },
  { label: 'Instagram', value: '@marchello.ink', href: 'https://instagram.com/marchello.ink' },
  { label: 'E-mail', value: 'contato@marchello.ink', href: 'mailto:contato@marchello.ink' },
  { label: 'Estúdio', value: 'Rua Exemplo, 123 — São Paulo', href: 'https://maps.google.com/?q=Sao+Paulo' },
]

export const whatsapp = contacts[0].href

export type FlashItem = {
  art: ArtId
  name: string
  style: string
  size: string
  available: boolean
}

// Artes do flash. Hoje são SVGs desenhados no código (placeholders animáveis);
// dá pra trocar por fotos reais depois.
export const flash: FlashItem[] = [
  { art: 'rose', name: 'Rosa', style: 'Old school', size: '12 cm', available: true },
  { art: 'dagger', name: 'Adaga', style: 'Tradicional', size: '15 cm', available: true },
  { art: 'swallow', name: 'Andorinha', style: 'Old school', size: '10 cm', available: false },
  { art: 'skull', name: 'Memento', style: 'Blackwork', size: '14 cm', available: true },
  { art: 'snake', name: 'Serpente', style: 'Neotradicional', size: '18 cm', available: true },
  { art: 'moth', name: 'Mariposa', style: 'Blackwork', size: '12 cm', available: false },
  { art: 'eye', name: 'Olho', style: 'Fine line', size: '9 cm', available: true },
]

export const steps = [
  { title: 'Desenho', text: 'Criado à mão a partir da sua ideia e ajustado ao seu corpo.' },
  { title: 'Decalque', text: 'O papel hectográfico transfere o desenho em roxo pra pele.' },
  { title: 'Traço', text: 'Linha por linha, a tinta preta toma o lugar do decalque.' },
  { title: 'Pele nova', text: 'Cicatrizou, virou parte de você. Pra vida toda.' },
]
