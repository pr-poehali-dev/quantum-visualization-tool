import { useId } from "react"

type LogoProps = {
  size?: number
  className?: string
  dark?: boolean
}

export function Logo({ size = 64, className, dark = false }: LogoProps) {
  const gid = useId().replace(/:/g, "")
  const inkId = `seal-ink-${gid}`
  const roughId = `seal-rough-${gid}`
  const topId = `seal-top-${gid}`
  const bottomId = `seal-bottom-${gid}`

  const ink = dark ? "#8a651c" : "#e6c766"

  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={dark ? "#9c7322" : "#f0d488"} />
            <stop offset="55%" stopColor={ink} />
            <stop offset="100%" stopColor={dark ? "#5e4416" : "#a8842f"} />
          </linearGradient>
          {/* subtle worn-stamp texture — kept light so it stays crisp */}
          <filter id={roughId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" />
          </filter>
        </defs>

        <g filter={`url(#${roughId})`} stroke={`url(#${inkId})`} fill={`url(#${inkId})`}>
          {/* aged rings */}
          <circle cx="50" cy="50" r="47" strokeWidth="3.4" fill="none" />
          <circle cx="50" cy="50" r="42.5" strokeWidth="1.4" fill="none" opacity="0.85" />
          <circle cx="50" cy="50" r="33" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* circular legend */}
          <path id={topId} d="M 22 50 A 28 28 0 0 1 78 50" fill="none" stroke="none" />
          <path id={bottomId} d="M 78 50 A 28 28 0 0 1 22 50" fill="none" stroke="none" />
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" letterSpacing="3" stroke="none" fontWeight="600">
            <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">★ РУССКИЙ ★</textPath>
          </text>
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" letterSpacing="3" stroke="none" fontWeight="600">
            <textPath href={`#${bottomId}`} startOffset="50%" textAnchor="middle">МЕБЕЛЬ ИЗ ДУБА</textPath>
          </text>

          {/* Р и С — крупные, раздельные буквы-печать */}
          <text
            x="50" y="61"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="34" fontWeight="700"
            stroke="none"
            letterSpacing="2"
          >РС</text>
        </g>
      </svg>
    </div>
  )
}

export default Logo