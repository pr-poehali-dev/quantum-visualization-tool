import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"

type ProductDetailData = {
  title: string
  category: string
  location: string
  story?: string
  price: string
  images: string[]
}

interface ProductDetailModalProps {
  open: boolean
  onClose: () => void
  product: ProductDetailData | null
  isFav: boolean
  onAddToCart: () => void
  onToggleFav: () => void
}

export function ProductDetailModal({ open, onClose, product, isFav, onAddToCart, onToggleFav }: ProductDetailModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    if (open) setPhotoIndex(0)
  }, [open, product])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open || !product) return null

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))
  }
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex((i) => (i === product.images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-2xl mx-0 sm:mx-4 mb-0 max-h-[92vh] overflow-y-auto border border-white/10 sm:rounded-sm"
        style={{ background: "linear-gradient(155deg, hsl(25 20% 10%) 0%, var(--navy) 160%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* фото */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border-b border-white/10">
          <img
            src={product.images[photoIndex]}
            alt={`${product.title} — фото ${photoIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {product.images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                    className="w-6 h-6 flex items-center justify-center"
                    aria-label={`Фото ${i + 1}`}
                  >
                    <span className={`block w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === photoIndex ? "bg-white scale-125" : "bg-white/40"}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* инфо */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-2xl font-medium text-white">{product.title}</h3>
            <span className="text-xl font-bold tabular-nums shrink-0" style={{ color: "var(--gold)" }}>{product.price}</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-1">{product.category}</p>
          <p className="text-white/40 text-xs leading-relaxed mb-4">{product.location}</p>
          {product.story && (
            <p className="text-white/70 text-sm leading-relaxed">{product.story}</p>
          )}

          <div className="flex gap-2 mt-6">
            <button
              onClick={onAddToCart}
              className="btn-glow flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300"
              style={{ background: "var(--gold)", color: "#1a0f05" }}
            >
              <ShoppingCart className="w-4 h-4" />
              В корзину
            </button>
            <button
              onClick={onToggleFav}
              aria-label="В избранное"
              className="inline-flex items-center justify-center w-12 shrink-0 border border-white/15 hover:border-[var(--gold)]/60 transition-all duration-200"
              style={isFav ? { background: "rgba(201,168,76,0.15)", borderColor: "var(--gold)" } : undefined}
            >
              <Heart className="w-4 h-4" style={{ color: isFav ? "var(--gold)" : "rgba(255,255,255,0.5)", fill: isFav ? "var(--gold)" : "transparent" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}