import { useEffect } from "react"
import { X } from "lucide-react"

const MAX_URL = "https://max.ru/u/f9LHodD0cOK0cpbAk71R9WDFAnOL6VH7GD8IA4Uzvcn0QVi1HEGl562uJc0"
const VK_URL = "https://vk.ru/club239485505"

interface ContactModalProps {
  open: boolean
  onClose: () => void
  message?: string
}

export function ContactModal({ open, onClose, message }: ContactModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  const openMax = () => {
    if (message) navigator.clipboard.writeText(message).catch(() => {})
    window.open(MAX_URL, "_blank", "noopener,noreferrer")
    onClose()
  }

  const openVk = () => {
    if (message) navigator.clipboard.writeText(message).catch(() => {})
    window.open(VK_URL, "_blank", "noopener,noreferrer")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* modal */}
      <div
        className="relative w-full sm:max-w-sm mx-4 mb-0 sm:mb-auto border border-white/10"
        style={{ background: "hsl(25 20% 10%)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* шапка */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>Написать нам</p>
            <p className="text-white text-base font-medium">Выберите мессенджер</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className="px-6 py-3 border-b border-white/10">
            <p className="text-[10px] tracking-wide uppercase text-white/30 mb-1">Будет скопировано</p>
            <p className="text-white/50 text-xs leading-relaxed line-clamp-3">{message}</p>
          </div>
        )}

        {/* кнопки */}
        <div className="p-4 space-y-2">
          <button
            onClick={openMax}
            className="w-full flex items-center gap-4 px-5 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 group text-left"
          >
            <span className="text-2xl">💬</span>
            <span className="flex flex-col">
              <span className="text-white font-medium text-sm">MAX</span>
              <span className="text-white/35 text-xs">Мессенджер от VK</span>
            </span>
            <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
          </button>

          <button
            onClick={openVk}
            className="w-full flex items-center gap-4 px-5 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 group text-left"
          >
            <span className="text-2xl">🔵</span>
            <span className="flex flex-col">
              <span className="text-white font-medium text-sm">ВКонтакте</span>
              <span className="text-white/35 text-xs">Группа в ВК</span>
            </span>
            <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-white/20 pb-5">
          {message ? "Текст заявки скопируется автоматически" : "Свяжемся в течение дня"}
        </p>
      </div>
    </div>
  )
}
