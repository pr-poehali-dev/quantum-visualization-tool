import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { HighlightedText } from "./HighlightedText"
import { ContactModal } from "./ContactModal"

export function CallToAction() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <section
        id="contact"
        className="py-32 md:py-29 text-primary-foreground"
        style={{ background: "linear-gradient(135deg, hsl(25 20% 10%) 0%, var(--navy) 100%)" }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary-foreground/60 text-sm tracking-[0.3em] uppercase mb-8">Заказать стол</p>

            <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance">
              Ваш стол из дуба —
              <br />
              на <HighlightedText>века</HighlightedText>
            </h2>

            <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              Расскажите нам о своём пространстве — мы подберём размер, форму и покрытие. Каждый стол делается под конкретный дом.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setContactOpen(true)}
                className="btn-glow inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300 group"
                style={{ background: "var(--gold)", color: "#1a0f05" }}
              >
                Обсудить заказ
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => setContactOpen(true)}
                className="btn-glow-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
              >
                Написать нам
              </button>
            </div>
          </div>
        </div>
      </section>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}