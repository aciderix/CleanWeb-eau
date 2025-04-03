"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Shield, MessageCircle, TrendingDown, Trash2, Users, FileText } from "lucide-react"

export default function ApproachSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const approaches = [

    {
      title: "Prévention",
      description: "Sensibiliser et encourager les changements de comportement pour limiter les déchets à la source.",
      icon: <Shield className="h-12 w-12 text-primary" />,
    },

    {
      title: "Animation",
      description: "Participer à des événements comme les Rendez-vous de l'Erdre pour créer du lien et sensibiliser.",
      icon: <MessageCircle className="h-12 w-12 text-primary" />,
    },

    {
      title: "Réduction",
      description: "Identifier les zones d'accumulation et mettre en place des solutions pratiques comme les bacs à déchets.",
      icon: <TrendingDown className="h-12 w-12 text-primary" />,
    },

    {
      title: "Collecte",
      description: "Organiser des sorties de nettoyage sur l'Erdre et la Loire en mobilisant des bénévoles.",
      icon: <Trash2 className="h-12 w-12 text-primary" />,
    },

    {
      title: "Collaboration",
      description: "Travailler avec les associations, collectivités et usagers pour une approche coordonnée.",
      icon: <Users className="h-12 w-12 text-primary" />,
    },

    {
      title: "Documentation",
      description: "Observer et documenter l'état des rivières pour adapter nos actions et partager notre expérience.",
      icon: <FileText className="h-12 w-12 text-primary" />,
    },

    {
      title: "test",
      description: "test",
      icon: <Shield className="h-12 w-12 text-primary" />,
    }
]

  return (
    <section id="approach" ref={ref} className="py-20">
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
          <h2>Notre Approche : Agir à Tous les Niveaux</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {approaches.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.1 * index,
                  },
                },
              }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

