"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"

const defaultContent = {
  title: "Zéro Déchet pour les Rivières de Nantes",
  subtitle: "Agissons ensemble pour des rivières plus propres",
  background_image_url: "/images/river-background.png",
  cta_primary_text: "Nous soutenir",
  cta_primary_link: "#support",
  cta_secondary_text: "Découvrir nos actions",
  cta_secondary_link: "#activities",
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState(defaultContent)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("section_key", "hero")
          .single()
        if (!error && data?.content) {
          setContent({ ...defaultContent, ...data.content })
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return
      // Reduced parallax effect for smoother scrolling
      const scrollPosition = window.scrollY
      const parallaxValue = scrollPosition * 0.15 // Reduced from 0.5 to 0.15 for subtler effect
      heroRef.current.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`
    }

    // Initial positioning
    if (heroRef.current) {
      heroRef.current.style.backgroundPositionY = "50%"
    }

    window.addEventListener("scroll", handleParallax)
    return () => window.removeEventListener("scroll", handleParallax)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    // Get the target element
    const targetId = href.replace("#", "")
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Scroll to the element with smooth behavior
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for the navbar height
        behavior: "smooth",
      })

      // Update URL without reloading the page
      window.history.pushState(null, "", href)
    }
  }

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url('${content.background_image_url}')`,
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center 50%",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-white text-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {content.title}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-white text-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {content.subtitle}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href={content.cta_primary_link} className="btn-primary" onClick={(e) => handleLinkClick(e, content.cta_primary_link)}>
            {content.cta_primary_text}
          </Link>
          <Link href={content.cta_secondary_link} className="btn-secondary" onClick={(e) => handleLinkClick(e, content.cta_secondary_link)}>
            {content.cta_secondary_text}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
