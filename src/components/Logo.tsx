import { useId } from "react"

type LogoProps = {
  size?: number
  showText?: boolean
  className?: string
  dark?: boolean
}

export function Logo({ size = 56, showText = true, className, dark = false }: LogoProps) {
  const gid = useId().replace(/:/g, "")
  const inkId = `seal-ink-${gid}`
  const roughId = `seal-rough-${gid}`
  const topId = `seal-top-${gid}`
  const bottomId = `seal-bottom-${gid}`

  const ink = dark ? "#7a5a1f" : "#cda64f"

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
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
          {/* rough worn-stamp texture */}
          <filter id={roughId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
          </filter>
        </defs>

        <g filter={`url(#${roughId})`} stroke={`url(#${inkId})`} fill={`url(#${inkId})`}>
          {/* double aged ring */}
          <circle cx="50" cy="50" r="47" strokeWidth="2.4" fill="none" />
          <circle cx="50" cy="50" r="42.5" strokeWidth="1" fill="none" opacity="0.7" />
          <circle cx="50" cy="50" r="33" strokeWidth="1.2" fill="none" opacity="0.55" />

          {/* circular legend */}
          <path id={topId} d="M 22 50 A 28 28 0 0 1 78 50" fill="none" stroke="none" />
          <path id={bottomId} d="M 78 50 A 28 28 0 0 1 22 50" fill="none" stroke="none" />
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" letterSpacing="3.5" stroke="none" fontWeight="600">
            <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">★ РУССКИЙ ★</textPath>
          </text>
          <text fontFamily="Georgia, 'Times New Roman', serif" fontSize="6.5" letterSpacing="3.5" stroke="none" fontWeight="600">
            <textPath href={`#${bottomId}`} startOffset="50%" textAnchor="middle">МЕБЕЛЬ ИЗ ДУБА</textPath>
          </text>

          {/* ── РС monogram sharing a common central stem ── */}
          <g stroke="none" fillRule="evenodd">
            {/* shared central vertical stem */}
            <rect x="48" y="36" width="4.5" height="30" />
            {/* Р — bowl on the left top, hanging off the stem */}
            <path
              d="M 48 36 L 36 36 A 8.5 8.5 0 0 1 36 53 L 48 53 L 48 48.5 L 37.5 48.5 A 4 4 0 0 0 37.5 40.5 L 48 40.5 Z"
            />
            {/* С — open arc on the right, embracing the stem */}
            <path
              d="M 64 40 A 13 13 0 1 0 64 62 L 60.5 58 A 8.5 8.5 0 1 1 60.5 44 Z"
            />
          </g>

          {/* tiny flank ornaments */}
          <text x="13" y="53" fontSize="7" stroke="none">❦</text>
          <text x="81" y="53" fontSize="7" stroke="none">❦</text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="text-lg font-medium tracking-tight"
            style={{ color: dark ? "#a8842f" : "#e6c766", fontFamily: "Rubik, sans-serif" }}
          >
            Русский Стол
          </span>
          <span className={`text-[10px] tracking-[0.25em] uppercase mt-1 ${dark ? "text-foreground/50" : "text-white/50"}`}>
            Мебель из дуба
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
