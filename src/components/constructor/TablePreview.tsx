import { shade } from "./constructorData"

export function TablePreview({
  coatingColor,
  coatingLabel,
  legColor,
  adjustable,
  length,
  width,
}: {
  coatingColor: string
  coatingLabel: string
  legColor: string
  adjustable: boolean
  length: number
  width: number
}) {
  // изометрический вид с угла
  const halfW = 45 + ((length - 100) / 80) * 55   // половина длины по оси X
  const depth = 22 + ((width - 60) / 20) * 16      // глубина по оси проекции
  const cx = 120
  const topY = 58                                   // вершина ближнего угла столешницы
  const th = 9                                       // толщина торца столешницы
  const dx = depth * 0.9
  const dy = depth * 0.5

  // 4 угла верхней грани столешницы (ромб)
  const front = { x: cx, y: topY + dy }             // ближний нижний угол
  const right = { x: cx + halfW, y: topY + dy - dy } // правый
  const back = { x: cx, y: topY - dy }              // дальний верхний
  const left = { x: cx - halfW, y: topY + dy - dy }  // левый

  const topPath = `M${front.x},${front.y} L${right.x},${right.y} L${back.x},${back.y} L${left.x},${left.y} Z`
  const frontFace = `M${left.x},${left.y} L${front.x},${front.y} L${front.x},${front.y + th} L${left.x},${left.y + th} Z`
  const rightFace = `M${front.x},${front.y} L${right.x},${right.y} L${right.x},${right.y + th} L${front.x},${front.y + th} Z`

  const legLen = 66
  const legY = topY + dy + th
  const legPositions = [
    { x: left.x + 8, y: left.y + th - 2 },
    { x: front.x, y: front.y + th - 2 },
    { x: right.x - 8, y: right.y + th - 2 },
  ]

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/10 mb-2"
      style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(25 18% 15%) 0%, hsl(25 20% 8%) 100%)" }}
    >
      <p className="absolute top-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/30 z-10">Предпросмотр</p>
      <svg viewBox="0 0 240 190" className="w-full h-auto block">
        {/* тень на полу */}
        <ellipse cx={cx} cy={legY + legLen + 4} rx={halfW * 0.9} ry="9" fill="rgba(0,0,0,0.45)" />

        {/* ножки */}
        {legPositions.map((p, i) => (
          <g key={i} style={{ transition: "all 0.4s ease" }}>
            <rect x={p.x - 3} y={p.y} width="6" height={legLen} rx="1.5" fill={legColor} />
            <rect x={p.x - 3} y={p.y} width="2.2" height={legLen} rx="1" fill={shade(legColor, 0.15)} opacity="0.8" />
            {adjustable && (
              <rect x={p.x - 4.5} y={p.y + legLen * 0.38} width="9" height="11" rx="1.5"
                fill={shade(legColor, legColor === "#e6e6e6" ? -0.14 : 0.22)} />
            )}
            <rect x={p.x - 6} y={p.y + legLen} width="12" height="3.5" rx="1.5" fill={shade(legColor, -0.12)} />
          </g>
        ))}

        {/* торцы столешницы (толщина) */}
        <g style={{ transition: "all 0.4s ease" }}>
          <path d={frontFace} fill={shade(coatingColor, -0.16)} />
          <path d={rightFace} fill={shade(coatingColor, -0.28)} />
        </g>

        {/* верхняя грань */}
        <g style={{ transition: "all 0.4s ease" }}>
          <path d={topPath} fill={coatingColor} />
          <path d={topPath} fill="url(#woodGrainIso)" opacity="0.4" />
          <path d={topPath} fill="none" stroke={shade(coatingColor, 0.18)} strokeWidth="0.8" opacity="0.6" />
        </g>

        <defs>
          <linearGradient id="woodGrainIso" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="40%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
          </linearGradient>
        </defs>
      </svg>

      {/* подпись */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1 gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-white/55 truncate">
          <span className="w-3 h-3 rounded-full border border-white/40 shrink-0" style={{ background: coatingColor }} />
          <span className="truncate">{coatingLabel}</span>
        </span>
        <span className="text-[11px] font-medium tabular-nums shrink-0" style={{ color: "var(--gold)" }}>
          {length} × {width} см
        </span>
      </div>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-4" style={{ color: "var(--gold)" }}>
      {children}
    </p>
  )
}
