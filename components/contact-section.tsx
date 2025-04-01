"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import { Phone, Mail, MapPin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Utilisation de Formspree pour l'envoi du formulaire
      const response = await fetch("https://formspree.io/f/meoarqrk", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Message envoyé ! Nous vous répondrons dans les plus brefs délais.",
        })

        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        throw new Error("Erreur lors de l'envoi du formulaire");
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Une erreur est survenue. Veuillez réessayer.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="py-20">
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
          <h2>Contactez-nous</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } },
            }}
          >
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                  <Link
                    href="tel:0676695026"
                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    06 76 69 50 26
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <Link
                    href="mailto:clean.eau.nantes@lilo.org"
                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    clean.eau.nantes@lilo.org
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Adresse</h3>
                  <p className="text-gray-600">Péniche le Sémaphore, Quai Malakoff, 44000 Nantes, France</p>
                  <p className="text-sm text-gray-500 mt-1">(Siège social pour correspondance)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Réseaux sociaux</h3>
                  <Link
                    href="https://www.instagram.com/clean.eau.nantes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    @clean.eau.nantes
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" action="https://formspree.io/f/meoarqrk" method="POST">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[150px]"
                />
              </div>

              {formStatus.type && (
                <div
                  className={`p-3 rounded ${formStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {formStatus.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

