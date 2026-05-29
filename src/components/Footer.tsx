export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <svg width="52" height="36" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="1" y="28" fontFamily="serif" fontSize="32" fontWeight="700" fill="currentColor" letterSpacing="-4">Р</text>
              <text x="22" y="28" fontFamily="serif" fontSize="26" fontWeight="400" fill="currentColor" opacity="0.75">С</text>
              <text x="4" y="35" fontFamily="sans-serif" fontSize="6.5" fontWeight="400" fill="currentColor" opacity="0.45" letterSpacing="2.5">РУССКИЙ СТОЛ</text>
            </svg>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Производство столов из массива дуба. Ручная работа, натуральные материалы, доставка по всей России.
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
                <a href="mailto:hello@russkiy-stol.ru" className="hover:text-foreground transition-colors">
                  hello@russkiy-stol.ru
                </a>
              </li>
              <li>
                <a href="tel:+74951234567" className="hover:text-foreground transition-colors">
                  +7 (495) 123-45-67
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Телеграм
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  ВКонтакте
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Русский Стол. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}