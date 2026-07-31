import { Link, useNavigate } from "react-router-dom"
import { Logo } from "@/components/Logo"
import Icon from "@/components/ui/icon"
import { useShop } from "@/context/ShopContext"

export function ShopHeader() {
  const { user, cartCount, logout } = useShop()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gold)]/20 backdrop-blur-md" style={{ background: "rgba(18,12,7,0.9)" }}>
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={44} />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--gold)]/40 text-[#e8c87a] hover:bg-[var(--gold)]/10 transition-colors"
            aria-label="Корзина"
          >
            <Icon name="ShoppingCart" size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--gold)] text-[#1a0f05] text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 h-10 rounded-full border border-[var(--gold)]/40 text-[#e8c87a] text-sm hover:bg-[var(--gold)]/10 transition-colors"
                >
                  <Icon name="Shield" size={16} /> <span className="hidden sm:inline">Админка</span>
                </Link>
              )}
              <Link
                to="/account"
                className="inline-flex items-center gap-1.5 px-3 h-10 rounded-full border border-[var(--gold)]/40 text-[#e8c87a] text-sm hover:bg-[var(--gold)]/10 transition-colors"
              >
                <Icon name="User" size={16} />
                <span className="hidden sm:inline">{user.name || "Кабинет"}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate("/") }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-white transition-colors"
                aria-label="Выйти"
              >
                <Icon name="LogOut" size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-sm font-medium transition-all"
              style={{ background: "var(--gold)", color: "#1a0f05" }}
            >
              <Icon name="User" size={16} /> Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}