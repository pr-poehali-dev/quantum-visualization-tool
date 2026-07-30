import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useShop } from "@/context/ShopContext"
import { ShopHeader } from "@/components/ShopHeader"
import Icon from "@/components/ui/icon"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function Cart() {
  const { user, cart, updateCartQty, removeFromCart, refreshCart } = useShop()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [comment, setComment] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<number | null>(null)

  useEffect(() => {
    document.title = "Корзина — Русский Стол"
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
    }
  }, [user])

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { order_id } = await api.createOrder({ name, phone, address, comment })
      await refreshCart()
      setDone(order_id)
      toast.success("Заказ оформлен!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1a130c 0%, #0d0906 100%)" }}>
      <ShopHeader />
      <main className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-light text-white mb-8 flex items-center gap-3">
          <Icon name="ShoppingCart" size={26} className="text-[#e8c87a]" /> Корзина
        </h1>

        {done ? (
          <div className="gold-frame p-8 text-center" style={{ background: "rgba(12,8,4,0.6)" }}>
            <Icon name="CircleCheck" size={48} className="text-[#e8c87a] mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">Заказ №{done} оформлен</h2>
            <p className="text-white/60 mb-6">Мы свяжемся с вами для подтверждения.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/account" className="px-5 py-2.5 rounded-full text-sm font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}>
                Мои заказы
              </Link>
              <Link to="/" className="px-5 py-2.5 rounded-full text-sm border border-[var(--gold)]/40 text-[#e8c87a]">
                На главную
              </Link>
            </div>
          </div>
        ) : !user ? (
          <div className="gold-frame p-8 text-center" style={{ background: "rgba(12,8,4,0.6)" }}>
            <Icon name="Lock" size={40} className="text-[#e8c87a] mx-auto mb-4" />
            <p className="text-white/80 mb-6">Войдите в аккаунт, чтобы пользоваться корзиной</p>
            <button onClick={() => navigate("/auth")} className="px-6 py-3 rounded-full font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}>
              Войти или зарегистрироваться
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="gold-frame p-8 text-center" style={{ background: "rgba(12,8,4,0.6)" }}>
            <Icon name="PackageOpen" size={40} className="text-[#e8c87a] mx-auto mb-4" />
            <p className="text-white/80 mb-6">Корзина пуста</p>
            <Link to="/#projects" className="px-6 py-3 rounded-full font-medium inline-block" style={{ background: "var(--gold)", color: "#1a0f05" }}>
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium">{item.title}</h3>
                    {item.config && (
                      <p className="text-white/50 text-xs mt-1 line-clamp-2">
                        {Object.values(item.config as Record<string, unknown>).filter(Boolean).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 rounded-full border border-white/15">
                        <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="w-7 h-7 text-white/70 hover:text-white">−</button>
                        <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="w-7 h-7 text-white/70 hover:text-white">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-[#e8c87a] font-medium whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString("ru")} ₽
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={checkout} className="gold-frame p-5 h-fit space-y-3" style={{ background: "rgba(12,8,4,0.6)" }}>
              <h3 className="text-white font-medium mb-2">Оформление</h3>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Имя" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Телефон" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес доставки" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий" rows={2} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:border-[var(--gold)]/50 focus:outline-none resize-none" />
              <div className="flex justify-between text-white pt-2 border-t border-white/10">
                <span>Итого</span>
                <span className="text-[#e8c87a] text-lg font-semibold">{total.toLocaleString("ru")} ₽</span>
              </div>
              <button type="submit" disabled={busy} className="w-full py-3 rounded-full font-medium disabled:opacity-60" style={{ background: "var(--gold)", color: "#1a0f05" }}>
                {busy ? "Оформляем…" : "Оформить заказ"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
