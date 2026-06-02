import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Из какого дуба вы делаете столы?",
    answer:
      "Используем российский черешчатый дуб из Воронежской и Тамбовской областей — это один из самых плотных и долговечных видов. Древесина проходит камерную сушку до влажности 8–10%, что исключает последующее растрескивание.",
  },
  {
    question: "Сколько времени занимает изготовление?",
    answer:
      "Стандартный обеденный стол изготавливается за 3–5 недель. Сроки зависят от размера, сложности формы и загрузки мастерской. После оплаты мы сразу ставим ваш заказ в очередь и держим в курсе каждого этапа.",
  },
  {
    question: "Можно ли заказать стол нестандартного размера?",
    answer:
      "Да, мы делаем столы под любые размеры и форму — прямоугольные, круглые, с живым краем, с радиусными углами. Просто сообщите нужные параметры, и мы рассчитаем стоимость.",
  },
  {
    question: "Какое покрытие вы используете?",
    answer:
      "По умолчанию — датское масло Rubio Monocoat, которое глубоко проникает в волокна и не образует плёнки на поверхности. Также доступны лак (матовый и глянцевый) и масло-воск. Каждое покрытие имеет свои плюсы — расскажем подробнее при заказе.",
  },
  {
    question: "Доставляете ли вы по всей России?",
    answer:
      "Да, доставляем в любой регион транспортными компаниями (СДЭК, ПЭК) или собственной доставкой по Санкт-Петербургу и ЛО. Стол упаковывается в деревянную обрешётку — доедет целым даже в самый дальний уголок страны.",
  },
  {
    question: "Как оформить заказ?",
    answer:
      "Напишите нам в мессенджер или позвоните — обсудим размер, форму, покрытие и ножки. После согласования высылаем договор и счёт на предоплату 50%. Остаток оплачивается перед отправкой.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}