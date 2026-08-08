import { Header } from "../components/Header"
import { Hero } from "../components/Hero"
import { Philosophy } from "../components/Philosophy"
import { Projects } from "../components/Projects"
import { Reviews } from "../components/Reviews"
import { Process } from "../components/Process"
import { FAQ } from "../components/FAQ"
import { Constructor } from "../components/Constructor"
import { CallToAction } from "../components/CallToAction"
import { Footer } from "../components/Footer"
import { Seo } from "../components/Seo"

export default function Index() {
  return (
    <main className="min-h-screen">
      <Seo
        title="Русский Стол — умные столы из дуба на заказ | от 35 000 ₽"
        description="Умные и компьютерные столы из массива дуба ручной работы. Электрорегулировка высоты, подъёмный механизм. Умные столы от 45 000 ₽, компьютерные от 35 000 ₽. Собственное производство в Санкт-Петербурге, доставка по всей России."
        path="/"
      />
      <Header />
      <Hero />
      <div className="section-divider" />
      <Philosophy />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Reviews />
      <div className="section-divider" />
      <Process />
      <div className="section-divider" />
      <Constructor />
      <div className="section-divider" />
      <FAQ />
      <div className="section-divider" />
      <CallToAction />
      <Footer />
    </main>
  )
}