/** Filtros SVG globais que dão a textura de tinta (bordas orgânicas, sangramento). */
export function InkDefs() {
  return (
    <svg className="ink-defs" width="0" height="0" aria-hidden="true">
      <defs>
        <filter id="ink-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-bleed" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="2" seed="9" result="noise" />
          <feDisplacementMap id="bleed-disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
