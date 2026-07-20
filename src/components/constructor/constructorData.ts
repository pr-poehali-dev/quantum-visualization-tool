export const BASE_PRICE = 10000
export const LENGTH_BASE = 100
export const WIDTH_BASE = 60
export const PRICE_PER_10CM = 2000

export const coatings = [
  { id: "oil-natural", label: "Масло натуральное", color: "#d9ad5f", price: 0 },
  { id: "lacquer", label: "Лак матовый", color: "#e6c58e", price: 0 },
  { id: "oil-dark", label: "Морилка орех/лак", color: "#7a4a29", price: 2000 },
  { id: "mordant", label: "Морилка венге/лак", color: "#3a2416", price: 2000 },
]

export const legs = [
  { id: "metal-black", label: "Металл чёрный", icon: "Square", price: 10000, color: "#1c1c1e", adjustable: false },
  { id: "metal-white", label: "Металл белый", icon: "Square", price: 10000, color: "#e6e6e6", adjustable: false },
  { id: "height-adj-white", label: "Регулировка высоты белый", icon: "ArrowUpDown", price: 25000, color: "#e6e6e6", adjustable: true },
  { id: "height-adj-black", label: "Регулировка высоты чёрный", icon: "ArrowUpDown", price: 25000, color: "#1c1c1e", adjustable: true },
]

export const extras = [
  { id: "pc-hang", label: "Подвес для ПК", icon: "Monitor", price: 5000 },
  { id: "cable-tray", label: "Лоток для проводов", icon: "Cable", price: 5000 },
]

export function calcSizePrice(length: number, width: number) {
  const lengthSteps = Math.round((length - LENGTH_BASE) / 10)
  const widthSteps = Math.round((width - WIDTH_BASE) / 10)
  return (lengthSteps + widthSteps) * PRICE_PER_10CM
}

export function shade(hex: string, percent: number) {
  const n = parseInt(hex.replace("#", ""), 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(((n >> 16) & 255) + Math.round(255 * percent))
  const g = clamp(((n >> 8) & 255) + Math.round(255 * percent))
  const b = clamp((n & 255) + Math.round(255 * percent))
  return `rgb(${r}, ${g}, ${b})`
}

export const activeBtn =
  "rounded-lg border-[var(--gold)] bg-foreground text-background -translate-y-0.5 shadow-[0_6px_18px_rgba(201,168,76,0.35),0_0_0_1px_var(--gold),inset_0_1px_1px_rgba(255,255,255,0.5)]"
export const inactiveBtn =
  "rounded-lg border-white/10 text-white/80 bg-white/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)] hover:border-white/30 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_5px_14px_rgba(0,0,0,0.45)]"
