"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function ActivitiesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const activities = [
    {
      title: "Projet BADS - Bacs à Déchets Sauvages",
      description:
        "Déploiement de Bacs à Déchets Sauvages (BADS) sur les rivières, en commençant par l'Erdre, pour permettre aux usagers de collecter les déchets flottants qu'ils rencontrent.",
      highlight: "Rejoignez le mouvement BADS et contribuez à la préservation de nos rivières !",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Bac à déchets sauvages",
      link: "#contact",
      linkText: "Participer au projet BADS",
    },
    {
      title: "Éco-Navigations : Nettoyons en Explorant",
      description:
        "Sorties en bateau, canoë ou paddle combinant découverte du patrimoine naturel et nettoyage des cours d'eau (Erdre, Loire et affluents).",
      highlight: "Explorez l'Erdre sous un nouveau jour tout en agissant pour sa préservation.",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Éco-Navigation sur l'Erdre",
      link: "#contact",
      linkText: "S'inscrire à une Éco-Navigation",
    },
    {
      title: "Sensibilisation : Partager et Échanger",
      description:
        "Rencontre avec le public lors d'événements comme les Rendez-vous de l'Erdre pour partager nos observations et montrer comment chacun peut participer.",
      highlight: "",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Sensibilisation et éducation",
      link: "#contact",
      linkText: "Nous rencontrer",
    },
    {
      title: "Collaboration avec les Acteurs Locaux",
      description:
        "Travailler avec tous les acteurs concernés par la préservation des cours d'eau, participer à la réflexion collective et apporter notre expérience de terrain.",
      highlight:
        "Notre rôle est de participer à l'effort collectif en apportant des solutions concrètes et complémentaires.",
      image: "/placeholder.svg?height=400&width=600",
      alt: "Collaboration avec les acteurs locaux",
      link: "#contact",
      linkText: "Échanger avec nous",
    },
  ]

  return (
    <section id="activities" ref={ref} className="py-20 bg-gray-50">
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
          <h2>Nos activités phares</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.15 * index,
                  },
                },
              }}
            >
              <div className="relative h-64">
                <Image src={activity.image || "/placeholder.svg"} alt={activity.alt} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
                <p className="text-gray-600 mb-3">{activity.description}</p>
                {activity.highlight && <p className="text-primary font-medium mb-4">{activity.highlight}</p>}
                <Link
                  href={activity.link}
                  className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-300"
                >
                  {activity.linkText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

