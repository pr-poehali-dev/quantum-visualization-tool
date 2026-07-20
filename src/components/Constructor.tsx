import { useState } from "react"
import { ContactModal } from "./ContactModal"
import { BASE_PRICE, coatings, legs, extras, calcSizePrice } from "./constructor/constructorData"
import { OptionsPanel } from "./constructor/OptionsPanel"
import { SummaryPanel } from "./constructor/SummaryPanel"

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
            <OptionsPanel
              length={length}
              setLength={setLength}
              width={width}
              setWidth={setWidth}
              coating={coating}
              setCoating={setCoating}
              legsType={legsType}
              setLegsType={setLegsType}
              selectedExtras={selectedExtras}
              toggleExtra={toggleExtra}
              sizePrice={sizePrice}
            />

            {/* ПРАВАЯ ПАНЕЛЬ — итог, sticky */}
            <SummaryPanel
              selectedCoating={selectedCoating}
              selectedLegs={selectedLegs}
              length={length}
              width={width}
              sizePrice={sizePrice}
              coatingPrice={coatingPrice}
              legsPrice={legsPrice}
              extrasPrice={extrasPrice}
              totalPrice={totalPrice}
              sizeLabel={sizeLabel}
              coatingLabel={coatingLabel}
              summary={summary}
              orderMessage={orderMessage}
              copied={copied}
              setCopied={setCopied}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              handleOrder={handleOrder}
            />
          </div>

        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} message={orderMessage} />
    </section>
  )
}
