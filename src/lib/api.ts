import funcUrls from "../../backend/func2url.json"

const AUTH_URL = funcUrls.auth
const SHOP_URL = funcUrls.shop
const ADMIN_URL = funcUrls.admin

const TOKEN_KEY = "rt_token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(base: string, action: string, method: string, body?: unknown, extra = "") {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = getToken()
  if (token) headers["X-Auth-Token"] = token
  const res = await fetch(`${base}?action=${action}${extra}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || "Ошибка запроса")
  return data
}

function requestDelete(base: string, action: string, extra = "") {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers["X-Auth-Token"] = token
  return fetch(`${base}?action=${action}${extra}`, { method: "DELETE", headers }).then((r) => r.json())
}

export type User = {
  id: number
  email: string
  name?: string
  phone?: string
  address?: string
  is_admin?: boolean
}

export type Product = {
  id: number
  name: string
  category?: string
  description?: string
  price: number
  image_url?: string
  is_active?: boolean
  images?: string[]
}

export type ProductImage = {
  id: number
  image_url: string
  sort_order: number
}

export type CartItem = {
  id: number
  product_id?: number
  title: string
  price: number
  quantity: number
  image_url?: string
  config?: Record<string, unknown> | null
}

export type Order = {
  id: number
  total: number
  status: string
  comment?: string
  created_at: string
  items: { title: string; price: number; quantity: number; image_url?: string; config?: unknown }[]
  customer_name?: string
  customer_phone?: string
  customer_address?: string
  email?: string
}

export const api = {
  // auth
  register: (email: string, password: string, name: string) =>
    request(AUTH_URL, "register", "POST", { email, password, name }),
  login: (email: string, password: string) =>
    request(AUTH_URL, "login", "POST", { email, password }),
  me: () => request(AUTH_URL, "me", "GET"),
  updateProfile: (data: { name: string; phone: string; address: string }) =>
    request(AUTH_URL, "profile", "PUT", data),
  logout: () => request(AUTH_URL, "logout", "POST"),

  // shop
  getProducts: (): Promise<{ products: Product[] }> => request(SHOP_URL, "products", "GET"),
  getContent: (): Promise<{ content: Record<string, string> }> => request(SHOP_URL, "content", "GET"),
  getCart: (): Promise<{ items: CartItem[] }> => request(SHOP_URL, "cart", "GET"),
  addToCart: (item: Partial<CartItem>) => request(SHOP_URL, "cart", "POST", item),
  updateCart: (id: number, quantity: number) => request(SHOP_URL, "cart", "PUT", { id, quantity }),
  removeFromCart: (id: number) => requestDelete(SHOP_URL, "cart", `&id=${id}`),
  clearCart: () => requestDelete(SHOP_URL, "cart", "&id=all"),
  getFavorites: (): Promise<{ products: Product[] }> => request(SHOP_URL, "favorites", "GET"),
  addFavorite: (product_id: number) => request(SHOP_URL, "favorites", "POST", { product_id }),
  removeFavorite: (product_id: number) => requestDelete(SHOP_URL, "favorites", `&product_id=${product_id}`),
  createOrder: (data: { name?: string; phone?: string; address?: string; comment?: string }) =>
    request(SHOP_URL, "order", "POST", data),
  getOrders: (): Promise<{ orders: Order[] }> => request(SHOP_URL, "orders", "GET"),

  // admin
  adminStats: () => request(ADMIN_URL, "stats", "GET"),
  adminOrders: (): Promise<{ orders: Order[] }> => request(ADMIN_URL, "orders", "GET"),
  adminSetOrderStatus: (id: number, status: string) =>
    request(ADMIN_URL, "order_status", "PUT", { id, status }),
  adminUsers: () => request(ADMIN_URL, "users", "GET"),
  adminProducts: (): Promise<{ products: Product[] }> => request(ADMIN_URL, "products", "GET"),
  adminAddProduct: (p: Partial<Product>) => request(ADMIN_URL, "products", "POST", p),
  adminUpdateProduct: (p: Partial<Product>) => request(ADMIN_URL, "products", "PUT", p),
  adminDeleteProduct: (id: number) => requestDelete(ADMIN_URL, "products", `&id=${id}`),
  adminGetContent: (): Promise<{ content: Record<string, string> }> => request(ADMIN_URL, "content", "GET"),
  adminUpdateContent: (items: Record<string, string>) => request(ADMIN_URL, "content", "PUT", { items }),
  adminGetProductImages: (productId: number): Promise<{ images: ProductImage[] }> =>
    request(ADMIN_URL, "product_images", "GET", undefined, `&product_id=${productId}`),
  adminAddProductImage: (product_id: number, image_url: string, sort_order = 0) =>
    request(ADMIN_URL, "product_images", "POST", { product_id, image_url, sort_order }),
  adminDeleteProductImage: (id: number) => requestDelete(ADMIN_URL, "product_images", `&id=${id}`),
  adminUploadImage: (fileBase64: string, contentType: string): Promise<{ url: string }> =>
    request(ADMIN_URL, "upload_image", "POST", { file: fileBase64, content_type: contentType }),
}