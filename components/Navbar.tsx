'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Upload, LayoutDashboard, Clock, ShieldCheck,
  Leaf, X, Menu, ArrowRight,
} from 'lucide-react'

const navLinks = [
  { href: '/',              label: 'Upload',         Icon: Upload },
  { href: '/dashboard',    label: 'Dashboard',       Icon: LayoutDashboard },
  { href: '/history',      label: 'History',         Icon: Clock },
  { href: '/responsible-ai', label: 'Responsible AI', Icon: ShieldCheck },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(226,232,240,0.6)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="navbar-logo">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'var(--forest-800)' }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <span
                className="font-bold text-sm leading-none block"
                style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}
              >
                Stemsend Trashformers
              </span>
              <span
                className="text-[10px] font-medium leading-none block mt-0.5"
                style={{ color: 'var(--emerald-600)' }}
              >
                Circular Economy AI
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}
                >
                  <link.Icon className="w-3.5 h-3.5 opacity-60" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/#upload" className="btn-primary" id="navbar-cta-btn">
              Analyze Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--forest-800)' }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile slide-out overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(3px)' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in panel */}
      <aside
        id="mobile-menu-panel"
        className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
        style={{
          background: '#fff',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-hidden={!mobileOpen}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 h-16 border-b"
          style={{ borderColor: 'var(--slate-100)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'var(--forest-800)' }}
            >
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-sm"
              style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}
            >
              Stemsend Trashformers
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
            style={{ color: 'var(--slate-600)' }}
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-150"
                style={
                  isActive
                    ? { background: 'var(--emerald-50)', color: 'var(--forest-800)', fontWeight: '600' }
                    : { color: 'var(--slate-600)' }
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={
                    isActive
                      ? { background: 'var(--forest-800)' }
                      : { background: 'var(--slate-100)' }
                  }
                >
                  <link.Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? '#fff' : 'var(--slate-600)' }}
                  />
                </div>
                {link.label}
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--forest-800)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Panel footer CTA */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--slate-100)' }}>
          <Link
            href="/#upload"
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full justify-center"
            id="mobile-cta-btn"
          >
            Analyze Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  )
}
