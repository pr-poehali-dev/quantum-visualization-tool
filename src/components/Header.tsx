import { useState, useEffect, MouseEvent } from "react"
import { cn } from "../lib/utils"
import { Logo } from "./Logo"
import { ContactModal } from "./ContactModal"

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
            ? "bg-primary backdrop-blur-md py-4 top-4 left-4 right-4 rounded-2xl border-2 border-[var(--gold)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_6px_rgba(201,168,76,0.12),0_0_28px_rgba(201,168,76,0.35)]"
            : "bg-transparent py-4 top-0 left-0 right-0 border border-transparent",
        )}
      >
        <nav className="container mx-auto px-6 flex items-center justify-between md:px-[24]">
          <a
            href="/"
            className={cn(
              "group transition-all duration-500",
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

          <button
            onClick={() => setContactOpen(true)}
            className={cn(
              "hidden md:inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all duration-300",
              "bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white",
            )}
          >
            Связаться
          </button>

          <button
            className="md:hidden z-50 transition-colors duration-300 text-white"
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </nav>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-6">
            <ul className="flex flex-col gap-6 mb-8">
              {[
                { label: "Главная", href: "#hero" },
                { label: "О нас", href: "#about" },
                { label: "Работы", href: "#projects" },
                { label: "Процесс", href: "#services" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-[#e8c87a] transition-colors duration-300 text-white text-4xl font-light block"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#constructor"
                  className="btn-glow inline-block px-6 py-2 text-2xl font-medium rounded-full transition-all duration-300"
                  style={{ background: "var(--gold)", color: "#1a0f05" }}
                  onClick={closeMobileMenu}
                >
                  Конструктор
                </a>
              </li>
            </ul>

            <button
              onClick={() => { closeMobileMenu(); setContactOpen(true) }}
              className="inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 rounded-full bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white transition-all duration-300 mb-4"
            >
              Связаться
            </button>
          </div>
        </div>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}