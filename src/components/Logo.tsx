import { useId } from "react"

type LogoProps = {
  size?: number
  showText?: boolean
  className?: string
  dark?: boolean
}

export function Logo({ size = 56, showText = true, className, dark = false }: LogoProps) {
  const gid = useId().replace(/:/g, "")
  const goldId = `seal-gold-${gid}`
  const topId = `seal-top-${gid}`
  const bottomId = `seal-bottom-${gid}`

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
          <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5dfa0" />
            <stop offset="45%" stopColor="#e6c766" />
            <stop offset="100%" stopColor="#c9a84c" />
          </linearGradient>
        </defs>

        {/* outer ring */}
        <circle cx="50" cy="50" r="47" stroke={`url(#${goldId})`} strokeWidth="1.5" />
        {/* inner ring */}
        <circle cx="50" cy="50" r="40" stroke={`url(#${goldId})`} strokeWidth="0.8" opacity="0.6" />

        {/* circular text */}
        <path id={topId} d="M 19 50 A 31 31 0 0 1 81 50" fill="none" />
        <path id={bottomId} d="M 81 50 A 31 31 0 0 1 19 50" fill="none" />
        <text fill={`url(#${goldId})`} fontFamily="Georgia, serif" fontSize="7" letterSpacing="3" opacity="0.85">
          <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">РУССКИЙ</textPath>
        </text>
        <text fill={`url(#${goldId})`} fontFamily="Georgia, serif" fontSize="7" letterSpacing="3" opacity="0.85">
          <textPath href={`#${bottomId}`} startOffset="50%" textAnchor="middle">СТОЛ</textPath>
        </text>

        {/* small stars */}
        <text x="13.5" y="53" fill={`url(#${goldId})`} fontSize="6" opacity="0.7">✦</text>
        <text x="80.5" y="53" fill={`url(#${goldId})`} fontSize="6" opacity="0.7">✦</text>

        {/* interlaced РС monogram */}
        <text
          x="34" y="64"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="42" fontWeight="700"
          fill={`url(#${goldId})`}
          fontStyle="italic"
        >Р</text>
        <text
          x="49" y="64"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="42" fontWeight="700"
          fill={`url(#${goldId})`}
          fontStyle="italic"
          opacity="0.92"
        >С</text>
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
