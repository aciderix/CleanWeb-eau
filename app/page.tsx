"use client"

import { useEffect } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import ApproachSection from "@/components/approach-section"
import EventsSection from "@/components/events-section"
import MissionSection from "@/components/mission-section"
import ActivitiesSection from "@/components/activities-section"
import AreasSection from "@/components/areas-section"
import PartnersSection from "@/components/partners-section"
import ContactSection from "@/components/contact-section"
import SupportSection from "@/components/support-section"
import Footer from "@/components/footer"
import { setupAnimations } from "@/lib/animation"

export default function Home() {
  useEffect(() => {
    const cleanup = setupAnimations()
    return cleanup
  }, [])

  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <ApproachSection />
      <EventsSection />
      <MissionSection />
      <ActivitiesSection />
      <AreasSection />
      <PartnersSection />
      <ContactSection />
      <SupportSection />
      <Footer />
    </main>
  )
}

