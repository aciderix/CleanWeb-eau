"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Phone, Mail, MapPin, Instagram } from "lucide-react"
import { supabase } from "@/lib/supabase"

const defaultContent = {
  section_title: "Contactez-nous",
  phone: "06 76 69 50 26",
  email: "clean.eau.nantes@lilo.org",
  address: "Péniche le Sémaphore, Quai Malakoff, 44000 Nantes, France",
  instagram_url: "https://www.instagram.com/clean.eau.nantes/",
}

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [content, setContent] = useState(defaultContent)
  const phoneHref = `tel:${content.phone.replace(/\s/g, "")}`
  const emailHref = `mailto:${content.email}`
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}`
  const instagramHandle = content.instagram_url.includes("instagram.com/")
    ? `@${content.instagram_url.split("instagram.com/")[1].replace(/\/$/, "")}`
    : "@clean.eau.nantes"

  return (
    <section id="contact" ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="section-title"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <h2>{content.section_title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
            }}
            className="flex items-start gap-4 rounded-xl border border-gray-100 p-5"
          >
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
              <Link
                href={phoneHref}
                className="text-gray-600 hover:text-primary transition-colors duration-300 break-words"
              >
                {content.phone}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
            }}
            className="flex items-start gap-4 rounded-xl border border-gray-100 p-5"
          >
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold mb-1">Email</h3>
              <Link
                href={emailHref}
                className="text-gray-600 hover:text-primary transition-colors duration-300 break-words"
              >
                {content.email}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } },
            }}
            className="flex items-start gap-4 rounded-xl border border-gray-100 p-5"
          >
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold mb-1">Adresse</h3>
              <Link
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors duration-300"
              >
                {content.address}
              </Link>
              <p className="text-sm text-gray-500 mt-1">(Siège social pour correspondance)</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
            }}
            className="flex items-start gap-4 rounded-xl border border-gray-100 p-5"
          >
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Instagram className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold mb-1">Réseaux sociaux</h3>
              <Link
                href={content.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors duration-300 break-words"
              >
                {instagramHandle}
              </Link>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  )
}
