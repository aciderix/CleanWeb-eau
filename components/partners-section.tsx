"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"

export default function PartnersSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const partners = [
    {
      name: "Fédération des Amis de l'Erdre",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://federation-des-amis-de-l-erdre.org",
    },
    {
      name: "ECOPOLE",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://ecopole.org",
    },
    {
      name: "Swim for the Planet",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://www.helloasso.com/swim-for-the-planet",
    },
    {
      name: "Nantes Métropole",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://metropole.nantes.fr",
    },
    {
      name: "NGE - Ports de Nantes",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://ports-nantes.fr",
    },
    {
      name: "ACE",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://ace-nantes.fr",
    },
    {
      name: "Océan Fest",
      logo: "/placeholder.svg?height=150&width=150",
      website: "https://oceanfest.fr",
    },
  ]

  return (
    <section id="partners" ref={ref} className="py-20 bg-gray-50">
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
          <h2>Nos Partenaires</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex justify-center"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    delay: 0.1 * index,
                  },
                },
              }}
            >
              <Link
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32 w-full"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={150}
                  height={150}
                  className="max-h-24 w-auto object-contain"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

