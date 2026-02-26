"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  link: string
  link_text: string
  sort_order: number
}

export default function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })

      if (error) {
        console.error("Erreur chargement événements:", error)
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <section id="events" ref={ref} className="py-20 bg-gray-50">
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
          <h2>Événements à venir</h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">Aucun événement pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
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
                <div className="p-6">
                  <div className="flex items-center text-secondary mb-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link
                    href={event.link || "#"}
                    className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.link_text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
