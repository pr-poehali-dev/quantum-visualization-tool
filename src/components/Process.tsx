import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const steps = [
  {
    icon: "MessageSquare",
    title: "Заявка и обсуждение",
    description:
      "Вы оставляете заявку — мы уточняем размеры, форму, покрытие и особенности вашего пространства.",
  },
  {
    icon: "PenTool",
    title: "Эскиз и смета",
    description:
      "Готовим индивидуальный проект стола и фиксируем итоговую стоимость. Никаких скрытых доплат.",
  },
  {
    icon: "Hammer",
    title: "Ручное производство",
    description:
      "Мастер отбирает массив дуба и вручную создаёт ваш стол — от распила до финишного покрытия маслом.",
  },
  {
    icon: "Truck",
    title: "Доставка и сборка",
    description:
      "Бережно упаковываем, доставляем по всей России и при необходимости собираем стол у вас дома.",
  },
]

export function Process() {
  const [visible, setVisible] = useState<number[]>([])
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )
    refs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="process" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[10%] -right-1/4 w-[60%] h-[55%] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(ellipse, var(--gold) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-0.5 h-8 bg-[var(--gold)] shrink-0" />
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Как мы работаем</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-balance">
            Четыре шага до вашего стола
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              ref={(el) => { refs.current[index] = el }}
              data-index={index}
              className={`group relative p-8 rounded-xl bg-card border border-white/5 depth-card-dark depth-hover depth-edge transition-all duration-700 ${
                visible.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span
                className="absolute top-6 right-7 text-5xl font-bold leading-none select-none pointer-events-none"
                style={{ color: "var(--gold)", opacity: 0.12 }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div
                className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-lg"
                style={{ background: "linear-gradient(135deg, hsl(30 20% 18%) 0%, hsl(34 24% 10%) 100%)" }}
              >
                <Icon name={step.icon} size={26} style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Process
