import { ArrowRight, Check, Copy } from "lucide-react"
import { BASE_PRICE } from "./constructorData"

export function SummaryPanel({
  sizePrice,
  coatingPrice,
  legsPrice,
  extrasPrice,
  totalPrice,
  sizeLabel,
  coatingLabel,
  summary,
  orderMessage,
  copied,
  setCopied,
  name,
  setName,
  phone,
  setPhone,
  handleOrder,
}: {
  sizePrice: number
  coatingPrice: number
  legsPrice: number
  extrasPrice: number
  totalPrice: number
  sizeLabel: string
  coatingLabel: string
  summary: string
  orderMessage: string
  copied: boolean
  setCopied: (v: boolean) => void
  name: string
  setName: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  handleOrder: () => void
}) {
  return (
    <div className="md:sticky md:top-8 space-y-2">

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
  )
}