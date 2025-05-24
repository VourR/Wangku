import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Limelight } from 'next/font/google'

const limelight = Limelight({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-limelight',
})

export const metadata = {
  title: 'Wangku - Currency & Stock Tracker',
  description: 'Real-Time Currency and Stock Tracker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${limelight.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-primary to-accent font-sans flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}