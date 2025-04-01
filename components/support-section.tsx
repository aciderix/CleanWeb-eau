"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"

export default function SupportSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id="support" ref={ref} className="py-20 bg-gray-50">
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
          <h2>Soutenez notre action</h2>
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
            <h3 className="text-2xl font-semibold mb-4">Votre soutien est essentiel</h3>
            <p className="text-gray-600 mb-6">
              Pour mener à bien nos actions de préservation des rivières nantaises, nous avons besoin de votre soutien.
              Vous pouvez nous aider de différentes manières :
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-medium mb-2">Faire un don</h4>
                <p className="text-gray-600 mb-4">
                  Votre contribution financière nous aide à financer le matériel nécessaire à nos actions et à
                  développer le projet BADS (Bacs à Déchets Sauvages).
                </p>
                <Link
                  href="https://www.helloasso.com/associations/clean-conservation-de-l-eau-a-nantes/formulaires/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  Faire un don via HelloAsso
                </Link>
              </div>

              <div>
                <h4 className="text-xl font-medium mb-2">Devenir bénévole</h4>
                <p className="text-gray-600 mb-4">
                  Rejoignez-nous sur le terrain pour participer aux collectes, aux Éco-Navigations ou à l'entretien des
                  BADS. Toutes les bonnes volontés sont les bienvenues !
                </p>
                <Link href="#contact" className="btn-secondary inline-block">
                  Nous contacter
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden flex items-center justify-center p-8"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
            }}
          >
            <Image
              src="/images/Clean-logo.png"
              alt="Soutenez C.L.E.A.N."
              fill
              className="object-contain max-w-[70%] max-h-[70%]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

