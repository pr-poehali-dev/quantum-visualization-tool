import { useEffect, useRef, useState } from "react"
import { ArrowDown, Heart } from "lucide-react"
import Icon from "@/components/ui/icon"
import { ContactModal } from "./ContactModal"

const heroImageDesktop = "/assets/hero-desk-desktop.jpg"
const heroImageMobile = "/assets/hero-desk-mobile.jpg"

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const accumulatedScrollRef = useRef(0)
  const touchStartY = useRef<number>(0)
  const lastTouchY = useRef<number>(0)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const atTopOfPage = window.scrollY === 0

      if (atTopOfPage && !animationComplete) {
        e.preventDefault()

        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + e.deltaY))

        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)

        if (newProgress >= 1) {
          setAnimationComplete(true)
        }

        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      } else if (atTopOfPage && animationComplete && e.deltaY < 0) {
        e.preventDefault()

        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + e.deltaY))

        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)

        if (newProgress < 1) {
          setAnimationComplete(false)
        }

        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      lastTouchY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const atTopOfPage = window.scrollY === 0
      const currentTouchY = e.touches[0].clientY
      const deltaY = lastTouchY.current - currentTouchY

      if (atTopOfPage && !animationComplete) {
        e.preventDefault()

        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + deltaY * 3))

        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)

        if (newProgress >= 1) {
          setAnimationComplete(true)
        }

        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      } else if (atTopOfPage && animationComplete && deltaY < 0) {
        e.preventDefault()

        accumulatedScrollRef.current = Math.max(0, Math.min(700, accumulatedScrollRef.current + deltaY * 3))

        const newProgress = Math.max(0, Math.min(1, accumulatedScrollRef.current / 700))
        setAnimationProgress(newProgress)

        if (newProgress < 1) {
          setAnimationComplete(false)
        }

        if (contentRef.current) {
          const translateY = newProgress * 200
          const rotationX = newProgress * 45
          const scale = 1 - newProgress * 0.3
          contentRef.current.style.transform = `translateY(${translateY}px) rotateX(${rotationX}deg) scale(${scale})`
        }
      }

      lastTouchY.current = currentTouchY
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [animationComplete])

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

      <div ref={contentRef} className="hidden" style={{ willChange: "transform" }} />

      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-4 md:gap-6 px-6 md:px-12 lg:pl-24">
        <h1
          ref={titleRef}
          className="text-blur-behind hero-reveal hero-title hero-title-gold text-balance text-left leading-[1.05]"
          style={{ animationDelay: "0.3s", fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
        >
          Русский <span className="hero-title-accent">Стол</span>
        </h1>

        <p
          className="text-blur-behind text-blur-behind-strong hero-reveal mt-4 md:mt-24 text-sm md:text-xl text-white text-left font-light max-w-md leading-relaxed"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)", animationDelay: "0.5s" }}
        >
          Натуральная древесина + современные технологии — ваш идеальный стол
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
          className="hero-reveal mt-4 md:mt-10 flex flex-wrap gap-x-5 md:gap-x-8 gap-y-3 md:gap-y-4"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { icon: "UserCheck", label: "Индивидуальный подход" },
            { icon: "Factory", label: "Собственное производство" },
            { icon: "ShieldCheck", label: "Прочность и надёжность" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 md:gap-2.5">
              <span
                className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full shrink-0"
                style={{ background: "rgba(232,200,122,0.15)", border: "1px solid rgba(232,200,122,0.4)" }}
              >
                <Icon name={s.icon} size={14} className="md:w-4 md:h-4" style={{ color: "#e8c87a" }} />
              </span>
              <span
                className="text-[11px] md:text-sm text-white/85 max-w-[100px] md:max-w-[110px] leading-tight"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-reveal hidden md:block absolute bottom-8 right-6 md:bottom-12 md:right-12 z-20 max-w-[240px]" style={{ animationDelay: "1.1s" }}>
        <div
          className="gold-frame px-5 py-4 backdrop-blur-sm"
          style={{ background: "rgba(12,8,4,0.55)" }}
        >
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#e8c87a", fill: "#e8c87a" }} />
            <p className="text-white/85 text-xs leading-relaxed">
              <span className="font-semibold" style={{ color: "#e8c87a" }}>10%</span> дохода компании мы направляем на благотворительность
            </p>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {animationComplete && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </section>
  )
}