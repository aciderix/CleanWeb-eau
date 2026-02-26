"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Waves, Sprout, Users, Shield, Smile, Trash2, Handshake, FileText, MapPin, Ship, Eye, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

const iconMap: Record<string, any> = { Waves, Sprout, Users, Shield, Smile, Trash2, Handshake, FileText, MapPin, Ship, Eye }

interface Mission {
  id: string
  title: string
  description: string
  icon_name: string
  sort_order: number
  is_visible: boolean
}

const defaultMissions = [
  {
    title: "Actions concrètes",
    description:
      "Agir sur le terrain pour réduire la pollution des cours d'eau nantais, en particulier l'Erdre et la Loire. Mettre en place des solutions pratiques comme les bacs à déchets et impliquer les usagers dans la préservation de leur environnement.",
    icon_name: "Waves",
  },
  {
    title: "Sensibilisation",
    description:
      "Participer à des événements comme les Rendez-vous de l'Erdre pour sensibiliser le public à la problématique des déchets dans les rivières. Adopter une approche positive et montrer que chacun peut agir à son échelle.",
    icon_name: "Sprout",
  },
  {
    title: "Collaboration",
    description:
      "Contribuer à la dynamique locale en travaillant avec les associations, collectivités et usagers. Adopter une approche complémentaire et développer des solutions innovantes comme les BADS (Bacs à Déchets Sauvages).",
    icon_name: "Users",
  },
]

export default function MissionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [missions, setMissions] = useState(defaultMissions)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMissions() {
      try {
        const { data, error } = await supabase
          .from("missions")
          .select("*")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true })
        if (!error && data && data.length > 0) {
          setMissions(data.map((m: Mission) => ({
            title: m.title,
            description: m.description,
            icon_name: m.icon_name,
          })))
        }
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false)
      }
    }
    fetchMissions()
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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
          {missions.map((mission, index) => {
            const Icon = iconMap[mission.icon_name] || Star
            return (
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
                <div className="flex justify-center mb-6">
                  <Icon className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{mission.title}</h3>
                <p className="text-gray-600">{mission.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
