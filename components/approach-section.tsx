"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Shield, MessageCircle, TrendingDown, Trash2, Users, FileText, Waves, Sprout, Smile, Handshake, MapPin, Ship, Eye, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

const iconMap: Record<string, any> = { Shield, MessageCircle, TrendingDown, Trash2, Users, FileText, Waves, Sprout, Smile, Handshake, MapPin, Ship, Eye }

interface Approach {
  id: string
  title: string
  description: string
  icon_name: string
  sort_order: number
  is_visible: boolean
}

const defaultApproaches = [
  {
    title: "Prévention",
    description: "Sensibiliser et encourager les changements de comportement pour limiter les déchets à la source.",
    icon_name: "Shield",
  },
  {
    title: "Animation",
    description: "Participer à des événements comme les Rendez-vous de l'Erdre pour créer du lien et sensibiliser.",
    icon_name: "MessageCircle",
  },
  {
    title: "Réduction",
    description: "Identifier les zones d'accumulation et mettre en place des solutions pratiques comme les bacs à déchets.",
    icon_name: "TrendingDown",
  },
  {
    title: "Collecte",
    description: "Organiser des sorties de nettoyage sur l'Erdre et la Loire en mobilisant des bénévoles.",
    icon_name: "Trash2",
  },
  {
    title: "Collaboration",
    description: "Travailler avec les associations, collectivités et usagers pour une approche coordonnée.",
    icon_name: "Users",
  },
  {
    title: "Documentation",
    description: "Observer et documenter l'état des rivières pour adapter nos actions et partager notre expérience.",
    icon_name: "FileText",
  },
]

export default function ApproachSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [approaches, setApproaches] = useState(defaultApproaches)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchApproaches() {
      try {
        const { data, error } = await supabase
          .from("approaches")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true })
        if (!error && data && data.length > 0) {
          setApproaches(data.map((a: Approach) => ({
            title: a.title,
            description: a.description,
            icon_name: a.icon_name,
          })))
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchApproaches()
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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
          {approaches.map((item, index) => {
            const Icon = iconMap[item.icon_name] || Star
            return (
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
                <div className="mb-4">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
