'use client'

import UploadZone from '@/components/UploadZone'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package, Recycle, FileText, Wrench, Cable, PenLine, ShoppingBag, ScanSearch,
  Camera, BrainCircuit, ArrowRight, Shield,
} from 'lucide-react'

const ITEMS = [
  { Icon: Package,     label: 'Cardboard' },
  { Icon: Recycle,     label: 'Plastic Bottle' },
  { Icon: FileText,    label: 'Paper' },
  { Icon: Wrench,      label: 'Metal Can' },
  { Icon: Cable,       label: 'Cable' },
  { Icon: PenLine,     label: 'Stationery' },
  { Icon: ShoppingBag, label: 'Food Container' },
  { Icon: ScanSearch,  label: 'More soon...' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    Icon: Camera,
    title: 'Upload a Photo',
    desc: 'Take or upload a photo of any waste item — cardboard, plastic, metal, cable, stationery, and more.',
  },
  {
    step: '02',
    Icon: BrainCircuit,
    title: 'AI Analysis',
    desc: 'Google Gemini Vision identifies the item type, assesses its condition, and checks for hazards.',
  },
  {
    step: '03',
    Icon: Recycle,
    title: 'Get Recommendations',
    desc: 'Receive an actionable recommendation: reuse, repair, donate, dismantle, or dispose responsibly.',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-24">

      {/* ─── Hero ─── */}
      <section className="text-center space-y-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
            style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
          >
            <span className="animate-pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: 'var(--emerald-600)' }} />
            AI-Powered Circular Economy for Schools
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight"
          style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
        >
          Transform Waste{' '}
          <span className="text-gradient block sm:inline">Into Opportunity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--slate-600)' }}
        >
          Helping schools create a circular economy through AI-powered reuse recommendations.
          Upload a photo. Get instant guidance. Make impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#upload"
            id="try-stemsend-btn"
            className="btn-primary px-8 py-3.5 text-base rounded-lg"
            style={{ borderRadius: '0.5rem' }}
          >
            Analyze Now
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/responsible-ai"
            id="learn-more-btn"
            className="btn-ghost px-8 py-3.5 text-base rounded-lg"
            style={{ borderRadius: '0.5rem' }}
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* ─── Upload Zone ─── */}
      <motion.section
        id="upload"
        className="scroll-mt-nav"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold"
            style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}
          >
            Analyze Your Item
          </h2>
          <p className="mt-2" style={{ color: 'var(--slate-600)' }}>
            Drag, drop, or click to upload a photo of any waste item
          </p>
        </div>
        <UploadZone />
      </motion.section>

      {/* ─── How It Works ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center">
          <h2
            className="text-3xl font-bold"
            style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}
          >
            How It Works
          </h2>
          <p className="mt-2 max-w-lg mx-auto" style={{ color: 'var(--slate-600)' }}>
            Three simple steps to turn any waste item into a circular economy opportunity
          </p>
        </div>

        {/* Staggered cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {HOW_IT_WORKS.map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`card-premium p-7 space-y-4 ${i === 1 ? 'md:mt-8' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--emerald-50)' }}
                >
                  <card.Icon className="w-5 h-5" style={{ color: 'var(--forest-800)' }} />
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)', border: '1px solid var(--emerald-100)' }}
                >
                  Step {card.step}
                </span>
              </div>
              <h3
                className="font-bold text-lg"
                style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-600)' }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── Supported Items ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="card-premium p-8 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
          >
            Supported Item Types
          </h2>
          <span
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)', border: '1px solid var(--emerald-100)' }}
          >
            Powered by Gemini 2.5 Flash Vision
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors cursor-default"
              style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}
            >
              <item.Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--emerald-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--slate-700)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Responsible AI CTA ─── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-10 text-center text-white space-y-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--forest-800) 0%, var(--emerald-700) 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.06]" style={{ background: '#fff' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: '#fff' }} />

        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jakarta)' }}>
            AI Recommends. Humans Decide.
          </h2>
          <p className="text-white/70 max-w-lg mx-auto text-sm leading-relaxed">
            Our AI only provides recommendations — your teachers and staff always make the final call.
            Learn about our ethical AI guidelines and responsible use principles.
          </p>
          <Link
            href="/responsible-ai"
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all"
            style={{ background: '#fff', color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}
          >
            View Responsible AI Guidelines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

    </div>
  )
}
