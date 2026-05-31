import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import Icon from "@/components/ui/icon"

const BASE_PRICE = 35000

const sizes = [
  { id: "120x70", label: "120 × 70 см", desc: "Компактный", price: 10000 },
  { id: "140x70", label: "140 × 70 см", desc: "Стандарт", price: 15000 },
  { id: "150x80", label: "150 × 80 см", desc: "Просторный", price: 20000 },
  { id: "180x80", label: "180 × 80 см", desc: "Большой", price: 25000 },
  { id: "custom", label: "Свой размер", desc: "Под заказ", price: 0 },
]

const coatings = [
  { id: "oil-natural", label: "Масло натуральное", color: "#c9a060", price: 0 },
  { id: "lacquer", label: "Лак матовый", color: "#d4b483", price: 0 },
  { id: "oil-dark", label: "Масло тёмное", color: "#6b4226", price: 2000 },
  { id: "mordant", label: "Морилка венге", color: "#2c1a0e", price: 2000 },
]

const legs = [
  { id: "metal-black", label: "Металл чёрный", icon: "Square" },
  { id: "metal-white", label: "Металл белый", icon: "Square" },
  { id: "height-adj-white", label: "Регулировка высоты белый", icon: "ArrowUpDown" },
  { id: "height-adj-black", label: "Регулировка высоты чёрный", icon: "ArrowUpDown" },
]

const extras = [
  { id: "pc-hang", label: "Подвес для ПК", icon: "Monitor" },
  { id: "cable-tray", label: "Лоток для проводов", icon: "Cable" },
]

function buildSummary(size: string, coating: string, legsType: string, selectedExtras: string[]) {
  const sizeLabel = sizes.find(s => s.id === size)?.label || ""
  const coatingLabel = coatings.find(c => c.id === coating)?.label || ""
  const legsLabel = legs.find(l => l.id === legsType)?.label || ""
  const extrasLabels = selectedExtras.map(e => extras.find(x => x.id === e)?.label).filter(Boolean).join(", ")

  const parts = [
    sizeLabel && `Размер: ${sizeLabel}`,
    coatingLabel && `Покрытие: ${coatingLabel}`,
    legsLabel && `Ножки: ${legsLabel}`,
    extrasLabels && `Доп: ${extrasLabels}`,
  ].filter(Boolean)

  return parts.join(" · ")
}

function calcPrice(size: string, coating: string) {
  const sizePrice = sizes.find(s => s.id === size)?.price ?? 0
  const coatingPrice = coatings.find(c => c.id === coating)?.price ?? 0
  if (size === "custom") return null
  return BASE_PRICE + sizePrice + coatingPrice
}

export function Constructor() {
  const [size, setSize] = useState("140x70")
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

  const summary = buildSummary(size, coating, legsType, selectedExtras)
  const contactLine = [name && `Имя: ${name}`, phone && `Телефон: ${phone}`].filter(Boolean).join(" · ")
  const orderMessage = [`Привет! Хочу заказать стол.`, summary, contactLine].filter(Boolean).join("\n")
  const maxUrl = `https://max.ru/u/f9LHodD0cOK0cpbAk71R9WDFAnOL6VH7GD8IA4Uzvcn0QVi1HEGl562uJc0`

  const totalPrice = calcPrice(size, coating)
  const sizePrice = sizes.find(s => s.id === size)?.price ?? 0
  const coatingPrice = coatings.find(c => c.id === coating)?.price ?? 0

  const handleOrder = () => {
    navigator.clipboard.writeText(orderMessage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
    window.open(maxUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="constructor" className="py-24 md:py-32 bg-secondary/60">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Конструктор</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-foreground">
            Соберите свой стол
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Выберите параметры — мы рассчитаем стоимость и свяжемся с вами.
          </p>

          {/* Размер */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Размер столешницы</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`px-5 py-3 border text-sm transition-all duration-200 ${
                    size === s.id
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <span className="block font-medium">{s.label}</span>
                  <span className="block text-xs opacity-60 mt-0.5">{s.desc}</span>
                  {s.price > 0 && (
                    <span className={`block text-xs mt-1 font-medium ${size === s.id ? "opacity-80" : "text-amber-700"}`}>
                      +{s.price.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                  {s.id === "custom" && (
                    <span className="block text-xs mt-1 opacity-50">по запросу</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Покрытие */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Цвет / покрытие</h3>
            <div className="flex flex-wrap gap-3">
              {coatings.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCoating(c.id)}
                  className={`flex flex-col items-start px-5 py-3 border text-sm transition-all duration-200 ${
                    coating === c.id
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                      style={{ background: c.color }}
                    />
                    {c.label}
                  </span>
                  {c.price > 0 && (
                    <span className={`text-xs mt-1 ml-8 font-medium ${coating === c.id ? "opacity-80" : "text-amber-700"}`}>
                      +{c.price.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ножки */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Тип ножек</h3>
            <div className="flex flex-wrap gap-3">
              {legs.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLegsType(l.id)}
                  className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 ${
                    legsType === l.id
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <Icon name={l.icon} size={16} />
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Допы */}
          <div className="mb-12">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Дополнения</h3>
            <div className="flex flex-wrap gap-3">
              {extras.map(e => (
                <button
                  key={e.id}
                  onClick={() => toggleExtra(e.id)}
                  className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 ${
                    selectedExtras.includes(e.id)
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <Icon name={e.icon} size={16} />
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Калькулятор */}
          <div className="mb-10 border border-border p-6 bg-background/60">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-5">Расчёт стоимости</h3>
            {totalPrice === null ? (
              <p className="text-foreground text-sm">Стоимость рассчитывается индивидуально — свяжитесь с нами.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Базовая цена</span>
                  <span>{BASE_PRICE.toLocaleString("ru-RU")} ₽</span>
                </div>
                {sizePrice > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Размер {sizes.find(s => s.id === size)?.label}</span>
                    <span>+{sizePrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                )}
                {coatingPrice > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{coatings.find(c => c.id === coating)?.label}</span>
                    <span>+{coatingPrice.toLocaleString("ru-RU")} ₽</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                  <span className="font-medium text-foreground text-base">Итого</span>
                  <span className="text-2xl font-semibold text-foreground">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
            )}
          </div>

          {/* Контакты */}
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Ваши контакты</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
              <input
                type="tel"
                placeholder="Номер телефона"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
            </div>
          </div>

          {/* Итог */}
          <div className="border border-border p-6 bg-secondary/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Ваша конфигурация</p>
                <p className="text-foreground text-sm leading-relaxed">{summary}</p>
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
              <div className="mt-4 flex items-start gap-3 p-4 bg-foreground/5 border border-foreground/10">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Текст скопирован в буфер обмена</p>
                  <p className="text-xs text-muted-foreground">Вставьте его в чат мессенджера, который только что открылся:</p>
                  <p className="text-xs text-foreground mt-1 font-mono bg-border/40 px-2 py-1 rounded">{orderMessage}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
