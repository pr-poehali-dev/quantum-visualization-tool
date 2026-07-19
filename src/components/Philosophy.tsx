import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"

const philosophyItems = [
  {
    title: "Только массив дуба",
    description:
      "Мы работаем исключительно с отборным российским дубом. Никакого МДФ, никакого шпона — если вы хотите купить стол из дуба на века, это именно то дерево.",
  },
  {
    title: "Ручная работа",
    description:
      "Каждый умный и компьютерный стол из дуба проходит через руки мастера. Мы не используем конвейер — только ручная обработка, шлифовка и финишное покрытие натуральными маслами.",
  },
  {
    title: "Характер дерева",
    description:
      "Сучки, текстура, живые края — мы не скрываем природу дуба, а подчёркиваем её. Купить умный и компьютерный стол из дуба у нас — значит получить вещь с характером, уникальную как отпечаток пальца.",
  },
  {
    title: "Вековая прочность",
    description: "Дуб — одна из самых твёрдых пород дерева. Умный и компьютерный стол из массива дуба, сделанный сегодня, станет семейной реликвией для следующего поколения.",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
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
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-32 md:py-29 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.1]">
        <div className="absolute top-[10%] -left-10 w-[140%] h-16 -rotate-6" style={{ background: "linear-gradient(90deg, transparent, var(--navy) 25%, var(--navy) 75%, transparent)" }} />
        <div className="absolute bottom-[15%] -left-10 w-[140%] h-10 rotate-3" style={{ background: "linear-gradient(90deg, transparent, var(--navy) 25%, var(--navy) 75%, transparent)" }} />
        <div className="absolute top-1/2 -left-10 w-[140%] h-4 -rotate-2" style={{ background: "linear-gradient(90deg, transparent, var(--navy) 25%, var(--navy) 75%, transparent)" }} />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-32 lg:self-start relative">
            <span className="absolute -top-8 right-0 text-[6rem] sm:text-[10rem] font-bold leading-none select-none pointer-events-none text-foreground/[0.04] lg:text-[14rem]">01</span>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-0.5 h-8 shrink-0" style={{ background: "linear-gradient(180deg, var(--gold) 0%, var(--navy) 100%)" }} />
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Наша философия</p>
            </div>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Мебель с
              <br />
              <HighlightedText>душой дуба</HighlightedText>
            </h2>

            <div className="relative hidden lg:block">
              <img
                src="https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/files/c4f8b578-e721-441c-88f0-928cd0d37d90.jpg"
                alt="Текстура массива дуба"
                className="opacity-90 relative z-10 w-auto"
              />
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              Умный и компьютерный стол из дуба — это больше, чем мебель. Это место, где семья собирается каждый день. Мы делаем столы из массива дуба, которые становятся центром вашего дома на десятилетия.
            </p>

            {philosophyItems.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="text-sm font-semibold" style={{ color: "var(--navy-light)" }}>0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}