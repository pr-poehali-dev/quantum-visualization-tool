import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useShop } from "@/context/ShopContext"
import { ShopHeader } from "@/components/ShopHeader"
import Icon from "@/components/ui/icon"
import { api, Order, Product } from "@/lib/api"
import { toast } from "sonner"

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  processing: "В работе",
  done: "Выполнен",
  canceled: "Отменён",
}

export default function Account() {
  const { user, loading, refreshUser, toggleFavorite, addToCart } = useShop()
  const navigate = useNavigate()
  const [tab, setTab] = useState<"orders" | "favorites" | "profile">("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    document.title = "Личный кабинет — Русский Стол"
  }, [])

  useEffect(() => {
    if (!loading && !user) navigate("/auth")
  }, [loading, user, navigate])

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
      api.getOrders().then((d) => setOrders(d.orders)).catch(() => {})
      api.getFavorites().then((d) => setFavorites(d.products)).catch(() => {})
    }
  }, [user])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.updateProfile({ name, phone, address })
      await refreshUser()
      toast.success("Профиль обновлён")
    } catch {
      toast.error("Не удалось сохранить")
    }
  }

  const removeFav = async (id: number) => {
    await toggleFavorite(id)
    setFavorites((f) => f.filter((p) => p.id !== id))
  }

  if (!user) return null

  const tabs = [
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "favorites", label: "Избранное", icon: "Heart" },
    { id: "profile", label: "Профиль", icon: "User" },
  ] as const

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1a130c 0%, #0d0906 100%)" }}>
      <ShopHeader />
      <main className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-light text-white mb-2">Личный кабинет</h1>
        <p className="text-white/50 mb-8">{user.email}</p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={tab === t.id ? { background: "var(--gold)", color: "#1a0f05" } : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
            >
              <Icon name={t.icon} size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Empty icon="Package" text="Заказов пока нет" />
            ) : (
              orders.map((o) => (
                <div key={o.id} className="gold-frame p-5" style={{ background: "rgba(12,8,4,0.6)" }}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="text-white font-medium">Заказ №{o.id}</div>
                    <span className="text-xs px-3 py-1 rounded-full border border-[var(--gold)]/40 text-[#e8c87a]">
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </div>
                  <div className="text-white/50 text-xs mb-3">{new Date(o.created_at).toLocaleString("ru")}</div>
                  <div className="space-y-2">
                    {o.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm text-white/80">
                        <span>{it.title} × {it.quantity}</span>
                        <span className="text-[#e8c87a]">{(it.price * it.quantity).toLocaleString("ru")} ₽</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-white/10 text-white">
                    <span>Итого</span>
                    <span className="text-[#e8c87a] font-semibold">{o.total.toLocaleString("ru")} ₽</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "favorites" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {favorites.length === 0 ? (
              <div className="sm:col-span-2"><Empty icon="Heart" text="В избранном пусто" /></div>
            ) : (
              favorites.map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h3 className="text-white font-medium">{p.name}</h3>
                    <p className="text-[#e8c87a] mt-1">{p.price.toLocaleString("ru")} ₽</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addToCart({ product_id: p.id, title: p.name, price: p.price, image_url: p.image_url, quantity: 1 })}
                        className="flex-1 py-2 rounded-full text-sm font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}
                      >
                        В корзину
                      </button>
                      <button onClick={() => removeFav(p.id)} className="px-3 rounded-full border border-white/15 text-white/60 hover:text-red-400">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "profile" && (
          <form onSubmit={saveProfile} className="gold-frame p-6 max-w-md space-y-4" style={{ background: "rgba(12,8,4,0.6)" }}>
            <label className="block">
              <span className="text-white/60 text-sm">Имя</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[var(--gold)]/50 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-white/60 text-sm">Телефон</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[var(--gold)]/50 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-white/60 text-sm">Адрес доставки</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[var(--gold)]/50 focus:outline-none" />
            </label>
            <button type="submit" className="w-full py-3 rounded-full font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}>
              Сохранить
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="gold-frame p-10 text-center" style={{ background: "rgba(12,8,4,0.5)" }}>
      <Icon name={icon} size={40} className="text-[#e8c87a]/60 mx-auto mb-3" />
      <p className="text-white/60">{text}</p>
    </div>
  )
}
