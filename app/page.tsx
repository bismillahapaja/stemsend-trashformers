'use client'

import UploadZone from '@/components/UploadZone'
import Link from 'next/link'
import { motion } from 'framer-motion'



const ITEMS = [
  { icon: '📦', label: 'Cardboard' },
  { icon: '🍶', label: 'Plastic Bottle' },
  { icon: '📄', label: 'Paper' },
  { icon: '🥫', label: 'Metal Can' },
  { icon: '🔌', label: 'Cable' },
  { icon: '✏️', label: 'Stationery' },
  { icon: '🥡', label: 'Food Container' },
  { icon: '🔍', label: 'More soon...' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📸',
    title: 'Upload a Photo',
    desc: 'Take or upload a photo of any waste item — cardboard, plastic, metal, cable, stationery, and more.',
  },
  {
    step: '02',
    icon: '🤖',
    title: 'AI Analysis',
    desc: 'Google Gemini Vision identifies the item type, assesses its condition, and checks for hazards.',
  },
  {
    step: '03',
    icon: '♻️',
    title: 'Get Recommendations',
    desc: 'Receive an actionable recommendation: reuse, repair, donate, dismantle, or dispose responsibly.',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-20">

      {/* ─── Hero ─── */}
      <section className="text-center space-y-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="animate-pulse-green w-2 h-2 bg-green-500 rounded-full inline-block" />
            AI-Powered Circular Economy for Schools
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-900 leading-[1.1] tracking-tight"
        >
          Transform Waste{' '}
          <span className="text-gradient block sm:inline">Into Opportunity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-green-700/70 max-w-2xl mx-auto leading-relaxed"
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
            id="try-greenloop-btn"
            className="gradient-green text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-200 hover:-translate-y-1 transition-all duration-300 text-base"
          >
            🌿 Try GreenLoop
          </a>
          <Link
            href="/responsible-ai"
            id="learn-more-btn"
            className="bg-white text-green-700 font-bold px-8 py-4 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-base"
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">Analyze Your Item</h2>
          <p className="text-green-600/70 mt-2">
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
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800">How It Works</h2>
          <p className="text-green-600/70 mt-2 max-w-lg mx-auto">
            Three simple steps to turn any waste item into a circular economy opportunity
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 space-y-3 hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-xs font-bold text-green-500 bg-green-100 px-2.5 py-1 rounded-full">
                  Step {card.step}
                </span>
              </div>
              <h3 className="font-bold text-green-800 text-lg">{card.title}</h3>
              <p className="text-sm text-green-700/60 leading-relaxed">{card.desc}</p>
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
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-green-800">Supported Item Types</h2>
          <span className="text-xs text-green-600/50 font-medium bg-green-50 px-3 py-1 rounded-full">
            Powered by Gemini 2.5 Flash Vision
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-green-50 hover:bg-green-100 rounded-xl px-3 py-2.5 transition-colors cursor-default"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-green-700">{item.label}</span>
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
        className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-600 p-8 text-center text-white space-y-4 shadow-2xl shadow-green-300"
      >
        <span className="text-4xl">🛡️</span>
        <h2 className="text-2xl font-bold">AI Recommends. Humans Decide.</h2>
        <p className="text-white/70 max-w-lg mx-auto text-sm leading-relaxed">
          Our AI only provides recommendations — your teachers and staff always make the final call.
          Learn about our ethical AI guidelines and responsible use principles.
        </p>
        <Link
          href="/responsible-ai"
          className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
        >
          View Responsible AI Guidelines →
        </Link>
      </motion.section>

    </div>
  )
}
