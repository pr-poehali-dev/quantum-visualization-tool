import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Copy, Check, Heart, ShoppingCart } from "lucide-react"
import { ContactModal } from "./ContactModal"
import { useShop } from "@/context/ShopContext"
import { api, Product } from "@/lib/api"

type ProjectItem = {
  id: number
  productId: number
  priceNum: number
  title: string
  category: string
  location: string
  year: string
  price: string
  images: string[]
}

const YEAR = String(new Date().getFullYear())

function toProject(p: Product): ProjectItem {
  const images = [p.image_url, ...(p.images || [])].filter((v): v is string => Boolean(v))
  return {
    id: p.id,
    productId: p.id,
    priceNum: p.price,
    title: p.name,
    category: p.category || "",
    location: p.description || "",
    year: YEAR,
    price: `${p.price.toLocaleString("ru")} ₽`,
    images: images.length > 0 ? images : ["/placeholder.svg"],
  }
}

const makeDust = () => Array.from({ length: 22 }, (_, i) => ({
  left: 4 + Math.random() * 92,
  top: 10 + Math.random() * 80,
  size: 2 + Math.random() * 4,
  dx: (Math.random() - 0.5) * 60,
  dy: -20 - Math.random() * 50,
  delay: Math.random() * 0.15,
  key: i,
}))

