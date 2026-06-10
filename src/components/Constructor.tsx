import { useState } from "react"
import { ArrowRight, Check, Copy } from "lucide-react"
import Icon from "@/components/ui/icon"

const BASE_PRICE = 10000
const LENGTH_BASE = 100
const WIDTH_BASE = 60
const PRICE_PER_10CM = 1500

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

export function Constructor() {
  const [length, setLength] = useState(140)
  const [width, setWidth] = useState(70)
  const [coating, setCoating] = useState("oil-natural")
  const [legsType, setLegsType] = useState("metal-black")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [copied, setCopied] = useState(false)

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

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
  const inactiveBtn = "border-foreground/30 text-foreground hover:border-foreground/70 bg-background"

  return (
    <section id="constructor" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto relative">
          <span className="absolute -top-8 right-0 text-[10rem] font-bold leading-none select-none pointer-events-none text-foreground/[0.04] lg:text-[14rem]">04</span>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-0.5 h-8 bg-[var(--gold)] shrink-0" />
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">Конструктор</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-foreground">
            Соберите свой стол
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Выберите параметры — мы рассчитаем стоимость и свяжемся с вами.
          </p>

          {/* Размер — ползунки */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-6">Размер столешницы</h3>
            <div className="space-y-7">
              {/* Длина */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground font-medium">Длина</span>
                  <span className="text-base font-semibold text-foreground tabular-nums">{length} см</span>
                </div>
                <input
                  type="range"
                  min={100} max={180} step={10}
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--gold)] bg-foreground/20"
                  style={{ accentColor: "var(--gold)" }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100 см</span>
                  <span>180 см</span>
                </div>
              </div>
              {/* Ширина */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground font-medium">Ширина</span>
                  <span className="text-base font-semibold text-foreground tabular-nums">{width} см</span>
                </div>
                <input
                  type="range"
                  min={60} max={80} step={10}
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-foreground/20"
                  style={{ accentColor: "var(--gold)" }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>60 см</span>
                  <span>80 см</span>
                </div>
              </div>
            </div>
            {sizePrice > 0 && (
              <p className="mt-3 text-sm font-medium" style={{ color: "var(--gold)" }}>
                +{sizePrice.toLocaleString("ru-RU")} ₽ к базовой цене
              </p>
            )}
          </div>

          {/* Покрытие */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-4">Цвет / покрытие</h3>
            <div className="flex flex-wrap gap-3">
              {coatings.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCoating(c.id)}
                  className={`flex flex-col items-start px-5 py-3 border text-sm transition-all duration-200 ${
                    coating === c.id ? activeBtn : inactiveBtn
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full border border-black/20 shrink-0"
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </span>
                  {c.price > 0 && (
                    <span className={`text-xs mt-1 ml-8 font-medium ${coating === c.id ? "opacity-80" : ""}`}
                      style={coating !== c.id ? { color: "var(--gold)" } : {}}>
                      +{c.price.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ножки */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-4">Тип ножек</h3>
            <div className="flex flex-wrap gap-3">
              {legs.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLegsType(l.id)}
                  className={`flex flex-col items-start px-5 py-3 border text-sm transition-all duration-200 ${
                    legsType === l.id ? activeBtn : inactiveBtn
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={l.icon} size={16} />
                    {l.label}
                  </span>
                  <span className={`text-xs mt-1 font-medium ${legsType === l.id ? "opacity-80" : ""}`}
                    style={legsType !== l.id ? { color: "var(--gold)" } : {}}>
                    +{l.price.toLocaleString("ru-RU")} ₽
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Допы */}
          <div className="mb-12">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-4">Дополнения</h3>
            <div className="flex flex-wrap gap-3">
              {extras.map(e => (
                <button
                  key={e.id}
                  onClick={() => toggleExtra(e.id)}
                  className={`flex flex-col items-start px-5 py-3 border text-sm transition-all duration-200 ${
                    selectedExtras.includes(e.id) ? activeBtn : inactiveBtn
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={e.icon} size={16} />
                    {e.label}
                  </span>
                  <span className={`text-xs mt-1 font-medium ${selectedExtras.includes(e.id) ? "opacity-80" : ""}`}
                    style={!selectedExtras.includes(e.id) ? { color: "var(--gold)" } : {}}>
                    +{e.price.toLocaleString("ru-RU")} ₽
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Калькулятор */}
          <div className="mb-10 border border-foreground/20 p-6 bg-foreground/5">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-5">Расчёт стоимости</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>Базовая цена</span>
                <span>{BASE_PRICE.toLocaleString("ru-RU")} ₽</span>
              </div>
              {sizePrice > 0 && (
                <div className="flex justify-between text-foreground/70">
                  <span>Размер {sizeLabel}</span>
                  <span>+{sizePrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {coatingPrice > 0 && (
                <div className="flex justify-between text-foreground/70">
                  <span>{coatingLabel}</span>
                  <span>+{coatingPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {legsPrice > 0 && (
                <div className="flex justify-between text-foreground/70">
                  <span>Ножки: {legsLabel}</span>
                  <span>+{legsPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              {extrasPrice > 0 && (
                <div className="flex justify-between text-foreground/70">
                  <span>Дополнения</span>
                  <span>+{extrasPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              )}
              <div className="border-t border-foreground/20 pt-3 mt-3 flex justify-between items-center">
                <span className="font-semibold text-foreground text-base">Итого</span>
                <span className="text-2xl font-bold text-foreground">{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-foreground font-semibold mb-4">Ваши контакты</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 border border-foreground/30 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
              <input
                type="tel"
                placeholder="Номер телефона"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 border border-foreground/30 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
            </div>
          </div>

          {/* Итог */}
          <div className="border border-foreground/25 p-6 bg-foreground/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Ваша конфигурация</p>
                <p className="text-foreground text-sm leading-relaxed mb-3">{summary}</p>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-foreground">{totalPrice.toLocaleString("ru-RU")} ₽</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orderMessage).then(() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 3000)
                      })
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/30 text-xs text-foreground hover:border-foreground transition-all duration-200"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Скопировано" : "Скопировать"}
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleOrder}
                  disabled={!phone.trim()}
                  className="inline-flex shrink-0 items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-medium transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "var(--gold, #c9a84c)", color: "#1a0f05" }}
                >
                  Заказать
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                {!phone.trim() && (
                  <p className="text-xs text-muted-foreground">Укажите номер телефона</p>
                )}
              </div>
            </div>

            {copied && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-foreground/5 border border-foreground/15">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Текст скопирован в буфер обмена</p>
                  <p className="text-xs text-muted-foreground">Вставьте его в чат мессенджера, который только что открылся:</p>
                  <p className="text-xs text-foreground mt-1 font-mono bg-foreground/10 px-2 py-1 rounded">{orderMessage}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
