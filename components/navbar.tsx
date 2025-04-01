"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)

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
    <nav id="navbar" className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary py-2 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder.svg?height=50&width=150"
            alt="C.L.E.A.N. Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          <NavLinks handleLinkClick={handleLinkClick} />
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary w-full py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <NavLinks mobile setIsOpen={setIsOpen} handleLinkClick={handleLinkClick} />
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLinks({
  mobile = false,
  setIsOpen = () => {},
  handleLinkClick,
}: {
  mobile?: boolean
  setIsOpen?: (value: boolean) => void
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  return (
    <>
      <Link
        href="#about"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#about")}
      >
        À propos
      </Link>
      <Link
        href="#approach"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#approach")}
      >
        Notre Approche
      </Link>
      <Link
        href="#events"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#events")}
      >
        Événements
      </Link>
      <Link
        href="#mission"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#mission")}
      >
        Missions
      </Link>
      <Link
        href="#activities"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#activities")}
      >
        Activités
      </Link>
      <Link
        href="#areas"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#areas")}
      >
        Zones d'intervention
      </Link>
      <Link
        href="#partners"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#partners")}
      >
        Partenaires
      </Link>
      <Link
        href="#contact"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#contact")}
      >
        Contact
      </Link>
      <Link
        href="#support"
        className="text-white hover:text-gray-200 transition-colors duration-300"
        onClick={(e) => handleLinkClick(e, "#support")}
      >
        Soutenir
      </Link>
    </>
  )
}

