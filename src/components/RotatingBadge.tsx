import { useId, type ReactNode } from 'react'

type Props = { text: string; className?: string; children?: ReactNode }

/** Selo circular com texto girando (via CSS). */
export function RotatingBadge({ text, className = '', children }: Props) {
  const id = useId()
  return (
    <div className={`badge ${className}`}>
      <svg viewBox="0 0 200 200" className="badge-ring" aria-hidden="true">
        <defs>
          <path id={id} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="488">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="badge-center">{children}</div>
    </div>
  )
}
