"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

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
          "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url('/images/river-background.png')",
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
          Zéro Déchet pour les Rivières de Nantes
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-white text-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Agissons ensemble pour des rivières plus propres
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="#support" className="btn-primary" onClick={(e) => handleLinkClick(e, "#support")}>
            Nous soutenir
          </Link>
          <Link href="#activities" className="btn-secondary" onClick={(e) => handleLinkClick(e, "#activities")}>
            Découvrir nos actions
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

