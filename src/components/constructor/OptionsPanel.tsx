import Icon from "@/components/ui/icon"
import { coatings, legs, extras, activeBtn, inactiveBtn } from "./constructorData"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-4" style={{ color: "var(--gold)" }}>
      {children}
    </p>
  )
}

export function OptionsPanel({
  length,
  setLength,
  width,
  setWidth,
  coating,
  setCoating,
  legsType,
  setLegsType,
  selectedExtras,
  toggleExtra,
  sizePrice,
}: {
  length: number
  setLength: (v: number) => void
  width: number
  setWidth: (v: number) => void
  coating: string
  setCoating: (v: string) => void
  legsType: string
  setLegsType: (v: string) => void
  selectedExtras: string[]
  toggleExtra: (id: string) => void
  sizePrice: number
}) {
  return (
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
              className={`flex items-center gap-2.5 px-3 py-2.5 border text-xs text-left transition-all duration-200 ${coating === c.id ? activeBtn : inactiveBtn}`}>
              <span
                className="w-6 h-6 rounded-full shrink-0 border-2 border-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.5)]"
                style={{ background: c.color }}
              />
              <span className="flex flex-col items-start min-w-0">
                <span className="leading-tight">{c.label}</span>
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
              className={`flex items-center gap-2.5 px-3 py-2.5 border text-xs text-left transition-all duration-200 ${legsType === l.id ? activeBtn : inactiveBtn}`}>
              <Icon name={l.icon} size={15} className="shrink-0" />
              <span className="flex flex-col items-start min-w-0">
                <span className="leading-tight">{l.label}</span>
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
              className={`flex items-center gap-2.5 px-3 py-2.5 border text-xs text-left transition-all duration-200 ${selectedExtras.includes(e.id) ? activeBtn : inactiveBtn}`}>
              <Icon name={e.icon} size={15} className="shrink-0" />
              <span className="flex flex-col items-start min-w-0">
                <span className="leading-tight">{e.label}</span>
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
  )
}