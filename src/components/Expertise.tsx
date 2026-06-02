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
    <section id="services" ref={sectionRef} className="py-32 md:py-29 relative" style={{backgroundImage: 'url(https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/files/9571afe2-40e0-4c8e-bd55-e7b72f9bb06b.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-primary/85" />
      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Как мы делаем</p>
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
                className={`relative pl-8 border-l border-border transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`transition-all duration-1000 ${
                    visibleItems.includes(index) ? "animate-draw-stroke" : ""
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <Icon name={area.icon} size={40} className="mb-4 text-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-4">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}