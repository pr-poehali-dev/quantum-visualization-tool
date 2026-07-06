import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { ContactModal } from "./ContactModal"

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
          src="https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/files/ab756fc8-fbbc-4669-977d-2511c3dc117e.jpg"
          alt="Рабочий кабинет со столом из массива дуба"
          className="w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(25,15,6,0.55) 0%, rgba(30,18,8,0.35) 50%, rgba(20,12,5,0.45) 100%)",
          }}
        />
      </div>

      <div ref={contentRef} className="hidden" style={{ willChange: "transform" }} />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6">
        <p
          className="hero-reveal text-sm md:text-base tracking-[0.3em] uppercase text-center text-white/90 max-w-xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.6)", animationDelay: "0.1s" }}
        >
          {"Компьютерные и умные столы с регулировкой высоты"}
        </p>

        <h1
          ref={titleRef}
          className="hero-reveal hero-title hero-title-gold text-7xl text-balance text-center leading-[1.05] lg:text-[10rem]"
          style={{ animationDelay: "0.3s" }}
        >
          Русский <span className="hero-title-accent">Стол</span>
        </h1>

        <p
          className="hero-reveal text-base md:text-xl text-white text-center font-light max-w-lg leading-relaxed"
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