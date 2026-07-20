import { useState } from "react"
import { Link } from "react-router-dom"
import { Logo } from "./Logo"
import { ContactModal } from "./ContactModal"

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <>
    <footer className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent)", opacity: 0.5 }}
      />
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <Logo size={76} />
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Производство умных столов и компьютерных столов из массива дуба на заказ. Купить стол из дуба с доставкой по всей России — от 35 000 ₽.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4">Навигация</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Коллекция
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-foreground transition-colors">
                  Как мы делаем
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-4">Связь</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:russian_table@mail.ru" className="hover:text-foreground transition-colors">
                  russian_table@mail.ru
                </a>
              </li>
              <li>
                <button onClick={() => setContactOpen(true)} className="hover:text-foreground transition-colors">
                  Написать нам
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p>© 2026 Русский Стол. Все права защищены.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70">
            ИП Городничев Иван Андреевич · ИНН 781904681926 · ОГРНИП 326784700242304
          </p>
        </div>
      </div>
    </footer>
    <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}