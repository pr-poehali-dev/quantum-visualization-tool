import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useShop } from "@/context/ShopContext"
import { Logo } from "@/components/Logo"
import Icon from "@/components/ui/icon"
import { toast } from "sonner"

export default function Auth() {
  const { login, register, user } = useShop()
  const navigate = useNavigate()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = "Вход — Русский Стол"
    if (user) navigate(user.is_admin ? "/admin" : "/account")
  }, [user, navigate])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === "login") {
        await login(email.trim(), password)
      } else {
        await register(email.trim(), password, name.trim())
      }
      toast.success(mode === "login" ? "С возвращением!" : "Аккаунт создан")
      navigate("/account")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(160deg, #1a130c 0%, #0d0906 100%)" }}>
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <Logo size={72} />
        </Link>

        <div className="gold-frame p-6 md:p-8" style={{ background: "rgba(12,8,4,0.7)" }}>
          <div className="flex gap-2 mb-6 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-full text-sm font-medium transition-all"
                style={mode === m ? { background: "var(--gold)", color: "#1a0f05" } : { color: "rgba(255,255,255,0.7)" }}
              >
                {m === "login" ? "Вход" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <Field icon="User" placeholder="Имя" value={name} onChange={setName} />
            )}
            <Field icon="Mail" placeholder="Email" value={email} onChange={setEmail} type="text" required />
            <Field icon="Lock" placeholder="Пароль" value={password} onChange={setPassword} type="password" required />

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-full font-medium transition-all disabled:opacity-60"
              style={{ background: "var(--gold)", color: "#1a0f05" }}
            >
              {busy ? "Подождите…" : mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>
        </div>

        <Link to="/" className="block text-center mt-6 text-white/50 hover:text-white/80 text-sm transition-colors">
          ← На главную
        </Link>
      </div>
    </div>
  )
}

function Field({
  icon, placeholder, value, onChange, type = "text", required,
}: {
  icon: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <div className="relative">
      <Icon name={icon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e8c87a]/70" />
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[var(--gold)]/50 focus:outline-none transition-colors"
      />
    </div>
  )
}
