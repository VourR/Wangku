import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-limelight text-primary hover:text-secondary transition-colors"
          style={{ fontFamily: 'var(--font-limelight)' }}
        >
          Wangku
        </Link>
      </nav>
    </header>
  )
}