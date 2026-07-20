import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const reviews = [
  {
    name: "Александр М.",
    city: "Москва",
    text: "Заказывал умный стол в кабинет. Качество массива дуба превзошло ожидания — тяжёлый, монолитный, механизм подъёма работает идеально. Чувствуется ручная работа.",
    table: "Стол «Боярин»",
  },
  {
    name: "Елена и Дмитрий",
    city: "Санкт-Петербург",
    text: "Долго искали стол, который прослужит десятилетия. Мастер учёл все наши пожелания по размеру и покрытию. Стол стал сердцем нашей гостиной.",
    table: "Стол «Купец»",
  },
  {
    name: "Игорь В.",
    city: "Казань",
    text: "Отдельное спасибо за честную смету и сроки. Всё как договаривались, без доплат. Доставили аккуратно, собрали на месте. Рекомендую.",
    table: "Стол «Воевода»",
  },
]

export function Reviews() {
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
      { threshold: 0.25 },
    )
    refs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="reviews" className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(200deg, hsl(28 22% 7%) 0%, hsl(30 20% 10%) 100%)" }}>
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute bottom-0 -left-1/4 w-[55%] h-[50%] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, var(--gold) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-0.5 h-8 bg-[var(--gold)] shrink-0" />
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Отзывы клиентов</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-balance text-white">
            Нам доверяют семьи по всей России
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              ref={(el) => { refs.current[index] = el }}
              data-index={index}
              className={`relative p-8 rounded-xl bg-white/[0.04] border border-white/10 depth-card-dark depth-edge transition-all duration-700 flex flex-col ${
                visible.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span
                className="absolute -top-4 left-7 text-7xl font-serif leading-none select-none pointer-events-none"
                style={{ color: "var(--gold)", opacity: 0.25 }}
              >
                &ldquo;
              </span>

              <div className="flex gap-1 mb-5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={16} style={{ color: "var(--gold)", fill: "var(--gold)" }} />
                ))}
              </div>

              <p className="text-white/70 leading-relaxed text-sm mb-6 flex-1">{review.text}</p>

              <div className="pt-5 border-t border-white/10">
                <p className="text-white font-medium text-sm">{review.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/40 text-xs">{review.city}</span>
                  <span className="text-xs" style={{ color: "var(--gold)" }}>{review.table}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
