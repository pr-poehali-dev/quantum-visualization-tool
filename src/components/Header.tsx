import { useState, useEffect, MouseEvent } from "react"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"
import { Logo } from "./Logo"
import { ContactModal } from "./ContactModal"
import Icon from "./ui/icon"
import { useShop } from "@/context/ShopContext"

const navItems = [
  { label: "Главная", href: "#hero" },
  { label: "О нас", href: "#about" },
  { label: "Работы", href: "#projects" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Процесс", href: "#process" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const { user, cartCount } = useShop()

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50) }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const ids = ["hero", "about", "projects", "reviews", "process", "constructor", "faq"]

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
      <header className="fixed z-50 top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 transition-all duration-500">
        <nav className="flex items-center justify-between gap-2">
          {/* логотип — компактный жетон */}
          <a
            href="/"
            onClick={scrollToTop}
            className={cn(
              "flex items-center justify-center shrink-0 rounded-full backdrop-blur-md border border-[var(--gold)]/40 transition-all duration-300",
              "w-11 h-11 md:w-16 md:h-16",
            )}
            style={{ background: "rgba(12,8,4,0.6)" }}
          >
            <Logo size={30} className="md:hidden" />
            <Logo size={48} className="hidden md:block" />
          </a>

          {/* десктопное меню */}
          <div
            className={cn(
              "hidden md:flex items-center gap-3 px-3 py-2 rounded-2xl backdrop-blur-md transition-all duration-500",
              scrolled || mobileMenuOpen ? "border-2 border-[var(--gold)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_6px_rgba(201,168,76,0.12),0_0_28px_rgba(201,168,76,0.35)]" : "border border-transparent",
            )}
            style={scrolled || mobileMenuOpen ? { background: "linear-gradient(120deg, hsl(25 18% 14%) 0%, var(--navy) 145%)" } : undefined}
          >
            <ul className="flex items-center gap-3 text-sm tracking-wide">
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

            <Link
              to="/cart"
              aria-label="Корзина"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--gold)]/50 text-[#e8c87a] hover:bg-[var(--gold)]/10 transition-all duration-300"
            >
              <Icon name="ShoppingCart" size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--gold)] text-[#1a0f05] text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <Link
              to={user ? "/account" : "/auth"}
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all duration-300 border border-[var(--gold)]/50 text-[#e8c87a] hover:bg-[var(--gold)] hover:text-[#1a0f05] hover:border-[var(--gold)]"
            >
              <Icon name="User" size={16} />
              {user ? (user.name || "Кабинет") : "Войти"}
            </Link>
          </div>

          {/* мобильный жетон — иконки + бургер */}
          <div
            className="md:hidden flex items-center gap-1 px-1.5 py-1.5 rounded-full backdrop-blur-md border border-[var(--gold)]/40"
            style={{ background: "rgba(12,8,4,0.6)" }}
          >
            {!mobileMenuOpen && (
              <>
                <a
                  href="#constructor"
                  aria-label="Конструктор"
                  className="inline-flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300"
                  style={{ background: "var(--gold)", color: "#1a0f05" }}
                >
                  <Icon name="Hammer" size={14} />
                </a>
                <Link
                  to="/cart"
                  aria-label="Корзина"
                  className="relative inline-flex items-center justify-center rounded-full w-8 h-8 bg-white/10 text-white border border-white/20 transition-all duration-300"
                >
                  <Icon name="ShoppingCart" size={14} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[var(--gold)] text-[#1a0f05] text-[9px] font-bold flex items-center justify-center">{cartCount}</span>
                  )}
                </Link>
                <Link
                  to={user ? "/account" : "/auth"}
                  aria-label={user ? "Кабинет" : "Войти"}
                  className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-white/10 text-white border border-white/20 transition-all duration-300"
                >
                  <Icon name="User" size={14} />
                </Link>
              </>
            )}

            <button
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors duration-300"
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* выпадающее мобильное меню */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out rounded-2xl backdrop-blur-md border",
            mobileMenuOpen
              ? "max-h-[600px] opacity-100 mt-2 border-[var(--gold)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              : "max-h-0 opacity-0 border-transparent",
          )}
          style={mobileMenuOpen ? { background: "linear-gradient(120deg, hsl(25 18% 14%) 0%, var(--navy) 145%)" } : undefined}
        >
          <div className="px-4 py-4">
            <ul className="flex flex-col gap-1 mb-4">
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
                        "transition-colors duration-300 text-base font-light block py-2 px-2 rounded-lg",
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

            <div className="flex items-center gap-3">
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
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 rounded-full border border-[var(--gold)]/50 text-[#e8c87a] hover:bg-[var(--gold)] hover:text-[#1a0f05] transition-all duration-300"
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