import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Leaf, Cpu, ExternalLink } from 'lucide-react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Stemsend Trashformers — Transform Waste Into Opportunity',
    template: '%s | Stemsend Trashformers',
  },
  description:
    'AI-powered Circular Economy Decision Support System for schools. Upload waste item photos and get instant AI recommendations for reuse, repair, or recycling.',
  keywords: ['circular economy', 'waste management', 'school', 'AI', 'recycling', 'sustainability', 'Stemsend Trashformers'],
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
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen gradient-bg antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 bg-white/70 backdrop-blur-sm mt-20">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

              {/* Brand */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--forest-800)' }}>
                    <Leaf className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <p className="font-bold text-base leading-none" style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}>
                      Stemsend Trashformers
                    </p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--emerald-600)' }}>
                      Circular Economy for Schools
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--slate-600)' }}>
                  AI-powered Circular Economy Decision Support System for schools.
                  Turning waste into opportunity, one item at a time.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', borderColor: 'var(--emerald-100)' }}>
                  <Cpu style={{ width: '12px', height: '12px' }} />
                  AI Recommends · Humans Decide
                </div>
              </div>

              {/* Links */}
              {footerLinks.map((col) => (
                <div key={col.heading} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--forest-800)' }}>
                    {col.heading}
                  </h3>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-sm font-medium transition-colors hover:text-[var(--forest-800)] flex items-center gap-1.5 group"
                          style={{ color: 'var(--slate-600)' }}
                        >
                          <ExternalLink style={{ width: '11px', height: '11px', opacity: 0.4 }} />
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs" style={{ color: 'var(--slate-400)' }}>
                © {new Date().getFullYear()} Stemsend Trashformers — AI-powered Circular Economy for Schools
              </p>
              <p className="text-xs" style={{ color: 'var(--slate-400)' }}>
                Powered by{' '}
                <span className="font-semibold" style={{ color: 'var(--emerald-600)' }}>Google Gemini 2.5 Flash</span>
                {' · '}
                <span className="font-semibold" style={{ color: 'var(--emerald-600)' }}>Next.js 16</span>
                {' · '}
                <span className="font-semibold" style={{ color: 'var(--emerald-600)' }}>Prisma + SQLite</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
