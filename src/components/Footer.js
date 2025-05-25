import Link from 'next/link'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-limelight text-primary">
              Wangku
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Real-Time Currency & Stock Tracker
            </p>
          </div>
          
          <div className="flex space-x-6 mr-0 md:mr-0 md:ml-0">
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Tentang
            </Link>
            <Link 
              href="#" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link 
              href="/team" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Tim Kami
            </Link>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a 
              href="https://github.com/VourR/Wangku/" 
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Wangku. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}