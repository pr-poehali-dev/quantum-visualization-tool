import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react"
import { ContactModal } from "./ContactModal"

const projects = [
  {
    id: 1,
    title: "Стол «Боярин»",
    category: "Умный стол с подъёмным механизмом",
    location: "Дуб сращенный, цвет Тик, Лак, 140×80×3",
    year: "2024",
    price: "50 000 ₽",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/a2da19de-001b-4df3-8fa0-95c55ad9837e.jpg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/f61ee91f-6ec3-445e-9611-814c88255ba1.jpg",
    ],
  },
  {
    id: 2,
    title: "Стол «Купец»",
    category: "Компьютерный стол с подъёмным механизмом",
    location: "Дуб сращенный, бесцветный, Лак, 130×70×3",
    year: "2024",
    price: "45 000 ₽",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/51c9deb6-4af4-4896-bca2-ed9a523acb16.jpg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/19ac868a-28aa-4bd7-9ac1-b548b6c97ffa.jpg",
    ],
  },
  {
    id: 3,
    title: "Стол «Воевода»",
    category: "Компьютерный стол на стационарном подстолье",
    location: "Дуб сращенный, бесцветный лак, 140×70×3",
    year: "2024",
    price: "35 000 ₽",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/0b0a9b03-2ed7-4057-84d9-3bff6d3acb34.jpeg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/15bf462a-414f-45cc-9297-b4d3952eeb12.jpeg",
    ],
  },
  {
    id: 4,
    title: "Стол «Витязь»",
    category: "Умный стол с подъёмным механизмом",
    location: "Дуб сращенный, бесцветный лак, 150×60×3",
    year: "2024",
    price: "45 000 ₽",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/6c76ebd8-62f3-4a85-aa04-6609adb0b4d3.png",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/eb68bf66-2ef4-40fc-8e75-fc2b6f92cb3b.png",
    ],
  },
]

function ProjectCard({ project, index, revealed }: { project: typeof projects[0]; index: number; revealed: boolean }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const orderMessage = `Привет! Хочу заказать стол.\nМодель: ${project.title}\n${project.category}\n${project.location}\nЦена: ${project.price}`

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(orderMessage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPhotoIndex(i => (i === 0 ? project.images.length - 1 : i - 1))
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
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

      {/* фото */}
      <div className="relative overflow-hidden aspect-[4/3] mb-0 z-10 border border-white/10">
        <img
          src={project.images[photoIndex]}
          alt={`${project.title} — фото ${photoIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />

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
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* точки */}
        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
          {project.images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setPhotoIndex(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === photoIndex ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* инфо-блок */}
      <div className="relative z-10 p-5 border border-t-0 border-white/10 bg-white/[0.04]">
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
            <button onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/15 text-xs tracking-widest uppercase font-medium text-white/60 hover:border-white/40 hover:text-white transition-all duration-200">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Скопировано" : "Скопировать"}
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90"
              style={{ background: "var(--gold)", color: "#1a0f05" }}>
              Заказать
            </button>
          </div>
        </div>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} message={orderMessage} />
    </article>
  )
}

export function Projects() {
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )
    imageRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 relative overflow-hidden"
      style={{ background: "hsl(25 20% 8%)" }}>

      {/* декоративный свет */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, var(--gold) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.03]"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }} />
        <span className="absolute -bottom-4 left-0 text-[16rem] font-bold leading-none text-white/[0.015] hidden lg:block">02</span>
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