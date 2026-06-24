import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Stemsend Trashformers — AI Circular Economy for Schools',
    template: '%s | Stemsend Trashformers',
  },
  description:
    'AI-powered Circular Economy Decision Support System for schools. Upload waste item photos and get instant AI recommendations for reuse, repair, or recycling.',
  keywords: ['circular economy', 'waste management', 'school', 'AI', 'recycling', 'sustainability'],
  authors: [{ name: 'Stemsend Trashformers' }],
  openGraph: {
    type: 'website',
    siteName: 'Stemsend Trashformers',
    title: 'Stemsend Trashformers — AI Circular Economy for Schools',
    description: 'AI-powered waste analysis and circular economy recommendations for schools.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen gradient-bg antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="py-6 text-center text-sm text-green-700/60 border-t border-green-100">
          <p>
            © {new Date().getFullYear()} Stemsend Trashformers &mdash; AI-powered Circular Economy for Schools
          </p>
        </footer>
      </body>
    </html>
  )
}
