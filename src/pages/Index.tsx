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

export default function Index() {
  return (
    <main className="min-h-screen">
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