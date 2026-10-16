import type { ReactNode } from 'react'

/** Ponto por onde a pincelada passa. Acende (`.is-inked`) quando a tinta chega. */
export function InkStop({ side, top }: { side: 'left' | 'right'; top: string }) {
  return (
    <span className={`ink-stop is-${side}`} style={{ top }} aria-hidden="true">
      <i>★</i>
    </span>
  )
}

/** Faixa (banner) old school com texto em letreiro. */
export function Ribbon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`ribbon ${className}`}>
      <span>{children}</span>
    </span>
  )
}
