import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { ContactModal } from "./ContactModal"
import heroImage from "@/assets/hero-desk.jpg"

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
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Рабочий кабинет со столом из массива дуба"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(1.18) contrast(0.97)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(25,15,6,0.32) 0%, rgba(30,18,8,0.18) 50%, rgba(20,12,5,0.28) 100%)",
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

      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center gap-6 px-6 md:px-12 lg:pl-24">
        <h1
          ref={titleRef}
          className="text-blur-behind hero-reveal hero-title hero-title-gold text-balance text-left leading-[1.05]"
          style={{ animationDelay: "0.3s", fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          Русский <span className="hero-title-accent">Стол</span>
        </h1>

        <p
          className="text-blur-behind text-blur-behind-strong hero-reveal mt-24 text-base md:text-xl text-white text-left font-light max-w-md leading-relaxed"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)", animationDelay: "0.5s" }}
        >
          Натуральная древесина + современные технологии — ваш идеальный стол
        </p>

        <div className="hero-reveal mt-6" style={{ animationDelay: "0.7s" }}>
          <button
            onClick={() => setContactOpen(true)}
            className="btn-glow btn-glow-pulse inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm tracking-widest uppercase font-medium transition-all duration-300"
            style={{ background: "#c9a84c", color: "#1a0f05" }}
          >
            Заказать стол
          </button>
        </div>

        <div
          className="hero-reveal mt-10 flex flex-wrap gap-x-10 gap-y-5"
          style={{ animationDelay: "0.9s" }}
        >
          {[
            { value: "12", label: "лет опыта" },
            { value: "500+", label: "столов создано" },
            { value: "100%", label: "массив дуба" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span
                className="text-3xl md:text-4xl font-semibold tabular-nums"
                style={{ color: "#e8c87a", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
              >
                {s.value}
              </span>
              <span
                className="text-[11px] md:text-xs tracking-[0.15em] uppercase text-white/70 mt-1"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
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