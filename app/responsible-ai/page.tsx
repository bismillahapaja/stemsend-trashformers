import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Responsible AI — Ethics & Limitations',
  description: 'Learn about the ethical principles, limitations, and responsible use guidelines for the Stemsend Trashformers AI system.',
}

const principles = [
  {
    icon: '🤖',
    title: 'AI Can Make Mistakes',
    color: 'amber',
    items: [
      'Gemini Vision is a general-purpose AI model and may misidentify unusual or damaged items.',
      'Environmental lighting, image angle, and image quality significantly affect accuracy.',
      'The AI has no physical knowledge of the item — it only interprets pixel data.',
      'Always treat AI output as a starting recommendation, not a final verdict.',
    ],
  },
  {
    icon: '👁️',
    title: 'Low Confidence Requires Human Review',
    color: 'blue',
    items: [
      'Predictions with confidence below 60% are automatically flagged for manual review.',
      'A trained staff member should inspect flagged items before any action is taken.',
      'Do not reuse, donate, or discard items based solely on low-confidence AI predictions.',
      'The system logs every prediction — teachers or lab coordinators can audit the history.',
    ],
  },
  {
    icon: '⚡',
    title: 'Electronics & Hazardous Items — Never Auto-Reuse',
    color: 'red',
    items: [
      'Cables, chargers, batteries, and circuit boards may contain hazardous materials (lead, cadmium, mercury).',
      'Any item flagged as hazardous is automatically escalated to Manual Review status.',
      'Electrical items must be inspected by a qualified laboratory technician before any reuse.',
      'Schools must follow local e-waste disposal regulations regardless of AI recommendations.',
    ],
  },
  {
    icon: '💡',
    title: 'AI Recommends — Humans Decide',
    color: 'green',
    items: [
      'This system is a Decision Support System (DSS), not an autonomous decision-making system.',
      'Every recommendation is advisory. Final decisions belong to school staff.',
      'Students and teachers should be educated that AI tools have inherent limitations.',
      'Encouraging critical thinking about AI outputs is part of the STEM learning objective.',
    ],
  },
  {
    icon: '📊',
    title: 'Data Privacy & Transparency',
    color: 'purple',
    items: [
      'Uploaded images are stored locally on your school\'s server — they are not sent to third-party servers except Google Gemini for analysis.',
      'Google Gemini API processes images in accordance with Google\'s data usage policies.',
      'Prediction history is retained in a local SQLite database for auditing purposes.',
      'School administrators can review and delete any stored data at any time.',
    ],
  },
]

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'bg-amber-100',  badge: 'bg-amber-100 text-amber-700' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'bg-blue-100',   badge: 'bg-blue-100 text-blue-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    icon: 'bg-red-100',    badge: 'bg-red-100 text-red-700' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  icon: 'bg-green-100',  badge: 'bg-green-100 text-green-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100', badge: 'bg-purple-100 text-purple-700' },
}

export default function ResponsibleAIPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          🛡️ AI Ethics & Safety
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-900">
          Responsible AI Use
        </h1>
        <p className="text-green-700/60 max-w-2xl mx-auto leading-relaxed">
          Stemsend Trashformers uses AI to support — not replace — human judgment.
          Understanding its limitations is essential for safe, effective use in schools.
        </p>
      </div>

      {/* Alert banner */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">⚠️</span>
        <div>
          <h2 className="font-bold text-amber-800 text-base">Important Notice for School Staff</h2>
          <p className="text-amber-700 text-sm mt-1 leading-relaxed">
            This AI system is an educational tool. All recommendations must be reviewed by a
            qualified adult before any physical action is taken on waste items, especially for
            electrical components or items flagged as potentially hazardous.
          </p>
        </div>
      </div>

      {/* Principles */}
      <div className="space-y-5">
        {principles.map((principle, i) => {
          const c = colorMap[principle.color]
          return (
            <div
              key={i}
              className={`rounded-2xl border ${c.border} ${c.bg} p-6 space-y-4 hover:-translate-y-0.5 transition-transform duration-200`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {principle.icon}
                </div>
                <h2 className="font-bold text-gray-800 text-lg">{principle.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {principle.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Decision flow */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-green-800 text-xl flex items-center gap-2">
          <span>🔄</span> How Decisions Are Made
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {[
            { step: '1', icon: '📸', title: 'Image Uploaded', desc: 'User uploads a photo of a waste item' },
            { step: '2', icon: '🤖', title: 'AI Analyzes', desc: 'Gemini Vision identifies type, condition & hazards' },
            { step: '3', icon: '📋', title: 'Rule Engine', desc: 'Local rules map AI output to recommended action' },
            { step: '4', icon: '⚖️', title: 'Safety Checks', desc: 'Hazard flags & low confidence trigger manual review' },
            { step: '5', icon: '👩‍🏫', title: 'Human Reviews', desc: 'Staff validate and make the final decision' },
            { step: '6', icon: '♻️', title: 'Action Taken', desc: 'Item is reused, repaired, donated or disposed safely' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl p-4 border border-green-100 space-y-2">
              <div className="text-2xl">{s.icon}</div>
              <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-0.5 rounded-full">Step {s.step}</span>
              <p className="font-semibold text-green-800 text-sm">{s.title}</p>
              <p className="text-xs text-green-600/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence thresholds */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-green-800 text-xl">Confidence Thresholds</h2>
        <div className="space-y-3">
          {[
            { range: '75–100%', label: 'High Confidence', color: '#22c55e', desc: 'Recommendation is reliable. Standard review recommended before action.' },
            { range: '50–74%', label: 'Medium Confidence', color: '#f59e0b', desc: 'Exercise caution. A quick visual check by staff is advisable.' },
            { range: '0–49%', label: 'Low Confidence', color: '#ef4444', desc: 'Action is automatically set to Manual Review. Human inspection is required.' },
          ].map((t) => (
            <div key={t.range} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-green-100">
              <div className="text-center w-16 flex-shrink-0">
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.range}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{t.label}</p>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: t.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3 py-4">
        <p className="text-sm text-green-700/60">Ready to start responsibly?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            id="start-upload-btn"
            className="gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            📷 Upload an Item
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl border border-green-200 hover:bg-green-50 transition-all"
          >
            📊 View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
