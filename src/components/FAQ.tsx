import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Чем умный стол отличается от компьютерного?",
    answer:
      "Умный стол — это стол с электрическим подъёмным механизмом: высоту можно менять одной кнопкой от 70 до 120 см, что позволяет работать как сидя, так и стоя. Компьютерный стол — это стол на стационарном подстолье фиксированной высоты 75 см, без регулировки. Оба выполняются из массива дуба вручную.",
  },
  {
    question: "Из какого дуба вы делаете столы?",
    answer:
      "Используем российский черешчатый дуб из Воронежской и Тамбовской областей — это один из самых плотных и долговечных видов. Древесина проходит камерную сушку до влажности 8–10%, что исключает последующее растрескивание. Каждый умный и компьютерный стол из дуба получается по-настоящему живым.",
  },
  {
    question: "Сколько стоит купить умный и компьютерный стол из дуба?",
    answer:
      "Цены на умные и компьютерные столы из дуба начинаются от 35 000 ₽, с подъёмным механизмом — от 45 000 ₽. Итоговая стоимость зависит от размера, покрытия и дополнительных опций. Воспользуйтесь конструктором на сайте, чтобы рассчитать точную цену.",
  },
  {
    question: "Сколько времени занимает изготовление?",
    answer:
      "Стандартный умный и компьютерный стол из дуба изготавливается за 3–5 недель. С подъёмным механизмом — до 4 недель. Сроки зависят от размера и загрузки мастерской. После оплаты ставим ваш заказ в очередь и держим в курсе каждого этапа.",
  },
  {
    question: "Можно ли заказать стол нестандартного размера?",
    answer:
      "Да, мы делаем компьютерные и умные столы из дуба под любые размеры и форму — прямоугольные, с живым краем, с радиусными углами. Просто сообщите нужные параметры, и мы рассчитаем стоимость.",
  },
  {
    question: "Доставляете ли вы по всей России?",
    answer:
      "Да, доставляем в любой регион транспортными компаниями (СДЭК, ПЭК) или собственной доставкой по Санкт-Петербургу и ЛО. Купить стол из дуба и получить его в любом городе — это просто. Стол упаковывается в деревянную обрешётку и доедет целым даже в самый дальний уголок страны.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[5%] -left-1/4 w-[65%] h-[55%] rounded-full opacity-[0.12]" style={{ background: "radial-gradient(ellipse, var(--navy) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 -right-1/4 w-[55%] h-[45%] rounded-full opacity-[0.1]" style={{ background: "radial-gradient(ellipse, var(--navy) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="max-w-3xl mb-16 relative">
          <span className="absolute -top-8 right-0 text-[10rem] font-bold leading-none select-none pointer-events-none text-foreground/[0.04] lg:text-[14rem]">05</span>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-0.5 h-8 shrink-0" style={{ background: "linear-gradient(180deg, var(--gold) 0%, var(--navy) 100%)" }} />
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Вопросы</p>
          </div>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div className="max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl bg-card border border-white/5 overflow-hidden transition-all duration-500 depth-card-dark ${
                openIndex === index ? "depth-open" : ""
              }`}
              style={
                openIndex === index
                  ? { boxShadow: "0 10px 40px rgba(0,0,0,0.45), 0 0 0 1px var(--gold)" }
                  : undefined
              }
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-7 py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <span
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
                  style={
                    openIndex === index
                      ? { background: "var(--gold)" }
                      : { background: "rgba(191, 157, 84, 0.14)" }
                  }
                >
                  <Plus
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : "rotate-0"
                    }`}
                    style={{ color: openIndex === index ? "#1a0f05" : "var(--gold)" }}
                    strokeWidth={1.5}
                  />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed px-7 pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}