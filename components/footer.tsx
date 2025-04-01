import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-darkblue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <Image
                src="/images/Clean-logo-blanc.png"
                alt="C.L.E.A.N. Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Conservation de l'Eau à Nantes est une association dédiée à la protection des cours d'eau nantais, avec
              pour objectif le Zéro Déchet dans nos rivières.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Liens utiles
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#approach" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Notre Approche
                </Link>
              </li>
              <li>
                <Link href="#events" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="#mission" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Missions
                </Link>
              </li>
              <li>
                <Link href="#activities" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Activités
                </Link>
              </li>
              <li>
                <Link href="#support" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Soutenir
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-secondary" />
                <Link
                  href="mailto:clean.eau.nantes@lilo.org"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  clean.eau.nantes@lilo.org
                </Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-secondary" />
                <Link href="tel:0676695026" className="text-gray-300 hover:text-white transition-colors duration-300">
                  06 76 69 50 26
                </Link>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-secondary mt-1" />
                <span className="text-gray-300">Péniche le Sémaphore, Quai Malakoff, 44000 Nantes, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© 2024 C.L.E.A.N. - Conservation de l'Eau À Nantes. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

