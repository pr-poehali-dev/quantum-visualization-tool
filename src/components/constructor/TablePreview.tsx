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
  const halfW = 45 + ((length - 100) / 80) * 55   // половина ДЛИНЫ по оси X (красная сторона)
  const depth = 22 + ((width - 60) / 20) * 16      // ШИРИНА по оси проекции (синяя сторона)
  const cx = 120
  const topY = 58                                   // вершина ближнего угла столешницы
  const th = 9                                       // толщина торца столешницы
  const dy = depth * 0.5

  // 4 угла верхней грани столешницы (ромб)
  const front = { x: cx, y: topY + dy }             // ближний нижний угол
  const right = { x: cx + halfW, y: topY + dy - dy } // правый (конец ДЛИНЫ)
  const back = { x: cx, y: topY - dy }              // дальний верхний
  const left = { x: cx - halfW, y: topY + dy - dy }  // левый (конец ШИРИНЫ)

  const topPath = `M${front.x},${front.y} L${right.x},${right.y} L${back.x},${back.y} L${left.x},${left.y} Z`
  const frontFace = `M${left.x},${left.y} L${front.x},${front.y} L${front.x},${front.y + th} L${left.x},${left.y + th} Z`
  const rightFace = `M${front.x},${front.y} L${right.x},${right.y} L${right.x},${right.y + th} L${front.x},${front.y + th} Z`

  const legLen = 66
  const legY = topY + dy + th

  // 4 угла нижней грани столешницы (низ торца)
  const bFront = { x: front.x, y: front.y + th }
  const bRight = { x: right.x, y: right.y + th }
  const bLeft = { x: left.x, y: left.y + th }
  const bBack = { x: back.x, y: back.y + th }

  const dark = shade(legColor, legColor === "#e6e6e6" ? -0.18 : 0.14)
  const light = shade(legColor, 0.18)

  // точка на 12% и 88% вдоль ребра между двумя вершинами
  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  })

  // опоры устанавливаем ближе к торцам ДЛИНЫ (левый и правый край)
  const footL = lerp(bLeft, bFront, 0.25)   // ближе к левому торцу
  const footR = lerp(bRight, bFront, 0.25)  // ближе к правому торцу
  const footBackL = lerp(bLeft, bBack, 0.25)
  const footBackR = lerp(bRight, bBack, 0.25)

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/10 mb-2"
      style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(25 18% 15%) 0%, hsl(25 20% 8%) 100%)" }}
    >
      <p className="absolute top-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/30 z-10">Предпросмотр</p>
      <svg viewBox="0 0 240 200" className="w-full h-auto block">
        {/* тень на полу */}
        <ellipse cx={cx} cy={legY + legLen + 6} rx={halfW * 0.95} ry="10" fill="rgba(0,0,0,0.45)" />

        {adjustable ? (
          // ── ПОДСТОЛЬЕ С РЕГУЛИРОВКОЙ ВЫСОТЫ (телескопические колонны) ──
          [footL, footR].map((p, i) => {
            const colW = 11
            const upperH = legLen * 0.5
            const innerW = 7
            return (
              <g key={i} style={{ transition: "all 0.4s ease" }}>
                {/* верхнее крепление к столешнице */}
                <rect x={p.x - 10} y={p.y - 3} width="20" height="5" rx="1" fill={dark} />
                {/* верхняя (толстая) секция колонны */}
                <rect x={p.x - colW / 2} y={p.y} width={colW} height={upperH} rx="1.5" fill={legColor} />
                <rect x={p.x - colW / 2} y={p.y} width="2.6" height={upperH} fill={light} opacity="0.85" />
                {/* нижняя (тонкая, выдвижная) секция */}
                <rect x={p.x - innerW / 2} y={p.y + upperH} width={innerW} height={legLen - upperH} rx="1.5" fill={shade(legColor, legColor === "#e6e6e6" ? -0.08 : 0.1)} />
                <rect x={p.x - innerW / 2} y={p.y + upperH} width="1.8" height={legLen - upperH} fill={light} opacity="0.7" />
                {/* стык секций */}
                <rect x={p.x - colW / 2} y={p.y + upperH - 3} width={colW} height="4" rx="1" fill={dark} />
                {/* опора */}
                <rect x={p.x - 8} y={p.y + legLen} width="16" height="4" rx="1.5" fill={dark} />
              </g>
            )
          })
        ) : (
          // ── СТАЦИОНАРНОЕ ПОДСТОЛЬЕ (трапециевидные П-образные рамы) ──
          [
            { top: footL, foot: { x: footL.x + 4, y: footL.y + legLen } },
            { top: footR, foot: { x: footR.x - 4, y: footR.y + legLen } },
            { top: footBackL, foot: { x: footBackL.x + 4, y: footBackL.y + legLen } },
            { top: footBackR, foot: { x: footBackR.x - 4, y: footBackR.y + legLen } },
          ].map((leg, i) => {
            const barW = 3.5
            return (
              <g key={i} style={{ transition: "all 0.4s ease" }}>
                {/* наклонная нога (трапеция — сверху шире, книзу уже) */}
                <path
                  d={`M${leg.top.x - 6},${leg.top.y} L${leg.top.x + 6},${leg.top.y} L${leg.foot.x + barW},${leg.foot.y} L${leg.foot.x - barW},${leg.foot.y} Z`}
                  fill={legColor}
                />
                <path
                  d={`M${leg.top.x - 6},${leg.top.y} L${leg.top.x - 3},${leg.top.y} L${leg.foot.x - barW},${leg.foot.y} L${leg.foot.x - barW + 1.5},${leg.foot.y} Z`}
                  fill={light} opacity="0.7"
                />
                {/* опора */}
                <rect x={leg.foot.x - 6} y={leg.foot.y} width="12" height="3.5" rx="1.5" fill={dark} />
              </g>
            )
          })
        )}

        {/* верхняя перекладина крепления (для стационарного — соединяет пары ног) */}
        {!adjustable && (
          <g style={{ transition: "all 0.4s ease" }}>
            <rect x={footL.x - 8} y={footL.y - 2} width={footR.x - footL.x + 16} height="4" rx="1" fill={dark} opacity="0.9" />
          </g>
        )}

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

        {/* ── ИНДИКАТОРЫ СТОРОН ── */}
        {/* красная линия = ДЛИНА (переднее-правое ребро front→right) */}
        <line x1={front.x} y1={front.y} x2={right.x} y2={right.y} stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round" />
        {/* синяя линия = ШИРИНА (переднее-левое ребро front→left) */}
        <line x1={front.x} y1={front.y} x2={left.x} y2={left.y} stroke="#2d6cff" strokeWidth="2.5" strokeLinecap="round" />

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
          <span style={{ color: "#ff6b60" }}>{length}</span> × <span style={{ color: "#6b93ff" }}>{width}</span> см
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
