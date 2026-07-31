import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { api } from "@/lib/api"

const DEFAULTS: Record<string, string> = {
  hero_title: "Русский Стол",
  hero_subtitle: "Натуральная древесина + современные технологии — ваш идеальный стол",
  philosophy_title: "Мебель с душой дуба",
  philosophy_description:
    "Умный и компьютерный стол из дуба — это больше, чем мебель. Это место, где семья собирается каждый день. Мы делаем столы из массива дуба, которые становятся центром вашего дома на десятилетия.",
  cta_title: "Ваш стол из дуба — на века",
  cta_description:
    "Расскажите нам о своём пространстве — мы подберём размер, форму и покрытие. Каждый стол делается под конкретный дом.",
}

type SiteContentContextType = {
  content: Record<string, string>
  get: (key: string) => string
  refresh: () => Promise<void>
}

const SiteContentContext = createContext<SiteContentContextType | null>(null)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>(DEFAULTS)

  const refresh = async () => {
    try {
      const { content: loaded } = await api.getContent()
      setContent({ ...DEFAULTS, ...loaded })
    } catch {
      // молча используем дефолты
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const get = (key: string) => content[key] ?? DEFAULTS[key] ?? ""

  return (
    <SiteContentContext.Provider value={{ content, get, refresh }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider")
  return ctx
}
