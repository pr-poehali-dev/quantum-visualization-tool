import { useState } from "react"
import { ArrowRight, Check, Copy } from "lucide-react"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"

const BASE_PRICE = 10000
const LENGTH_BASE = 100
const WIDTH_BASE = 60
const PRICE_PER_10CM = 2000

const coatings = [
  { id: "oil-natural", label: "Масло натуральное", color: "#d9ad5f", price: 0 },
  { id: "lacquer", label: "Лак матовый", color: "#e6c58e", price: 0 },
  { id: "oil-dark", label: "Морилка орех/лак", color: "#7a4a29", price: 2000 },
  { id: "mordant", label: "Морилка венге/лак", color: "#3a2416", price: 2000 },
]

const legs = [
  { id: "metal-black", label: "Металл чёрный", icon: "Square", price: 10000, color: "#1c1c1e", adjustable: false },
  { id: "metal-white", label: "Металл белый", icon: "Square", price: 10000, color: "#e6e6e6", adjustable: false },
  { id: "height-adj-white", label: "Регулировка высоты белый", icon: "ArrowUpDown", price: 25000, color: "#e6e6e6", adjustable: true },
  { id: "height-adj-black", label: "Регулировка высоты чёрный", icon: "ArrowUpDown", price: 25000, color: "#1c1c1e", adjustable: true },
]

const extras = [
  { id: "pc-hang", label: "Подвес для ПК", icon: "Monitor", price: 5000 },
  { id: "cable-tray", label: "Лоток для проводов", icon: "Cable", price: 5000 },
]

function calcSizePrice(length: number, width: number) {
  const lengthSteps = Math.round((length - LENGTH_BASE) / 10)
  const widthSteps = Math.round((width - WIDTH_BASE) / 10)
  return (lengthSteps + widthSteps) * PRICE_PER_10CM
}

function shade(hex: string, percent: number) {
  const n = parseInt(hex.replace("#", ""), 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(((n >> 16) & 255) + Math.round(255 * percent))
  const g = clamp(((n >> 8) & 255) + Math.round(255 * percent))
  const b = clamp((n & 255) + Math.round(255 * percent))
  return `rgb(${r}, ${g}, ${b})`
}

function TablePreview({
  coatingColor,
  legColor,
  adjustable,
  length,
  width,
}: {
  coatingColor: string
  legColor: string
  adjustable: boolean
  length: number
  width: number
}) {
  const topW = 60 + ((length - 100) / 80) * 130
  const topH = 16 + ((width - 60) / 20) * 12
  const x = (240 - topW) / 2
  const legTop = 40 + topH
  const legBottom = 150

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-white/10 mb-2"
      style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(25 18% 14%) 0%, hsl(25 20% 8%) 100%)" }}
    >
      <p className="absolute top-3 left-4 text-[10px] tracking-[0.3em] uppercase text-white/30 z-10">Предпросмотр</p>
      <svg viewBox="0 0 240 170" className="w-full h-auto block">
        <ellipse cx="120" cy="158" rx={topW / 2} ry="7" fill="rgba(0,0,0,0.4)" />

        {/* ножки */}
        {[x + topW * 0.12, x + topW * 0.88].map((lx, i) => (
          <g key={i}>
            <rect
              x={lx - 4} y={legTop} width="8" height={legBottom - legTop} rx="2"
              fill={legColor}
              style={{ transition: "all 0.4s ease" }}
            />
            {adjustable && (
              <rect
                x={lx - 6} y={legTop + (legBottom - legTop) * 0.4} width="12" height="10" rx="2"
                fill={shade(legColor, legColor === "#e6e6e6" ? -0.12 : 0.18)}
              />
            )}
            <rect x={lx - 9} y={legBottom} width="18" height="4" rx="2" fill={shade(legColor, -0.1)} />
          </g>
        ))}

        {/* столешница */}
        <g style={{ transition: "all 0.4s ease" }}>
          <rect
            x={x} y="40" width={topW} height={topH} rx="4"
            fill={coatingColor}
            style={{ transition: "all 0.5s ease" }}
          />
          <rect
            x={x} y="40" width={topW} height={topH} rx="4"
            fill="url(#woodGrain)" opacity="0.35"
          />
          <rect
            x={x} y="40" width={topW} height="3" rx="2"
            fill={shade(coatingColor, 0.14)} opacity="0.7"
          />
        </g>

        <defs>
          <linearGradient id="woodGrain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="75%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-4" style={{ color: "var(--gold)" }}>
      {children}
    </p>
  )
}

