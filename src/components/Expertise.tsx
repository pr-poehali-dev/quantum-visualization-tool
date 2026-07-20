import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"
import { HighlightedText } from "./HighlightedText"

const expertiseAreas = [
  {
    title: "Подбор древесины",
    description: "Отбираем доски вручную — только плотный, хорошо высушенный дуб без трещин и пороков. Каждая доска проходит многомесячную выдержку на складе.",
    icon: "Ruler",
  },
  {
    title: "Столярная обработка",
    description:
      "Фугование, строгание, склейка щита — всё вручную. Шипы, пазы и соединения делаются с допуском до 0,1 мм, чтобы стол не «гулял» десятилетиями.",
    icon: "Flame",
  },
  {
    title: "Финишное покрытие",
    description:
      "Используем натуральные масла и воски датского и немецкого производства. Покрытие подчёркивает текстуру дуба и защищает от влаги и пятен.",
    icon: "Droplets",
  },
  {
    title: "Доставка и сборка",
    description:
      "Упаковываем столы в мягкую обрешётку и доставляем по всей России. Мастер приедет и установит стол на месте, отрегулирует ножки.",
    icon: "Package",
  },
]

export function Expertise() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="py-32 md:py-29 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 -right-1/4 w-[70%] h-[60%] rounded-full opacity-[0.12]" style={{ background: "radial-gradient(ellipse, var(--navy) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[5%] -left-1/4 w-[60%] h-[50%] rounded-full opacity-[0.1]" style={{ background: "radial-gradient(ellipse, var(--navy) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="max-w-3xl mb-20 relative">
          <span className="absolute -top-8 right-0 text-[6rem] sm:text-[10rem] font-bold leading-none select-none pointer-events-none text-foreground/[0.04] lg:text-[14rem]">03</span>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-0.5 h-8 shrink-0" style={{ background: "linear-gradient(180deg, var(--gold) 0%, var(--navy) 100%)" }} />
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Как мы делаем</p>
          </div>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
            <HighlightedText>Мастерство</HighlightedText>, проверенное
            <br />
            временем
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Каждый стол проходит четыре этапа — от выбора бревна до доставки в ваш дом. Без спешки, без компромиссов по качеству.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {expertiseAreas.map((area, index) => (
              <div
                key={area.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`group relative p-8 rounded-xl bg-card gold-frame depth-card-dark depth-hover depth-edge transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <span
                  className="absolute top-6 right-7 text-5xl font-bold leading-none select-none pointer-events-none transition-opacity duration-500"
                  style={{ color: "var(--gold)", opacity: 0.1 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 mb-5 rounded-lg transition-all duration-500 ${
                    visibleItems.includes(index) ? "animate-draw-stroke" : ""
                  }`}
                  style={{
                    background: "linear-gradient(135deg, hsl(30 20% 18%) 0%, hsl(34 24% 10%) 100%)",
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <Icon name={area.icon} size={26} style={{ color: "var(--gold)" }} />
                </div>
                <h3 className="text-xl font-medium mb-3">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}