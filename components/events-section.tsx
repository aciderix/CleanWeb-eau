"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

export default function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const events = [
    {
      title: "Première Éco-Navigation avec La Toue",
      description:
        "Nettoyage de l'Erdre à bord d'une toue traditionnelle. Venez découvrir la rivière tout en participant à sa préservation.",
      date: "Événement passé",
      location: "L'Erdre, Nantes",
      link: "https://www.facebook.com/clean.eau.nantes",
      linkText: "Voir sur Facebook",
    },
    {
      title: "Rendez-vous de l'Erdre",
      description:
        "Retrouvez-nous lors de cet événement emblématique pour échanger sur nos actions et découvrir comment vous pouvez contribuer.",
      date: "À venir",
      location: "Bords de l'Erdre, Nantes",
      link: "#contact",
      linkText: "Plus d'informations",
    },
    {
      title: "Collectes sur l'Erdre",
      description:
        "Actions régulières de nettoyage des berges et de la rivière. Matériel fourni, venez comme vous êtes !",
      date: "En continu",
      location: "Différents points sur l'Erdre",
      link: "#contact",
      linkText: "Nous contacter",
    },
  ]

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map((event, index) => (
            <motion.div
              key={index}
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
                  {event.linkText}
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