function ProjectCard({ project, index, revealed }: { project: ProjectItem; index: number; revealed: boolean }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [dustKey, setDustKey] = useState(0)
  const [dust, setDust] = useState(makeDust)
  const { addToCart, toggleFavorite, favoriteIds } = useShop()
  const isFav = favoriteIds.includes(project.productId)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      product_id: project.productId,
      title: project.title,
      price: project.priceNum,
      image_url: project.images[0],
      quantity: 1,
    }).catch(() => {})
  }

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(project.productId)
  }

  const orderMessage = `Привет! Хочу заказать стол.\nМодель: ${project.title}\n${project.category}\n${project.location}\nЦена: ${project.price}`

  const triggerDust = () => { setDust(makeDust()); setDustKey(k => k + 1) }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(orderMessage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerDust()
    setPhotoIndex(i => (i === 0 ? project.images.length - 1 : i - 1))
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerDust()
    setPhotoIndex(i => (i === project.images.length - 1 ? 0 : i + 1))
  }

  return (
    <article
      className="group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* номер карточки — декор */}
      <span
        className="absolute -top-5 -left-2 text-[5rem] font-bold leading-none select-none pointer-events-none z-0 transition-opacity duration-500"
        style={{ color: "var(--gold)", opacity: hovered ? 0.18 : 0.07 }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* карточка со скруглением и тенью */}
      <div className="relative z-10 gold-frame depth-card-dark depth-hover depth-edge overflow-hidden">
      {/* фото */}
      <div className="relative overflow-hidden aspect-[4/3] mb-0 z-10 border-b border-white/10">
        <img
          src={project.images[photoIndex]}
          alt={`${project.title} — фото ${photoIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />

        {/* золотистая пыль при смене слайда */}
        {dustKey > 0 && (
          <div key={dustKey} className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {dust.map(p => (
              <span
                key={p.key}
                className="gold-dust-particle"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  animationDelay: `${p.delay}s`,
                  ["--dust-x" as string]: `${p.dx}px`,
                  ["--dust-y" as string]: `${p.dy}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* reveal overlay */}
        <div
          className="absolute inset-0 origin-top pointer-events-none"
          style={{
            background: "hsl(25 20% 8%)",
            transform: revealed ? "scaleY(0)" : "scaleY(1)",
            transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        />

        {/* тёмный градиент снизу */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* год + цена поверх фото */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
          <span className="text-white/50 text-xs tracking-widest uppercase">{project.year}</span>
          <span className="text-lg font-bold tabular-nums" style={{ color: "var(--gold)" }}>{project.price}</span>
        </div>

        {/* стрелки */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all duration-200 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all duration-200 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* точки */}
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          {project.images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); if (i !== photoIndex) triggerDust(); setPhotoIndex(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === photoIndex ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>

        {/* иконка — плавно поднимается при наведении */}
        <div
          className="absolute left-3 top-3 z-10 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-500 ease-out"
          style={{
            background: "rgba(12,8,4,0.6)",
            border: "1px solid rgba(201,168,76,0.5)",
            transform: hovered ? "translateY(-6px)" : "translateY(0)",
            boxShadow: hovered
              ? "0 12px 22px rgba(0,0,0,0.5), 0 0 18px rgba(201,168,76,0.35)"
              : "0 4px 10px rgba(0,0,0,0.4)",
          }}
        >
          <ArrowUpRight
            className="w-5 h-5 transition-transform duration-500 ease-out"
            style={{ color: "var(--gold)", transform: hovered ? "translate(1px,-1px)" : "none" }}
          />
        </div>
      </div>

      {/* инфо-блок */}
      <div className="relative z-10 p-5 bg-white/[0.04]">
        {/* золотая черта слева */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
          style={{ background: hovered ? "var(--gold)" : "transparent" }} />

        <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline underline-offset-4">
          {project.title}
        </h3>
        <p className="text-white/45 text-xs leading-relaxed">
          {project.category}
        </p>
        <p className="text-white/30 text-xs mt-0.5">{project.location}</p>

        {/* кнопки */}
        <div className="mt-4 space-y-2" onClick={e => e.stopPropagation()}>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="btn-glow flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-300"
              style={{ background: "var(--gold)", color: "#1a0f05" }}>
              <ShoppingCart className="w-3.5 h-3.5" />
              В корзину
            </button>
            <button
              onClick={handleFav}
              aria-label="В избранное"
              className="inline-flex items-center justify-center w-11 shrink-0 border border-white/15 hover:border-[var(--gold)]/60 transition-all duration-200"
              style={isFav ? { background: "rgba(201,168,76,0.15)", borderColor: "var(--gold)" } : undefined}>
              <Heart className="w-4 h-4" style={{ color: isFav ? "var(--gold)" : "rgba(255,255,255,0.5)", fill: isFav ? "var(--gold)" : "transparent" }} />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-white/15 text-xs tracking-widest uppercase font-medium text-white/60 hover:border-white/40 hover:text-white transition-all duration-200">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Скопировано" : "Скопировать"}
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-[var(--gold)]/40 text-[#e8c87a] text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:bg-[var(--gold)]/10">
              Заказать
            </button>
          </div>
        </div>
      </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} message={orderMessage} />
    </article>
  )
}

export function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    api.getProducts().then((d) => setProjects(d.products.map(toProject))).catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1 && projects[index]) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )
    imageRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [projects])

  return (
    <section id="projects" className="py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(200deg, hsl(25 20% 8%) 0%, hsl(25 20% 8%) 35%, var(--navy) 110%)" }}>

      {/* декоративный свет */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, var(--gold) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.03]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />
        <span className="absolute -bottom-4 left-0 text-[16rem] font-bold leading-none text-white/[0.015] hidden lg:block">02</span>

        {/* парящие светлые частицы */}
        {[
          { left: "10%", top: "18%", size: 5, delay: "0s", dur: "7.5s" },
          { left: "85%", top: "24%", size: 6, delay: "1.3s", dur: "8.4s" },
          { left: "60%", top: "72%", size: 4, delay: "0.7s", dur: "6.8s" },
          { left: "25%", top: "80%", size: 6, delay: "2.1s", dur: "9s" },
          { left: "48%", top: "14%", size: 5, delay: "3s", dur: "8.1s" },
          { left: "92%", top: "62%", size: 4, delay: "1.7s", dur: "7.2s" },
          { left: "16%", top: "50%", size: 6, delay: "0.5s", dur: "8.8s" },
          { left: "70%", top: "40%", size: 3, delay: "2.6s", dur: "6.4s" },
          { left: "5%", top: "35%", size: 4, delay: "1.1s", dur: "7.9s" },
          { left: "38%", top: "60%", size: 5, delay: "2.4s", dur: "8.6s" },
          { left: "55%", top: "30%", size: 6, delay: "0.3s", dur: "9.2s" },
          { left: "78%", top: "82%", size: 4, delay: "1.9s", dur: "7.1s" },
          { left: "30%", top: "26%", size: 5, delay: "3.2s", dur: "8.3s" },
          { left: "95%", top: "44%", size: 3, delay: "0.9s", dur: "6.6s" },
          { left: "20%", top: "68%", size: 6, delay: "2.8s", dur: "9.4s" },
          { left: "66%", top: "56%", size: 4, delay: "1.5s", dur: "7.7s" },
          { left: "44%", top: "88%", size: 5, delay: "0.6s", dur: "8.9s" },
          { left: "88%", top: "12%", size: 4, delay: "2.2s", dur: "7.4s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full animate-particle-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle, rgba(255,248,230,0.9) 0%, rgba(232,200,116,0.3) 60%, transparent 100%)",
              boxShadow: "0 0 8px rgba(255,244,214,0.5)",
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* заголовок */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-0.5 h-8 bg-[var(--gold)] shrink-0" />
              <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Избранные работы</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white">Наша коллекция</h2>
          </div>
          <a href="#"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
            Смотреть всю коллекцию
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* сетка */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <div key={project.id} ref={(el) => (imageRefs.current[index] = el)}>
              <ProjectCard project={project} index={index} revealed={revealedImages.has(project.id)} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}