import { useState, useEffect, MouseEvent } from "react"
import { cn } from "../lib/utils"
import { Logo } from "./Logo"
import { ContactModal } from "./ContactModal"
import Icon from "./ui/icon"

const navItems = [
  { label: "Главная", href: "#hero" },
  { label: "О нас", href: "#about" },
  { label: "Работы", href: "#projects" },
  { label: "Процесс", href: "#services" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50) }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const ids = ["hero", "about", "projects", "services", "constructor", "faq"]

    let ticking = false
    const updateActive = () => {
      ticking = false
      const line = window.innerHeight * 0.3
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= line) current = id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateActive)
      }
    }

    updateActive()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <header
        className={cn(
          "fixed z-50 transition-all duration-500 my-0 py-0 rounded-none",
          scrolled || mobileMenuOpen
            ? "backdrop-blur-md py-2.5 md:py-4 top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 rounded-xl md:rounded-2xl border-2 border-[var(--gold)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_6px_rgba(201,168,76,0.12),0_0_28px_rgba(201,168,76,0.35)]"
            : "bg-transparent py-3 md:py-4 top-0 left-0 right-0 border border-transparent",
        )}
        style={scrolled || mobileMenuOpen ? { background: "linear-gradient(120deg, hsl(25 18% 14%) 0%, var(--navy) 145%)" } : undefined}
      >
        <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between md:px-[24]">
          <a
            href="/"
            className={cn(
              "group transition-all duration-500 scale-75 md:scale-100 origin-left",
              scrolled || mobileMenuOpen ? "-ml-3" : "ml-0",
            )}
            onClick={scrollToTop}
          >
            <Logo size={64} />
          </a>

          <ul className="hidden md:flex items-center gap-3 text-sm tracking-wide">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "")
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={cn(
                      "inline-block whitespace-nowrap px-4 py-2 rounded-md border transition-all duration-300",
                      isActive
                        ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[#e8c87a] shadow-[0_0_14px_rgba(201,168,76,0.35)]"
                        : "border-white/15 text-white hover:text-[#e8c87a] hover:border-[var(--gold)]/60 hover:bg-white/[0.04]",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
            <li>
              <a
                href="#constructor"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  activeSection === "constructor" ? "" : "btn-glow",
                )}
                style={{ background: "var(--gold)", color: "#1a0f05" }}
              >
                Конструктор
              </a>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <a
              href="mailto:russian_table@mail.ru"
              aria-label="Написать на почту"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              <Icon name="Mail" size={18} />
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className={cn(
                "inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all duration-300",
                "bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white",
              )}
            >
              Связаться
            </button>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            {!mobileMenuOpen && (
              <>
                <a
                  href="#constructor"
                  aria-label="Конструктор"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ background: "var(--gold)", color: "#1a0f05" }}
                >
                  <Icon name="Hammer" size={16} />
                </a>
                <a
                  href="mailto:russian_table@mail.ru"
                  aria-label="Написать на почту"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 transition-all duration-300"
                >
                  <Icon name="Mail" size={16} />
                </a>
                <button
                  onClick={() => setContactOpen(true)}
                  aria-label="Связаться"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 transition-all duration-300"
                >
                  <Icon name="MessageCircle" size={16} />
                </button>
              </>
            )}

            <button
              className="z-50 transition-colors duration-300 text-white p-1.5"
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {!mobileMenuOpen && (
          <div className="md:hidden container mx-auto px-4 pt-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "")
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-xs text-center py-1.5 px-2 rounded-md border transition-all duration-300",
                      isActive
                        ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[#e8c87a]"
                        : "border-white/15 text-white/80",
                    )}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>
        )}

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-4">
            <ul className="flex flex-col gap-1 mb-4 border-t border-white/10 pt-3">
              {[
                { label: "Главная", href: "#hero" },
                { label: "О нас", href: "#about" },
                { label: "Работы", href: "#projects" },
                { label: "Процесс", href: "#services" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => {
                const isActive = activeSection === item.href.replace("#", "")
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={cn(
                        "transition-colors duration-300 text-lg font-light block py-2 px-2 rounded-lg",
                        isActive ? "text-[#e8c87a] bg-[var(--gold)]/10" : "text-white hover:text-[#e8c87a]",
                      )}
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-3 pb-4">
              <a
                href="#constructor"
                className="btn-glow flex-1 text-center px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300"
                style={{ background: "var(--gold)", color: "#1a0f05" }}
                onClick={closeMobileMenu}
              >
                Конструктор
              </a>
              <button
                onClick={() => { closeMobileMenu(); setContactOpen(true) }}
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 rounded-full bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white transition-all duration-300"
              >
                Связаться
              </button>
            </div>
          </div>
        </div>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}