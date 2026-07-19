import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { SiTelegram, SiVk, SiMax } from "react-icons/si"

const MAX_URL = "https://max.ru/u/f9LHodD0cOK0cpbAk71R9WDFAnOL6VH7GD8IA4Uzvcn0QVi1HEGl562uJc0"
const VK_URL = "https://vk.ru/club239485505"
const TELEGRAM_URL = "https://t.me/+79956236131"

interface ContactModalProps {
  open: boolean
  onClose: () => void
  message?: string
}

export function ContactModal({ open, onClose, message }: ContactModalProps) {
  const [agreed, setAgreed] = useState(false)

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

  useEffect(() => {
    if (open) setAgreed(false)
  }, [open])

  if (!open) return null

  const openMax = () => {
    if (!agreed) return
    if (message) navigator.clipboard.writeText(message).catch(() => {})
    window.open(MAX_URL, "_blank", "noopener,noreferrer")
    onClose()
  }

  const openVk = () => {
    if (!agreed) return
    if (message) navigator.clipboard.writeText(message).catch(() => {})
    window.open(VK_URL, "_blank", "noopener,noreferrer")
    onClose()
  }

  const openTelegram = () => {
    if (!agreed) return
    if (message) navigator.clipboard.writeText(message).catch(() => {})
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer")
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
        style={{ background: "linear-gradient(155deg, hsl(25 20% 10%) 0%, var(--navy) 160%)" }}
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

        {/* согласие */}
        <div className="px-4 pt-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)] cursor-pointer"
            />
            <span className="text-white/50 text-xs leading-relaxed">
              Я согласен на обработку персональных данных и принимаю{" "}
              <Link
                to="/privacy"
                target="_blank"
                className="text-white/80 underline hover:text-white transition-colors"
              >
                политику конфиденциальности
              </Link>
            </span>
          </label>
        </div>

        {/* кнопки */}
        <div className="p-4 space-y-2">
          <button
            onClick={openMax}
            disabled={!agreed}
            className="w-full flex items-center gap-4 px-5 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 group text-left disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: "#FFFFFF" }}>
              <SiMax size={20} color="#171717" />
            </span>
            <span className="flex flex-col">
              <span className="text-white font-medium text-sm">MAX</span>
              <span className="text-white/35 text-xs">Мессенджер от VK</span>
            </span>
            <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
          </button>

          <button
            onClick={openVk}
            disabled={!agreed}
            className="w-full flex items-center gap-4 px-5 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 group text-left disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: "#0077FF" }}>
              <SiVk size={18} color="#fff" />
            </span>
            <span className="flex flex-col">
              <span className="text-white font-medium text-sm">ВКонтакте</span>
              <span className="text-white/35 text-xs">Группа в ВК</span>
            </span>
            <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
          </button>

          <button
            onClick={openTelegram}
            disabled={!agreed}
            className="w-full flex items-center gap-4 px-5 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 group text-left disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ background: "#26A5E4" }}>
              <SiTelegram size={18} color="#fff" />
            </span>
            <span className="flex flex-col">
              <span className="text-white font-medium text-sm">Telegram</span>
              <span className="text-white/35 text-xs">+7 995 623-61-31</span>
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