export function Constructor() {
  const [length, setLength] = useState(140)
  const [width, setWidth] = useState(70)
  const [coating, setCoating] = useState("oil-natural")
  const [legsType, setLegsType] = useState("metal-black")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [copied, setCopied] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const toggleExtra = (id: string) =>
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )

  const sizePrice = calcSizePrice(length, width)
  const coatingPrice = coatings.find(c => c.id === coating)?.price ?? 0
  const legsPrice = legs.find(l => l.id === legsType)?.price ?? 0
  const extrasPrice = selectedExtras.reduce((sum, id) => sum + (extras.find(e => e.id === id)?.price ?? 0), 0)
  const totalPrice = BASE_PRICE + sizePrice + coatingPrice + legsPrice + extrasPrice

  const sizeLabel = `${length} × ${width} см`
  const selectedCoating = coatings.find(c => c.id === coating) ?? coatings[0]
  const selectedLegs = legs.find(l => l.id === legsType) ?? legs[0]
  const coatingLabel = selectedCoating.label
  const legsLabel = selectedLegs.label
  const extrasLabels = selectedExtras.map(e => extras.find(x => x.id === e)?.label).filter(Boolean).join(", ")
  const summary = [
    `Размер: ${sizeLabel}`,
    coatingLabel && `Покрытие: ${coatingLabel}`,
    legsLabel && `Ножки: ${legsLabel}`,
    extrasLabels && `Доп: ${extrasLabels}`,
  ].filter(Boolean).join(" · ")

  const contactLine = [name && `Имя: ${name}`, phone && `Телефон: ${phone}`].filter(Boolean).join(" · ")
  const priceLine = `Итого: ${totalPrice.toLocaleString("ru-RU")} ₽`
  const orderMessage = [`Привет! Хочу заказать стол.`, summary, priceLine, contactLine].filter(Boolean).join("\n")

  const handleOrder = () => {
    setContactOpen(true)
  }

  const activeBtn =
    "rounded-lg border-[var(--gold)] bg-foreground text-background -translate-y-0.5 shadow-[0_6px_18px_rgba(201,168,76,0.35),0_0_0_1px_var(--gold),inset_0_1px_1px_rgba(255,255,255,0.5)]"
  const inactiveBtn =
    "rounded-lg border-white/10 text-white/80 bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)] hover:border-white/30 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_5px_14px_rgba(0,0,0,0.45)]"

  return (
    <section id="constructor" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(25 20% 8%) 0%, hsl(25 20% 8%) 30%, var(--navy) 100%)" }}>

      {/* декоративный свет */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07] animate-glow-float"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-24 w-[200px] h-[200px] rounded-full opacity-[0.05] animate-glow-float"
          style={{ background: "radial-gradient(circle, rgba(255,240,205,0.9) 0%, transparent 70%)", animationDelay: "1.5s" }} />
        <span className="absolute -bottom-4 right-0 text-[16rem] font-bold leading-none text-white/[0.015] hidden lg:block">04</span>

        {/* парящие светлые частицы */}
        {[
          { left: "8%", top: "20%", size: 5, delay: "0s", dur: "8s" },
          { left: "88%", top: "35%", size: 6, delay: "1.4s", dur: "9s" },
          { left: "70%", top: "80%", size: 4, delay: "0.8s", dur: "7s" },
          { left: "20%", top: "70%", size: 6, delay: "2.2s", dur: "8.5s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-particle-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, rgba(255,248,230,0.9) 0%, rgba(232,200,116,0.3) 60%, transparent 100%)",
              boxShadow: "0 0 8px rgba(255,244,214,0.5)",
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* заголовок */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-0.5 h-8 bg-[var(--gold)] shrink-0" />
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Конструктор</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-white">
            Соберите свой стол
          </h2>
          <p className="text-white/50 text-lg mb-14 max-w-xl">
            Выберите параметры — цена пересчитывается мгновенно.
          </p>

          <div className="grid md:grid-cols-[1fr_300px] gap-5 items-start">

            {/* ЛЕВАЯ ПАНЕЛЬ — параметры */}
            <div className="space-y-2">

              {/* Размер */}
              <div className="p-6 border border-white/10 bg-white/[0.04]">
                <SectionLabel>1 · Размер столешницы</SectionLabel>

                {/* Длина */}
                <div className="mb-7">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-sm text-white/60">Длина</span>
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {length} <span className="text-sm font-normal text-white/40">см</span>
                    </span>
                  </div>
                  <div className="relative h-3">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "hsl(25 18% 12%)",
                        boxShadow:
                          "inset 0 2px 5px rgba(0,0,0,0.65), inset 0 -1px 1px rgba(255,255,255,0.04)",
                      }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                      style={{
                        width: `${((length - 100) / 80) * 100}%`,
                        background: "linear-gradient(180deg, #e8c874 0%, var(--gold) 55%, #a8842f 100%)",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.45), 0 0 10px rgba(201,168,76,0.4)",
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-150 pointer-events-none"
                      style={{
                        left: `${((length - 100) / 80) * 100}%`,
                        background: "radial-gradient(circle at 35% 30%, #fff7e0 0%, #e8c874 40%, var(--gold) 70%, #9a7828 100%)",
                        boxShadow:
                          "0 2px 6px rgba(0,0,0,0.55), 0 0 8px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,255,255,0.6)",
                        border: "1px solid rgba(0,0,0,0.25)",
                      }}
                    />
                    <input
                      type="range" min={100} max={180} step={10}
                      value={length}
                      onChange={e => setLength(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10 h-full"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/25 mt-2">
                    <span>100 см</span><span>180 см</span>
                  </div>
                </div>

                {/* Ширина */}
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-sm text-white/60">Ширина</span>
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {width} <span className="text-sm font-normal text-white/40">см</span>
                    </span>
                  </div>
                  <div className="relative h-3">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "hsl(25 18% 12%)",
                        boxShadow:
                          "inset 0 2px 5px rgba(0,0,0,0.65), inset 0 -1px 1px rgba(255,255,255,0.04)",
                      }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                      style={{
                        width: `${((width - 60) / 20) * 100}%`,
                        background: "linear-gradient(180deg, #e8c874 0%, var(--gold) 55%, #a8842f 100%)",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.45), 0 0 10px rgba(201,168,76,0.4)",
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-150 pointer-events-none"
                      style={{
                        left: `${((width - 60) / 20) * 100}%`,
                        background: "radial-gradient(circle at 35% 30%, #fff7e0 0%, #e8c874 40%, var(--gold) 70%, #9a7828 100%)",
                        boxShadow:
                          "0 2px 6px rgba(0,0,0,0.55), 0 0 8px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,255,255,0.6)",
                        border: "1px solid rgba(0,0,0,0.25)",
                      }}
                    />
                    <input
                      type="range" min={60} max={80} step={10}
                      value={width}
                      onChange={e => setWidth(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10 h-full"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/25 mt-2">
                    <span>60 см</span><span>80 см</span>
                  </div>
                </div>

                {sizePrice > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--gold)" }}>
                      +{sizePrice.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-[10px] text-white/25">+2 000 ₽ за каждые 10 см</span>
                  </div>
                )}
              </div>

              {/* Покрытие */}
              <div className="p-6 border border-white/10 bg-white/[0.04]">
                <SectionLabel>2 · Цвет / покрытие</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {coatings.map(c => (
                    <button key={c.id} onClick={() => setCoating(c.id)}
                      className={`flex items-center gap-3 px-4 py-3 border text-sm text-left transition-all duration-200 ${coating === c.id ? activeBtn : inactiveBtn}`}>
                      <span
                        className="w-7 h-7 rounded-full shrink-0 border-2 border-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.5)]"
                        style={{ background: c.color }}
                      />
                      <span className="flex flex-col items-start min-w-0">
                        <span className="truncate w-full">{c.label}</span>
                        {c.price > 0 && (
                          <span className={`text-[10px] font-medium ${coating === c.id ? "opacity-70" : ""}`}
                            style={coating !== c.id ? { color: "var(--gold)" } : {}}>
                            +{c.price.toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ножки */}
              <div className="p-6 border border-white/10 bg-white/[0.04]">
                <SectionLabel>3 · Тип ножек</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {legs.map(l => (
                    <button key={l.id} onClick={() => setLegsType(l.id)}
                      className={`flex items-center gap-3 px-4 py-3 border text-sm text-left transition-all duration-200 ${legsType === l.id ? activeBtn : inactiveBtn}`}>
                      <Icon name={l.icon} size={16} className="shrink-0" />
                      <span className="flex flex-col items-start min-w-0">
                        <span className="truncate w-full">{l.label}</span>
                        <span className={`text-[10px] font-medium ${legsType === l.id ? "opacity-70" : ""}`}
                          style={legsType !== l.id ? { color: "var(--gold)" } : {}}>
                          +{l.price.toLocaleString("ru-RU")} ₽
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Допы */}
              <div className="p-6 border border-white/10 bg-white/[0.04]">
                <SectionLabel>4 · Дополнения</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {extras.map(e => (
                    <button key={e.id} onClick={() => toggleExtra(e.id)}
                      className={`flex items-center gap-3 px-4 py-3 border text-sm text-left transition-all duration-200 ${selectedExtras.includes(e.id) ? activeBtn : inactiveBtn}`}>
                      <Icon name={e.icon} size={16} className="shrink-0" />
                      <span className="flex flex-col items-start min-w-0">
                        <span className="truncate w-full">{e.label}</span>
                        <span className={`text-[10px] font-medium ${selectedExtras.includes(e.id) ? "opacity-70" : ""}`}
                          style={!selectedExtras.includes(e.id) ? { color: "var(--gold)" } : {}}>
                          +{e.price.toLocaleString("ru-RU")} ₽
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ПРАВАЯ ПАНЕЛЬ — итог, sticky */}
            <div className="md:sticky md:top-8 space-y-2">

              {/* предпросмотр стола */}
              <TablePreview
                coatingColor={selectedCoating.color}
                legColor={selectedLegs.color}
                adjustable={selectedLegs.adjustable}
                length={length}
                width={width}
              />

              {/* цена */}
              <div className="p-6 border border-white/15 rounded-xl depth-card-dark depth-edge" style={{ background: "hsl(25 18% 11%)" }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 mb-5">Стоимость</p>
                <div className="space-y-2 text-sm mb-5">
                  <div className="flex justify-between text-white/45">
                    <span>База</span>
                    <span>{BASE_PRICE.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  {sizePrice > 0 && (
                    <div className="flex justify-between text-white/45">
                      <span>{sizeLabel}</span>
                      <span>+{sizePrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {coatingPrice > 0 && (
                    <div className="flex justify-between text-white/45">
                      <span>{coatingLabel}</span>
                      <span>+{coatingPrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {legsPrice > 0 && (
                    <div className="flex justify-between text-white/45">
                      <span>Ножки</span>
                      <span>+{legsPrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {extrasPrice > 0 && (
                    <div className="flex justify-between text-white/45">
                      <span>Допы</span>
                      <span>+{extrasPrice.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <span className="text-white/50 text-xs tracking-wider uppercase">Итого</span>
                  <span className="text-3xl font-bold text-white tabular-nums">
                    {totalPrice.toLocaleString("ru-RU")} <span className="text-lg font-medium text-white/60">₽</span>
                  </span>
                </div>
              </div>

              {/* конфигурация */}
              <div className="p-5 border border-white/10 bg-white/[0.03]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Конфигурация</p>
                <p className="text-white/55 text-xs leading-relaxed">{summary}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderMessage).then(() => {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 3000)
                    })
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Скопировано" : "Скопировать заказ"}
                </button>
              </div>

              {/* контакты */}
              <div className="p-5 border border-white/10 bg-white/[0.03]">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Контакты</p>
                <div className="space-y-2">
                  <input type="text" placeholder="Имя"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/35 transition-colors duration-200"
                  />
                  <input type="tel" placeholder="Номер телефона"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/35 transition-colors duration-200"
                  />
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="btn-glow w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-sm tracking-widest uppercase font-medium transition-all duration-300 group"
                style={{ background: "var(--gold, #c9a84c)", color: "#1a0f05" }}
              >
                Заказать стол
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

            </div>
          </div>

        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} message={orderMessage} />
    </section>
  )
}