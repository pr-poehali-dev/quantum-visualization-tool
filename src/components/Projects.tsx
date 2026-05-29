import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Стол «Боярин»",
    category: "Письменный стол с подъёмным механизмом",
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
    category: "Письменный стол с подъёмным механизмом",
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
    category: "Рабочий стол",
    location: "Дуб массив, скруглённый край, масло-воск",
    year: "2024",
    images: [
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/6ac65623-d1d9-4598-a141-5ea5172653a2.jpg",
      "https://cdn.poehali.dev/projects/53afd534-c4d4-4c1e-92b5-b59a5b871baa/bucket/06b996c4-5105-4e59-b5d7-3f462602f82d.jpg",
    ],
  },
  {
    id: 4,
    title: "Стол «Витязь»",
    category: "Письменный стол с подъёмным механизмом",
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
  const [hoveredId, setHoveredId] = useState(false)

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
      className="group cursor-pointer"
      onMouseEnter={() => setHoveredId(true)}
      onMouseLeave={() => setHoveredId(false)}
    >
      <div className="relative overflow-hidden aspect-[4/3] mb-6">
        <img
          src={project.images[photoIndex]}
          alt={`${project.title} — фото ${photoIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 ${
            hoveredId ? "scale-105" : "scale-100"
          }`}
        />

        {/* overlay reveal */}
        <div
          className="absolute inset-0 bg-primary origin-top pointer-events-none"
          style={{
            transform: revealed ? "scaleY(0)" : "scaleY(1)",
            transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        />

        {/* стрелки */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100"
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100"
          aria-label="Следующее фото"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* точки */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {project.images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setPhotoIndex(i) }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === photoIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
          <p className="text-muted-foreground text-sm">
            {project.category} · {project.location}
          </p>
          {project.price && (
            <p className="mt-3 text-lg font-semibold" style={{ color: "var(--gold, #c9a84c)" }}>
              {project.price}
            </p>
          )}
        </div>
        <span className="text-muted-foreground/60 text-sm">{project.year}</span>
      </div>
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

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Избранные работы</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наша коллекция</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Смотреть всю коллекцию
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div key={project.id} ref={(el) => (imageRefs.current[index] = el)}>
              <ProjectCard
                project={project}
                index={index}
                revealed={revealedImages.has(project.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}