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
  // ── настоящий изометрический вид с угла ──
  // Из ближнего угла (front) идут два вектора НАИСКОСОК:
  //   vLen — вправо-вверх  (сторона ДЛИНЫ)
  //   vWid — влево-вверх   (сторона ШИРИНЫ)
  const lenMag = 58 + ((length - 100) / 80) * 62   // длина вектора длины
  const widMag = 40 + ((width - 60) / 20) * 34      // длина вектора ширины
  const ISO = 0.5                                    // наклон изометрии (y = x * ISO)

  const th = 9                                        // толщина торца столешницы
  const cx = 118
  const front = { x: cx, y: 118 }                    // ближний нижний угол столешницы

  // векторы наискосок
  const vLen = { x: lenMag, y: -lenMag * ISO }        // вправо-вверх
  const vWid = { x: -widMag, y: -widMag * ISO }       // влево-вверх

  const add = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: a.x + b.x, y: a.y + b.y })

  // 4 угла верхней грани столешницы
  const right = add(front, vLen)                     // конец ДЛИНЫ (правый угол)
  const left = add(front, vWid)                      // конец ШИРИНЫ (левый угол)
  const back = add(add(front, vLen), vWid)           // дальний угол

  const topPath = `M${front.x},${front.y} L${right.x},${right.y} L${back.x},${back.y} L${left.x},${left.y} Z`
  // передние торцы (толщина) — два ближних ребра
  const rightFace = `M${front.x},${front.y} L${right.x},${right.y} L${right.x},${right.y + th} L${front.x},${front.y + th} Z`
  const leftFace = `M${front.x},${front.y} L${left.x},${left.y} L${left.x},${left.y + th} L${front.x},${front.y + th} Z`

  const legLen = 62
  const dark = shade(legColor, legColor === "#e6e6e6" ? -0.18 : 0.14)
  const light = shade(legColor, 0.2)

  // точка вдоль ребра a→b на доле t
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  })

  // низ торца столешницы
  const bFront = { x: front.x, y: front.y + th }
  const bRight = { x: right.x, y: right.y + th }
  const bLeft = { x: left.x, y: left.y + th }
  const bBack = { x: back.x, y: back.y + th }

  // 4 опоры чуть внутри углов столешницы (в изометрии)
  const inset = 0.16
  const corner = (c: { x: number; y: number }, toward: { x: number; y: number }) => lerp(c, toward, inset)
  const center = { x: (front.x + back.x) / 2, y: (front.y + back.y) / 2 + th }
  const legFront = corner(bFront, center)
  const legRight = corner(bRight, center)
  const legLeft = corner(bLeft, center)
  const legBack = corner(bBack, center)

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/10 mb-2"
      style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(25 18% 15%) 0%, hsl(25 20% 8%) 100%)" }}
    >
      <p className="absolute top-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/30 z-10">Предпросмотр</p>
      <svg viewBox="0 0 240 210" className="w-full h-auto block">
        {/* тень на полу */}
        <ellipse cx={center.x} cy={front.y + legLen + 12} rx={lenMag * 0.75 + widMag * 0.55} ry="11" fill="rgba(0,0,0,0.42)" />

        {adjustable ? (
          // ── ПОДСТОЛЬЕ С РЕГУЛИРОВКОЙ ВЫСОТЫ (телескопические колонны, вид с угла) ──
          [legLeft, legFront, legRight].map((p, i) => {
            const colW = 12
            const upperH = legLen * 0.5
            const innerW = 7.5
            return (
              <g key={i} style={{ transition: "all 0.4s ease" }}>
                {/* верхнее крепление */}
                <path d={`M${p.x - 11},${p.y - 3} l22,0 l-3,5 l-16,0 Z`} fill={dark} />
                {/* толстая верхняя секция */}
                <rect x={p.x - colW / 2} y={p.y} width={colW} height={upperH} rx="1.5" fill={legColor} />
                <rect x={p.x - colW / 2} y={p.y} width="3" height={upperH} fill={light} opacity="0.85" />
                <rect x={p.x + colW / 2 - 2.4} y={p.y} width="2.4" height={upperH} fill={dark} opacity="0.6" />
                {/* тонкая выдвижная секция */}
                <rect x={p.x - innerW / 2} y={p.y + upperH} width={innerW} height={legLen - upperH} rx="1.5"
                  fill={shade(legColor, legColor === "#e6e6e6" ? -0.08 : 0.1)} />
                <rect x={p.x - innerW / 2} y={p.y + upperH} width="2" height={legLen - upperH} fill={light} opacity="0.7" />
                {/* стык */}
                <rect x={p.x - colW / 2} y={p.y + upperH - 3} width={colW} height="4" rx="1" fill={dark} />
                {/* опора-подпятник (эллипс — стоит на полу) */}
                <ellipse cx={p.x} cy={p.y + legLen + 1} rx="7" ry="2.6" fill={dark} />
              </g>
            )
          })
        ) : (
          // ── СТАЦИОНАРНОЕ ПОДСТОЛЬЕ (трапециевидные наклонные ноги, вид с угла) ──
          [
            { top: legLeft, out: { x: -5, y: 2 } },
            { top: legFront, out: { x: 0, y: 3 } },
            { top: legRight, out: { x: 5, y: 2 } },
            { top: legBack, out: { x: 0, y: 1 } },
          ].map((leg, i) => {
            const barW = 3.2
            const foot = { x: leg.top.x + leg.out.x, y: leg.top.y + legLen }
            return (
              <g key={i} style={{ transition: "all 0.4s ease" }}>
                {/* верхний кронштейн крепления к столешнице */}
                <path d={`M${leg.top.x - 9},${leg.top.y - 3} l18,0 l-2.5,4.5 l-13,0 Z`} fill={dark} />
                {/* наклонная нога (трапеция — сверху шире, книзу уже) */}
                <path
                  d={`M${leg.top.x - 6},${leg.top.y} L${leg.top.x + 6},${leg.top.y} L${foot.x + barW},${foot.y} L${foot.x - barW},${foot.y} Z`}
                  fill={legColor}
                />
                <path
                  d={`M${leg.top.x - 6},${leg.top.y} L${leg.top.x - 2.5},${leg.top.y} L${foot.x - barW + 1.4},${foot.y} L${foot.x - barW},${foot.y} Z`}
                  fill={light} opacity="0.7"
                />
                <path
                  d={`M${leg.top.x + 6},${leg.top.y} L${leg.top.x + 3},${leg.top.y} L${foot.x + barW - 1.4},${foot.y} L${foot.x + barW},${foot.y} Z`}
                  fill={dark} opacity="0.55"
                />
                {/* опора */}
                <ellipse cx={foot.x} cy={foot.y + 1} rx="6" ry="2.4" fill={dark} />
              </g>
            )
          })
        )}

        {/* торцы столешницы (толщина) */}
        <g style={{ transition: "all 0.4s ease" }}>
          <path d={leftFace} fill={shade(coatingColor, -0.28)} />
          <path d={rightFace} fill={shade(coatingColor, -0.16)} />
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