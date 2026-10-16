// Conteúdo do site — troque os placeholders pelos dados reais do artista.

export const artist = {
  name: 'Marchello',
  brand: 'Marchello Ink',
  city: 'Extrema — MG',
  since: 2020,
  bio: [
    'Tatuador desde 2020, Marchello faz de tudo, mas é no neotradicional que o traço dele fala mais alto: contornos firmes, sombras profundas e cor só onde ela importa.',
    'Cada projeto nasce de uma conversa, vira desenho no papel e só depois encontra a pele. Sem pressa, sem cópia.',
  ],
  stats: [
    { value: new Date().getFullYear() - 2020, suffix: '', label: 'anos de tatuagem' },
    { value: 1000, suffix: '+', label: 'tatuagens feitas' }, // TODO: número real
    { value: 100, suffix: '%', label: 'desenho autoral' },
  ],
  styles: ['Neotradicional', 'Blackwork', 'Realismo', 'Fine line', 'Ornamental', 'Old school'],
}

export const contacts = [
  { label: 'WhatsApp', value: '+55 35 9 9870-7678', href: 'https://wa.me/message/3NZF3LEKAGYCP1' },
  { label: 'Instagram', value: '@marchello.ink', href: 'https://instagram.com/marchello.ink' },
  {
    label: 'Estúdio',
    value: 'Praça Presidente Vargas, 40 — Centro, Extrema/MG · CEP 37640-076',
    href: 'https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+Presidente+Vargas%2C+40%2C+Centro%2C+Extrema+-+MG%2C+37640-076',
  },
]

export const whatsapp = contacts[0].href

// Número no formato do wa.me, pra abrir a conversa já com a arte escolhida
const WA_NUMBER = '5535998707678'
export const whatsappAbout = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`


export const steps = [
  { title: 'Desenho', text: 'Criado à mão a partir da sua ideia e ajustado ao seu corpo.' },
  { title: 'Decalque', text: 'O papel hectográfico transfere o desenho em roxo pra pele.' },
  { title: 'Traço', text: 'Linha por linha, a tinta preta toma o lugar do decalque.' },
  { title: 'Cor e sombra', text: 'Sombra e cor fecham o neotradicional. Cicatrizou, é seu pra sempre.' },
]
