"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Calendar, MapPin, ArrowRight, X } from "lucide-react"

export default function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState("")

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const openVideoModal = (videoPath: string) => {
    setCurrentVideo(videoPath)
    setVideoModalOpen(true)
    // Bloquer le défilement de la page quand la modale est ouverte
    document.body.style.overflow = "hidden"
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    // Réactiver le défilement de la page
    document.body.style.overflow = "auto"
  }

  const events = [
    {
      title: "Première Éco-Navigation avec La Toue",
      description:
        "Nettoyage de l'Erdre à bord d'une toue traditionnelle. Venez découvrir la rivière tout en participant à sa préservation.",
      date: "Événement passé",
      location: "L'Erdre, Nantes",
      videoEmbed: true,
      videoPath: "/videos/toue.mp4"
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
                {event.videoEmbed ? (
                  <button
                    onClick={() => openVideoModal(event.videoPath || '')}
                    className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-300"
                  >
                    Voir la vidéo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={event.link || "#"}
                    className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-300"
                  >
                    {event.linkText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modale pour la vidéo */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-2">
            <button 
              onClick={closeVideoModal}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
              aria-label="Fermer"
            >
              <X className="h-6 w-6 text-gray-800" />
            </button>
            <video 
              src={currentVideo} 
              controls 
              autoPlay 
              className="max-h-[80vh] max-w-full"
            >
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
          </div>
        </div>
      )}
    </section>
  )
}

