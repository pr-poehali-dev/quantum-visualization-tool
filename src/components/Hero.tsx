import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"
import { useSiteContent } from "@/context/SiteContentContext"

const heroImageDesktop = "/assets/hero-desk-desktop.jpg"
const heroImageMobile = "/assets/hero-desk-mobile.jpg"

export function Hero() {
  const { get } = useSiteContent()
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [showArrow, setShowArrow] = useState(true)

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY < 100)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="hero" ref={heroRef} className="relative min-h-[100svh] md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture className="absolute inset-0 block w-full h-full">
          <source media="(max-width: 767px)" srcSet={heroImageMobile} />
          <source media="(min-width: 768px)" srcSet={heroImageDesktop} />
          <img
            src={heroImageDesktop}
            alt="Рабочий кабинет со столом из массива дуба"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.92) contrast(1.05)" }}
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(12,8,4,0.62) 0%, rgba(16,10,5,0.45) 50%, rgba(8,5,2,0.68) 100%)",
          }}
        />
        {/* мягкий тёплый свет сверху */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 55% at 50% 8%, rgba(255,246,224,0.28) 0%, transparent 60%)",
          }}
        />
        {/* световое пятно слева */}
        <div
          className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none animate-glow-float"
          style={{
            background: "radial-gradient(circle, rgba(255,240,205,0.22) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* световое пятно справа */}
        <div
          className="absolute bottom-0 -right-20 w-[440px] h-[440px] rounded-full pointer-events-none animate-glow-float"
          style={{
            background: "radial-gradient(circle, rgba(232,200,116,0.18) 0%, transparent 70%)",
            filter: "blur(24px)",
            animationDelay: "1.5s",
          }}
        />
        {/* тёмно-синий акцент снизу */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, var(--navy) 0%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </div>

      {/* парящие светлые частицы */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {[
          { left: "12%", top: "28%", size: 6, delay: "0s", dur: "7s" },
          { left: "80%", top: "22%", size: 5, delay: "1.2s", dur: "8s" },
          { left: "65%", top: "70%", size: 8, delay: "0.6s", dur: "9s" },
          { left: "30%", top: "78%", size: 4, delay: "2s", dur: "6.5s" },
          { left: "50%", top: "18%", size: 5, delay: "3s", dur: "8.5s" },
          { left: "90%", top: "60%", size: 6, delay: "1.8s", dur: "7.5s" },
          { left: "18%", top: "52%", size: 5, delay: "0.4s", dur: "7.8s" },
          { left: "42%", top: "42%", size: 3, delay: "2.6s", dur: "6.2s" },
          { left: "58%", top: "30%", size: 7, delay: "1.6s", dur: "9.4s" },
          { left: "72%", top: "48%", size: 4, delay: "3.4s", dur: "8.2s" },
          { left: "8%", top: "68%", size: 6, delay: "1.1s", dur: "7.3s" },
          { left: "95%", top: "35%", size: 4, delay: "2.9s", dur: "8.7s" },
          { left: "36%", top: "12%", size: 5, delay: "0.9s", dur: "6.8s" },
          { left: "84%", top: "82%", size: 6, delay: "2.3s", dur: "9.1s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-particle-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, rgba(255,248,230,0.9) 0%, rgba(255,240,205,0.3) 60%, transparent 100%)",
              boxShadow: "0 0 8px rgba(255,244,214,0.6)",
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-4 md:gap-6 px-6 md:px-12 lg:pl-24">
        <h1
          ref={titleRef}
          className="text-blur-behind hero-reveal hero-title hero-title-gold text-balance text-left leading-[1.05]"
          style={{ animationDelay: "0.3s", fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
        >
          {(() => {
            const words = get("hero_title").split(" ")
            const last = words.pop()
            return (
              <>
                {words.join(" ")} <span className="hero-title-accent">{last}</span>
              </>
            )
          })()}
        </h1>

        <p
          className="text-blur-behind text-blur-behind-strong hero-reveal mt-4 md:mt-24 text-base md:text-xl text-white text-left font-light max-w-md leading-relaxed"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)", animationDelay: "0.5s" }}
        >
          {get("hero_subtitle")}
        </p>

        <div className="hero-reveal mt-2 md:mt-6" style={{ animationDelay: "0.7s" }}>
          <button
            onClick={() => setContactOpen(true)}
            className="btn-glow btn-glow-pulse inline-flex items-center gap-3 px-7 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm tracking-widest uppercase font-medium transition-all duration-300"
            style={{ background: "#c9a84c", color: "#1a0f05" }}
          >
            Заказать стол
          </button>
        </div>

        <div
          className="hero-reveal mt-5 md:mt-10 flex flex-col gap-2.5 md:flex md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-4"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { icon: "UserCheck", label: "Индивидуальный подход" },
            { icon: "Factory", label: "Собственное производство в Санкт-Петербурге" },
            { icon: "ShieldCheck", label: "Прочность и надёжность" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0"
                style={{ background: "rgba(232,200,122,0.15)", border: "1px solid rgba(232,200,122,0.4)" }}
              >
                <Icon name={s.icon} size={15} className="md:w-4 md:h-4" style={{ color: "#e8c87a" }} />
              </span>
              <span
                className="text-sm md:text-sm text-white/85 leading-tight"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* преимущества — компактной строкой на мобильных, панелью справа снизу на десктопе */}
        <div
          className="hero-reveal grid grid-cols-3 gap-2 mt-4 w-full max-w-md md:hidden"
          style={{ animationDelay: "1.1s" }}
        >
          {[
            { icon: "Truck", label: "Доставка по РФ" },
            { icon: "Leaf", label: "Массив дуба" },
            { icon: "Clock", label: "От 14 дней" },
          ].map((p) => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-1.5 text-center px-2 py-3 rounded-lg backdrop-blur-sm"
              style={{ background: "rgba(12,8,4,0.5)", border: "1px solid rgba(232,200,122,0.3)" }}
            >
              <Icon name={p.icon} size={18} style={{ color: "#e8c87a" }} />
              <p className="text-white/85 text-[11px] leading-tight font-medium">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-reveal hidden md:block absolute bottom-8 right-6 md:bottom-12 md:right-12 z-20 max-w-[260px]" style={{ animationDelay: "1.1s" }}>
        <div
          className="gold-frame px-5 py-4 backdrop-blur-sm"
          style={{ background: "rgba(12,8,4,0.55)" }}
        >
          <div className="space-y-2.5">
            {[
              { icon: "Truck", label: "Доставка по всей России" },
              { icon: "Leaf", label: "Экологичный массив дуба" },
              { icon: "Clock", label: "Изготовление от 14 дней" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <Icon name={p.icon} size={16} className="shrink-0" style={{ color: "#e8c87a" }} />
                <p className="text-white/85 text-xs leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {showArrow && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </section>
  )
}