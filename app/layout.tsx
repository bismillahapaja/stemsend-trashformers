import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Stemsend Trashformers — Transform Waste Into Opportunity',
    template: '%s | Stemsend Trashformers',
  },
  description:
    'AI-powered Circular Economy Decision Support System for schools. Upload waste item photos and get instant AI recommendations for reuse, repair, or recycling.',
  keywords: ['circular economy', 'waste management', 'school', 'AI', 'recycling', 'sustainability', 'GreenLoop'],
  authors: [{ name: 'Stemsend Trashformers' }],
  openGraph: {
    type: 'website',
    siteName: 'Stemsend Trashformers',
    title: 'Stemsend Trashformers — Transform Waste Into Opportunity',
    description: 'AI-powered waste analysis and circular economy recommendations for schools.',
  },
}

const footerLinks = [
  {
    heading: 'App',
    links: [
      { label: 'Upload & Analyze', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'History', href: '/history' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Responsible AI', href: '/responsible-ai' },
      { label: 'How It Works', href: '/#upload' },
    ],
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen gradient-bg antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        {/* Enhanced Footer */}
        <footer className="border-t border-green-100 bg-white/60 backdrop-blur-sm mt-16">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">♻️</span>
                  <div>
                    <p className="font-bold text-lg text-gradient leading-none">Trashformers</p>
                    <p className="text-xs text-green-600/70 font-medium">by Stemsend</p>
                  </div>
                </div>
                <p className="text-sm text-green-700/60 leading-relaxed max-w-xs">
                  AI-powered Circular Economy Decision Support System for schools.
                  Turning waste into opportunity, one item at a time.
                </p>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100">
                  🤖 AI Recommends · Humans Decide
                </div>
              </div>

              {/* Links */}
              {footerLinks.map((col) => (
                <div key={col.heading} className="space-y-3">
                  <h3 className="text-xs font-bold text-green-800 uppercase tracking-widest">
                    {col.heading}
                  </h3>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-sm text-green-700/60 hover:text-green-700 transition-colors font-medium"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-green-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-green-700/50">
                © {new Date().getFullYear()} Stemsend Trashformers — AI-powered Circular Economy for Schools
              </p>
              <p className="text-xs text-green-600/50">
                Powered by{' '}
                <span className="font-semibold text-green-600">Google Gemini 2.5 Flash</span>
                {' · '}
                <span className="font-semibold text-green-600">Next.js 16</span>
                {' · '}
                <span className="font-semibold text-green-600">Prisma + SQLite</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
