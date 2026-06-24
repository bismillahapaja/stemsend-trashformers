import type { Metadata } from 'next'
import UploadZone from '@/components/UploadZone'

export const metadata: Metadata = {
  title: 'Upload & Analyze Waste Items',
  description: 'Upload a photo of a waste item and get AI-powered circular economy recommendations in seconds.',
}

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
          <span className="animate-pulse-green w-2 h-2 bg-green-500 rounded-full inline-block" />
          AI-Powered Circular Economy
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 leading-tight">
          Transform Waste into{' '}
          <span className="text-gradient">Opportunity</span>
        </h1>
        <p className="text-lg text-green-700/70 max-w-2xl mx-auto leading-relaxed">
          Upload a photo of any item. Our AI instantly identifies it, assesses its condition,
          and recommends the best circular economy action — reuse, repair, donate, or recycle.
        </p>
      </section>

      {/* Upload zone */}
      <section>
        <UploadZone />
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-green-800 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
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
          ].map((card) => (
            <div
              key={card.step}
              className="glass-card rounded-2xl p-6 space-y-3 hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{card.icon}</span>
                <span className="text-xs font-bold text-green-400 bg-green-100 px-2.5 py-1 rounded-full">
                  Step {card.step}
                </span>
              </div>
              <h3 className="font-bold text-green-800 text-lg">{card.title}</h3>
              <p className="text-sm text-green-700/60 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported items */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-green-800">Supported Item Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '📦', label: 'Cardboard' },
            { icon: '🍶', label: 'Plastic Bottle' },
            { icon: '📄', label: 'Paper' },
            { icon: '🥫', label: 'Metal Can' },
            { icon: '🔌', label: 'Cable' },
            { icon: '✏️', label: 'Stationery' },
            { icon: '🥡', label: 'Food Container' },
            { icon: '🔍', label: 'More soon...' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-green-50 hover:bg-green-100 rounded-xl px-3 py-2.5 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-green-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
