"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Activity {
  id: string
  title: string
  description: string
  highlight: string
  image_url: string
  image_alt: string
  link: string
  link_text: string
  sort_order: number
  is_visible: boolean
}

const defaultActivities = [
  {
    title: "Projet BADS - Bacs à Déchets Sauvages",
    description:
      "Déploiement de Bacs à Déchets Sauvages (BADS) sur les rivières, en commençant par l'Erdre, pour permettre aux usagers de collecter les déchets flottants qu'ils rencontrent.",
    highlight: "Rejoignez le mouvement BADS et contribuez à la préservation de nos rivières !",
    image_url: "/images/bac2.jpg",
    image_alt: "Bac à déchets sauvages",
    link: "#contact",
    link_text: "Participer au projet BADS",
  },
  {
    title: "Éco-Navigations : Nettoyons en Explorant",
    description:
      "Sorties en bateau, canoë ou paddle combinant découverte du patrimoine naturel et nettoyage des cours d'eau (Erdre, Loire et affluents).",
    highlight: "Explorez l'Erdre sous un nouveau jour tout en agissant pour sa préservation.",
    image_url: "/images/bateau.png",
    image_alt: "Éco-Navigation sur l'Erdre",
    link: "#contact",
    link_text: "S'inscrire à une Éco-Navigation",
  },
  {
    title: "Sensibilisation : Partager et Échanger",
    description:
      "Rencontre avec le public lors d'événements comme les Rendez-vous de l'Erdre pour partager nos observations et montrer comment chacun peut participer.",
    highlight: "",
    image_url: "/images/sensibilisation.jpg",
    image_alt: "Sensibilisation et éducation",
    link: "#contact",
    link_text: "Nous rencontrer",
  },
  {
    title: "Collaboration avec les Acteurs Locaux",
    description:
      "Travailler avec tous les acteurs concernés par la préservation des cours d'eau, participer à la réflexion collective et apporter notre expérience de terrain.",
    highlight:
      "Notre rôle est de participer à l'effort collectif en apportant des solutions concrètes et complémentaires.",
    image_url: "/images/partenaires.png",
    image_alt: "Collaboration avec les acteurs locaux",
    link: "#contact",
    link_text: "Échanger avec nous",
  },
]

export default function ActivitiesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [activities, setActivities] = useState(defaultActivities)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true })
        if (!error && data && data.length > 0) {
          setActivities(data.map((a: Activity) => ({
            title: a.title,
            description: a.description,
            highlight: a.highlight || "",
            image_url: a.image_url,
            image_alt: a.image_alt,
            link: a.link,
            link_text: a.link_text,
          })))
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivities()
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
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
              <div className="relative h-80 overflow-hidden">
                <Image 
                  src={activity.image_url || "/placeholder.svg"} 
                  alt={activity.image_alt} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-primary">{activity.title}</h3>
                <p className="text-gray-600 mb-3">{activity.description}</p>
                {activity.highlight && <p className="text-primary font-medium mb-4">{activity.highlight}</p>}
                <Link
                  href={activity.link}
                  className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-300"
                >
                  {activity.link_text}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
