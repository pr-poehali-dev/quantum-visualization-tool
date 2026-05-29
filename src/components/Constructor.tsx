import { useState } from "react"
import { ArrowRight } from "lucide-react"
import Icon from "@/components/ui/icon"

const sizes = [
  { id: "120x70", label: "120 × 70 см", desc: "Компактный" },
  { id: "140x80", label: "140 × 80 см", desc: "Стандарт" },
  { id: "160x80", label: "160 × 80 см", desc: "Просторный" },
  { id: "180x90", label: "180 × 90 см", desc: "Большой" },
  { id: "custom", label: "Свой размер", desc: "Под заказ" },
]

const coatings = [
  { id: "oil-natural", label: "Масло натуральное", color: "#c9a060" },
  { id: "oil-dark", label: "Масло тёмное", color: "#6b4226" },
  { id: "oil-white", label: "Масло белое", color: "#f0ebe3" },
  { id: "lacquer", label: "Лак матовый", color: "#d4b483" },
  { id: "mordant", label: "Морилка венге", color: "#2c1a0e" },
]

const legs = [
  { id: "metal-black", label: "Металл чёрный", icon: "Square" },
  { id: "metal-chrome", label: "Металл хром", icon: "Square" },
  { id: "wood", label: "Дерево дуб", icon: "TreePine" },
  { id: "height-adj", label: "Регулировка высоты", icon: "ArrowUpDown" },
]

const extras = [
  { id: "pc-stand", label: "Подставка для ПК", icon: "Monitor" },
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

export function Constructor() {
  const [size, setSize] = useState("140x80")
  const [coating, setCoating] = useState("oil-natural")
  const [legsType, setLegsType] = useState("metal-black")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const summary = buildSummary(size, coating, legsType, selectedExtras)
  const messageText = encodeURIComponent(`Привет! Хочу заказать стол. ${summary}`)
  const maxUrl = `https://max.ru/u/f9LHodD0cOK0cpbAk71R9WDFAnOL6VH7GD8IA4Uzvcn0QVi1HEGl562uJc0`

  return (
    <section id="constructor" className="py-24 md:py-32 bg-background">
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
                  className={`flex items-center gap-3 px-5 py-3 border text-sm transition-all duration-200 ${
                    coating === c.id
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                    style={{ background: c.color }}
                  />
                  {c.label}
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

          {/* Итог */}
          <div className="border border-border p-6 bg-secondary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Ваша конфигурация</p>
              <p className="text-foreground text-sm leading-relaxed">{summary}</p>
            </div>
            <a
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-3 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90 group"
              style={{ background: "var(--gold, #c9a84c)", color: "#1a0f05" }}
            >
              Обсудить заказ
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}