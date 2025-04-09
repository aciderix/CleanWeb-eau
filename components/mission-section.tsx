"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Waves, Sprout, Users, Heart } from "lucide-react"

export default function MissionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const missions = [
    {
      title: "Actions concrètes",
      description:
        "Agir sur le terrain pour réduire la pollution des cours d'eau nantais, en particulier l'Erdre et la Loire. Mettre en place des solutions pratiques comme les bacs à déchets et impliquer les usagers dans la préservation de leur environnement.",
      icon: <Waves className="h-16 w-16 text-primary" />,
    },
    {
      title: "Sensibilisation",
      description:
        "Participer à des événements comme les Rendez-vous de l'Erdre pour sensibiliser le public à la problématique des déchets dans les rivières. Adopter une approche positive et montrer que chacun peut agir à son échelle.",
      icon: <Sprout className="h-16 w-16 text-primary" />,
    },
    {
      title: "Collaboration",
      description:
        "Contribuer à la dynamique locale en travaillant avec les associations, collectivités et usagers. Adopter une approche complémentaire et développer des solutions innovantes comme les BADS (Bacs à Déchets Sauvages).",
      icon: <Users className="h-16 w-16 text-primary" />,
    },
    {
      title: "Nouvelle mission",
      description:
        "Description de la nouvelle mission",
      icon: <Heart className="h-16 w-16 text-primary" />,
    }
  ]

  return (
    <section id="mission" ref={ref} className="py-20">
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
          <h2>Nos missions</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {missions.map((mission, index) => (
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
              <div className="flex justify-center mb-6">{mission.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{mission.title}</h3>
              <p className="text-gray-600">{mission.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

