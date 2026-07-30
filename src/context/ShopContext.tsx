import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { api, getToken, setToken, clearToken, User, CartItem } from "@/lib/api"
import { toast } from "sonner"

type ShopContextType = {
  user: User | null
  loading: boolean
  cart: CartItem[]
  cartCount: number
  favoriteIds: number[]
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  addToCart: (item: Partial<CartItem>) => Promise<void>
  removeFromCart: (id: number) => Promise<void>
  updateCartQty: (id: number, qty: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  toggleFavorite: (productId: number) => Promise<void>
  refreshFavorites: () => Promise<void>
}

const ShopContext = createContext<ShopContextType | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const refreshCart = useCallback(async () => {
    if (!getToken()) {
      setCart([])
      return
    }
    try {
      const { items } = await api.getCart()
      setCart(items)
    } catch {
      setCart([])
    }
  }, [])

  const refreshFavorites = useCallback(async () => {
    if (!getToken()) {
      setFavoriteIds([])
      return
    }
    try {
      const { products } = await api.getFavorites()
      setFavoriteIds(products.map((p) => p.id))
    } catch {
      setFavoriteIds([])
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user } = await api.me()
      setUser(user)
      await Promise.all([refreshCart(), refreshFavorites()])
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [refreshCart, refreshFavorites])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const { token, user } = await api.login(email, password)
    setToken(token)
    setUser(user)
    await Promise.all([refreshCart(), refreshFavorites()])
  }

  const register = async (email: string, password: string, name: string) => {
    const { token, user } = await api.register(email, password, name)
    setToken(token)
    setUser(user)
    await Promise.all([refreshCart(), refreshFavorites()])
  }

  const logout = () => {
    api.logout().catch(() => {})
    clearToken()
    setUser(null)
    setCart([])
    setFavoriteIds([])
  }

  const addToCart = async (item: Partial<CartItem>) => {
    if (!getToken()) {
      toast.error("Войдите, чтобы добавить в корзину")
      throw new Error("not authorized")
    }
    await api.addToCart(item)
    await refreshCart()
    toast.success("Добавлено в корзину")
  }

  const removeFromCart = async (id: number) => {
    await api.removeFromCart(id)
    await refreshCart()
  }

  const updateCartQty = async (id: number, qty: number) => {
    if (qty < 1) return
    await api.updateCart(id, qty)
    await refreshCart()
  }

  const clearCart = async () => {
    await api.clearCart()
    await refreshCart()
  }

  const toggleFavorite = async (productId: number) => {
    if (!getToken()) {
      toast.error("Войдите, чтобы добавить в избранное")
      return
    }
    if (favoriteIds.includes(productId)) {
      await api.removeFavorite(productId)
    } else {
      await api.addFavorite(productId)
    }
    await refreshFavorites()
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <ShopContext.Provider
      value={{
        user,
        loading,
        cart,
        cartCount,
        favoriteIds,
        login,
        register,
        logout,
        refreshUser,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        refreshCart,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error("useShop must be used within ShopProvider")
  return ctx
}
