"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useInView, useAnimation } from "framer-motion"

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id="about" ref={ref} className="py-20 bg-gray-50">
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
          <h2>À propos de nous</h2>
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
            <p className="text-lg mb-6"><strong>C.L.E.A.N.</strong> - Conservation de l'Eau À Nantes - est une association créée le 4 avril 2022 avec pour mission de réduire activement les déchets dans les rivières nantaises.</p>
            <p className="mb-6">Actuellement, nous intervenons principalement sur l'Erdre, avec quelques actions ponctuelles sur la Loire.
              Notre objectif est d'étendre progressivement notre présence sur l'ensemble du réseau hydrographique
              nantais.</p>
            <p className="mb-6">Notre approche combine des solutions pratiques (comme les bacs à déchets), des collectes régulières, et
              une démarche collaborative impliquant usagers, associations et collectivités.</p>
            <p>Notre ambition est de devenir un acteur efficace et durable dans la protection des cours d'eau nantais, en
              menant des actions concrètes et en mobilisant le plus grand nombre. Rejoignez-nous dans cette aventure !</p>
          </motion.div>

          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
            }}
          >
            <Image
              src="/images/visuel-couverture-fb.png"
              alt="Vue d'une rivière nantaise"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

