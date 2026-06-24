'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Upload', icon: '📷' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/history', label: 'History', icon: '🗂️' },
  { href: '/responsible-ai', label: 'Responsible AI', icon: '🛡️' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl animate-float">♻️</span>
          <div>
            <span className="font-bold text-lg text-gradient leading-none block">
              Trashformers
            </span>
            <span className="text-xs text-green-600/70 font-medium leading-none">
              by Stemsend
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : 'text-green-800/70 hover:bg-green-50 hover:text-green-700'
                  }
                `}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden p-2 rounded-lg text-green-700 hover:bg-green-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-green-100 bg-white/95 backdrop-blur-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-b border-green-50 transition-colors
                  ${isActive ? 'bg-green-50 text-green-700' : 'text-green-800/70 hover:bg-green-50'}
                `}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
