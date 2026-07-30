import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useShop } from "@/context/ShopContext"
import { ShopHeader } from "@/components/ShopHeader"
import Icon from "@/components/ui/icon"
import { api, Order, Product } from "@/lib/api"
import { toast } from "sonner"

type Stats = { orders_count: number; revenue: number; users_count: number; new_orders: number }
type AdminUser = { id: number; email: string; name?: string; phone?: string; address?: string; created_at: string; orders_count: number }

const STATUSES = [
  { id: "new", label: "Новый" },
  { id: "processing", label: "В работе" },
  { id: "done", label: "Выполнен" },
  { id: "canceled", label: "Отменён" },
]

export default function Admin() {
  const { user, loading } = useShop()
  const navigate = useNavigate()
  const [tab, setTab] = useState<"stats" | "orders" | "users" | "products">("stats")
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    document.title = "Админка — Русский Стол"
  }, [])

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) navigate("/auth")
  }, [loading, user, navigate])

  const loadAll = () => {
    api.adminStats().then(setStats).catch(() => {})
    api.adminOrders().then((d) => setOrders(d.orders)).catch(() => {})
    api.adminUsers().then((d) => setUsers(d.users)).catch(() => {})
    api.adminProducts().then((d) => setProducts(d.products)).catch(() => {})
  }

  useEffect(() => {
    if (user?.is_admin) loadAll()
  }, [user])

  const setStatus = async (id: number, status: string) => {
    await api.adminSetOrderStatus(id, status)
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)))
    api.adminStats().then(setStats).catch(() => {})
    toast.success("Статус обновлён")
  }

  if (!user?.is_admin) return null

  const tabs = [
    { id: "stats", label: "Статистика", icon: "ChartBar" },
    { id: "orders", label: "Заказы", icon: "Package" },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "products", label: "Товары", icon: "Table" },
  ] as const

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #1a130c 0%, #0d0906 100%)" }}>
      <ShopHeader />
      <main className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-light text-white mb-8 flex items-center gap-3">
          <Icon name="Shield" size={26} className="text-[#e8c87a]" /> Панель управления
        </h1>

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

        {tab === "stats" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="Package" label="Всего заказов" value={stats.orders_count} />
            <StatCard icon="Bell" label="Новых заказов" value={stats.new_orders} />
            <StatCard icon="Wallet" label="Выручка" value={`${stats.revenue.toLocaleString("ru")} ₽`} />
            <StatCard icon="Users" label="Клиентов" value={stats.users_count} />
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-white/50">Заказов пока нет</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="gold-frame p-5" style={{ background: "rgba(12,8,4,0.6)" }}>
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                    <div>
                      <span className="text-white font-medium">Заказ №{o.id}</span>
                      <span className="text-white/40 text-xs ml-3">{new Date(o.created_at).toLocaleString("ru")}</span>
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[var(--gold)]/50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#1a130c]">{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-white/70 text-sm mb-3 space-y-0.5">
                    <div>{o.customer_name} · {o.customer_phone}</div>
                    {o.customer_address && <div className="text-white/50">{o.customer_address}</div>}
                    {o.email && <div className="text-white/40 text-xs">{o.email}</div>}
                    {o.comment && <div className="text-white/50 italic">«{o.comment}»</div>}
                  </div>
                  <div className="space-y-1">
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

        {tab === "users" && (
          <div className="gold-frame overflow-hidden" style={{ background: "rgba(12,8,4,0.6)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/50 text-left border-b border-white/10">
                    <th className="p-3">Email</th>
                    <th className="p-3">Имя</th>
                    <th className="p-3">Телефон</th>
                    <th className="p-3">Заказов</th>
                    <th className="p-3">Регистрация</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="text-white/80 border-b border-white/5">
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.name || "—"}</td>
                      <td className="p-3">{u.phone || "—"}</td>
                      <td className="p-3">{u.orders_count}</td>
                      <td className="p-3 text-white/50">{new Date(u.created_at).toLocaleDateString("ru")}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-white/40">Пользователей пока нет</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "products" && <ProductsAdmin products={products} reload={() => api.adminProducts().then((d) => setProducts(d.products))} />}
      </main>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="gold-frame p-5" style={{ background: "rgba(12,8,4,0.6)" }}>
      <Icon name={icon} size={22} className="text-[#e8c87a] mb-3" />
      <div className="text-2xl text-white font-semibold">{value}</div>
      <div className="text-white/50 text-sm mt-1">{label}</div>
    </div>
  )
}

const EMPTY = { name: "", category: "", description: "", price: 0, image_url: "" }

function ProductsAdmin({ products, reload }: { products: Product[]; reload: () => Promise<unknown> }) {
  const [editing, setEditing] = useState<Partial<Product> | null>(null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    try {
      if (editing.id) await api.adminUpdateProduct(editing)
      else await api.adminAddProduct(editing)
      setEditing(null)
      await reload()
      toast.success("Сохранено")
    } catch {
      toast.error("Ошибка сохранения")
    }
  }

  const remove = async (id: number) => {
    await api.adminDeleteProduct(id)
    await reload()
    toast.success("Товар скрыт")
  }

  return (
    <div>
      <button onClick={() => setEditing({ ...EMPTY })} className="mb-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}>
        <Icon name="Plus" size={16} /> Добавить товар
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl overflow-hidden border border-white/10" style={{ background: "rgba(255,255,255,0.03)", opacity: p.is_active ? 1 : 0.45 }}>
            {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-36 object-cover" />}
            <div className="p-4">
              <h3 className="text-white font-medium">{p.name}</h3>
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{p.description}</p>
              <p className="text-[#e8c87a] mt-2">{p.price.toLocaleString("ru")} ₽</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="flex-1 py-2 rounded-full text-sm border border-[var(--gold)]/40 text-[#e8c87a]">Изменить</button>
                {p.is_active && (
                  <button onClick={() => remove(p.id)} className="px-3 rounded-full border border-white/15 text-white/60 hover:text-red-400">
                    <Icon name="EyeOff" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="gold-frame p-6 w-full max-w-md space-y-3" style={{ background: "#1a130c" }}>
            <h3 className="text-white font-medium">{editing.id ? "Редактировать товар" : "Новый товар"}</h3>
            <input required value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Название" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
            <input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Категория" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
            <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание" rows={2} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:border-[var(--gold)]/50 focus:outline-none" />
            <input required type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} placeholder="Цена" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
            <input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="Ссылка на фото" className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--gold)]/50 focus:outline-none" />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 py-2.5 rounded-full font-medium" style={{ background: "var(--gold)", color: "#1a0f05" }}>Сохранить</button>
              <button type="button" onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full border border-white/15 text-white/70">Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
