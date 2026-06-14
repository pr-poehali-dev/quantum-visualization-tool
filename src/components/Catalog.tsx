import { useState } from "react"
import { ContactModal } from "./ContactModal"

const products = [
  {
    id: 1,
    title: "Стол «Боярин»",
    type: "Умный стол",
    description: "С подъёмным механизмом",
    specs: "Дуб сращенный · Цвет Тик · Лак · 140×80×3 см",
    price: "50 000 ₽",
    badge: "Премиум",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/a2da19de-001b-4df3-8fa0-95c55ad9837e.jpg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/f61ee91f-6ec3-445e-9611-814c88255ba1.jpg",
    ],
  },
  {
    id: 2,
    title: "Стол «Купец»",
    type: "Умный стол",
    description: "С подъёмным механизмом",
    specs: "Дуб сращенный · Бесцветный · Лак · 130×70×3 см",
    price: "45 000 ₽",
    badge: "Хит продаж",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/5d4e2b26-1005-4dc7-a4d8-16c730a4845b.png",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/72a2286c-6002-42b2-a777-0a8f7e7e27ac.png",
    ],
  },
  {
    id: 3,
    title: "Стол «Витязь»",
    type: "Умный стол",
    description: "С подъёмным механизмом",
    specs: "Дуб сращенный · Бесцветный лак · 150×60×3 см",
    price: "45 000 ₽",
    badge: null,
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/6c76ebd8-62f3-4a85-aa04-6609adb0b4d3.png",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/eb68bf66-2ef4-40fc-8e75-fc2b6f92cb3b.png",
    ],
  },
  {
    id: 4,
    title: "Стол «Воевода»",
    type: "Компьютерный стол",
    description: "На стационарном подстолье",
    specs: "Дуб сращенный · Бесцветный лак · 140×70×3 см",
    price: "35 000 ₽",
    badge: "Доступная цена",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/0b0a9b03-2ed7-4057-84d9-3bff6d3acb34.jpeg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/15bf462a-414f-45cc-9297-b4d3952eeb12.jpeg",
    ],
  },
]

function CatalogCard({ product }: { product: typeof products[0] }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [contactOpen, setContactOpen] = useState(false)

  const orderMessage = `Привет! Хочу узнать подробнее о столе.\nМодель: ${product.title}\n${product.type} — ${product.description}\n${product.specs}\nЦена: ${product.price}`

  return (
    <article className="group flex flex-col bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300">
      {/* Фото */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.images[photoIndex]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Бейдж */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1"
            style={{ background: "var(--gold)", color: "#1a0f05" }}
          >
            {product.badge}
          </span>
        )}

        {/* Цена поверх фото */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4">
          <span className="text-xl font-bold tabular-nums" style={{ color: "var(--gold)" }}>
            {product.price}
          </span>
        </div>

        {/* Точки-переключатели фото */}
        {product.images.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === photoIndex ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-lg leading-tight">{product.title}</h3>
        </div>

        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--gold)", opacity: 0.8 }}>
          {product.type}
        </p>
        <p className="text-white/50 text-xs mb-3">{product.description}</p>

        <p className="text-white/30 text-xs leading-relaxed mb-5">{product.specs}</p>

        <div className="mt-auto">
          <button
            onClick={() => setContactOpen(true)}
            className="w-full py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-300 hover:opacity-90"
            style={{ background: "var(--gold)", color: "#1a0f05" }}
          >
            Узнать подробнее
          </button>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} message={orderMessage} />
    </article>
  )
}

export function Catalog() {
  return (
    <section id="catalog" className="py-24 relative" style={{ background: "hsl(25 20% 6%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Заголовок */}
        <div className="mb-14">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold)" }}>
            Готовые позиции
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Каталог столов
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-md">
            Проверенные модели с фиксированными характеристиками. Изготовление от 2 недель.
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <CatalogCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
