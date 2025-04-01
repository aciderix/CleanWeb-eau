"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Globe, Mountain, Droplet } from "lucide-react"

export default function AreasSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const areas = [
    {
      title: "L'Erdre",
      description:
        "Notre zone d'intervention principale actuellement. C'est ici que nous développons et testons nos solutions comme les bacs à déchets, et que nous organisons des collectes régulières.",
      icon: <Globe className="h-16 w-16 text-primary" />,
    },
    {
      title: "La Loire",
      description:
        "Nous y menons des actions ponctuelles. La Loire présente des défis différents de l'Erdre, et nous travaillons à y renforcer notre présence.",
      icon: <Mountain className="h-16 w-16 text-primary" />,
    },
    {
      title: "Une Vision d'Avenir",
      description:
        "Notre objectif à long terme est de protéger l'ensemble du réseau hydrographique nantais. Nous adoptons une approche progressive, en développant des partenariats et en adaptant nos méthodes à chaque cours d'eau.",
      icon: <Droplet className="h-16 w-16 text-primary" />,
    },
  ]

  return (
    <section id="areas" ref={ref} className="py-20">
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
          <h2>Zones d'intervention</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {areas.map((area, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                  },
                },
              }}
            >
              <div className="flex justify-center mb-6">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{area.title}</h3>
              <p className="text-gray-600">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

