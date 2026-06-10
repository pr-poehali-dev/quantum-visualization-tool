import { useState } from "react"
import { ArrowRight, Check, Copy } from "lucide-react"
import Icon from "@/components/ui/icon"

const BASE_PRICE = 10000
const LENGTH_BASE = 100
const WIDTH_BASE = 60
const PRICE_PER_10CM = 2000

const coatings = [
  { id: "oil-natural", label: "Масло натуральное", color: "#c9a060", price: 0 },
  { id: "lacquer", label: "Лак матовый", color: "#d4b483", price: 0 },
  { id: "oil-dark", label: "Масло тёмное", color: "#6b4226", price: 2000 },
  { id: "mordant", label: "Морилка венге", color: "#2c1a0e", price: 2000 },
]

const legs = [
  { id: "metal-black", label: "Металл чёрный", icon: "Square", price: 10000 },
  { id: "metal-white", label: "Металл белый", icon: "Square", price: 10000 },
  { id: "height-adj-white", label: "Регулировка высоты белый", icon: "ArrowUpDown", price: 25000 },
  { id: "height-adj-black", label: "Регулировка высоты чёрный", icon: "ArrowUpDown", price: 25000 },
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
  const coatingLabel = coatings.find(c => c.id === coating)?.label || ""
  const legsLabel = legs.find(l => l.id === legsType)?.label || ""
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
  const maxUrl = `https://max.ru/u/f9LHodD0cOK0cpbAk71R9WDFAnOL6VH7GD8IA4Uzvcn0QVi1HEGl562uJc0`

  const handleOrder = () => {
    navigator.clipboard.writeText(orderMessage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
    window.open(maxUrl, "_blank", "noopener,noreferrer")
  }

  const activeBtn = "border-[var(--gold)] bg-foreground text-background"
  const inactiveBtn = "border-white/15 text-white/80 hover:border-white/40 bg-white/[0.04]"

  return (
    <section id="constructor" className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "hsl(25 20% 8%)" }}>

      {/* декоративный свет */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-24 w-[340px] h-[340px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />
        <span className="absolute -bottom-4 right-0 text-[16rem] font-bold leading-none text-white/[0.015] hidden lg:block">04</span>
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
                    <div className="absolute inset-0 rounded-full" style={{ background: "hsl(25 18% 18%)" }} />
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                      style={{ width: `${((length - 100) / 80) * 100}%`, background: "var(--gold)" }} />
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
                    <div className="absolute inset-0 rounded-full" style={{ background: "hsl(25 18% 18%)" }} />
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                      style={{ width: `${((width - 60) / 20) * 100}%`, background: "var(--gold)" }} />
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
                <div className="flex flex-wrap gap-2">
                  {coatings.map(c => (
                    <button key={c.id} onClick={() => setCoating(c.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 border text-sm transition-all duration-200 ${coating === c.id ? activeBtn : inactiveBtn}`}>
                      <span className="w-4 h-4 rounded-full border border-black/20 shrink-0" style={{ background: c.color }} />
                      <span className="flex flex-col items-start">
                        <span>{c.label}</span>
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
                <div className="flex flex-wrap gap-2">
                  {legs.map(l => (
                    <button key={l.id} onClick={() => setLegsType(l.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 border text-sm transition-all duration-200 ${legsType === l.id ? activeBtn : inactiveBtn}`}>
                      <Icon name={l.icon} size={14} />
                      <span className="flex flex-col items-start">
                        <span>{l.label}</span>
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
                <div className="flex flex-wrap gap-2">
                  {extras.map(e => (
                    <button key={e.id} onClick={() => toggleExtra(e.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 border text-sm transition-all duration-200 ${selectedExtras.includes(e.id) ? activeBtn : inactiveBtn}`}>
                      <Icon name={e.icon} size={14} />
                      <span className="flex flex-col items-start">
                        <span>{e.label}</span>
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

              {/* цена */}
              <div className="p-6 border border-white/15" style={{ background: "hsl(25 18% 11%)" }}>
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
                disabled={!phone.trim()}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--gold, #c9a84c)", color: "#1a0f05" }}
              >
                Заказать стол
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {!phone.trim() && (
                <p className="text-center text-[11px] text-white/25">Укажите номер телефона</p>
              )}

              {copied && (
                <div className="p-4 border border-white/10 bg-white/5 flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm text-white font-medium mb-0.5">Текст скопирован</p>
                    <p className="text-xs text-white/35">Вставьте в чат мессенджера, который открылся</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
