import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Bot, Eye, Zap, Lightbulb, Lock, Shield, AlertTriangle,
  Check, Camera, BarChart3, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Responsible AI — Ethics & Limitations',
  description: 'Learn about the ethical principles, limitations, and responsible use guidelines for the Stemsend Trashformers AI system.',
}

type PrincipleColor = 'amber' | 'blue' | 'red' | 'green' | 'purple'

const principles: {
  Icon: LucideIcon
  title: string
  color: PrincipleColor
  items: string[]
}[] = [
  {
    Icon: Bot,
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
    Icon: Eye,
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
    Icon: Zap,
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
    Icon: Lightbulb,
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
    Icon: Lock,
    title: 'Data Privacy & Transparency',
    color: 'purple',
    items: [
      "Uploaded images are stored locally on your school's server — they are not sent to third-party servers except Google Gemini for analysis.",
      "Google Gemini API processes images in accordance with Google's data usage policies.",
      'Prediction history is retained in a local SQLite database for auditing purposes.',
      'School administrators can review and delete any stored data at any time.',
    ],
  },
]

const colorMap: Record<PrincipleColor, {
  bg: string; border: string; icon: string; iconColor: string
}> = {
  amber:  { bg: '#FFFBEB', border: '#FDE68A', icon: '#FEF3C7', iconColor: '#92400E' },
  blue:   { bg: '#EFF6FF', border: '#BFDBFE', icon: '#DBEAFE', iconColor: '#1E40AF' },
  red:    { bg: '#FFF1F2', border: '#FECDD3', icon: '#FFE4E6', iconColor: '#9F1239' },
  green:  { bg: 'var(--emerald-50)', border: 'var(--emerald-100)', icon: '#D1FAE5', iconColor: 'var(--forest-800)' },
  purple: { bg: '#FAF5FF', border: '#E9D5FF', icon: '#EDE9FE', iconColor: '#6D28D9' },
}

const decisionSteps: { Icon: LucideIcon; step: string; title: string; desc: string }[] = [
  { Icon: Camera,       step: '1', title: 'Image Uploaded',  desc: 'User uploads a photo of a waste item' },
  { Icon: Bot,          step: '2', title: 'AI Analyzes',     desc: 'Gemini Vision identifies type, condition & hazards' },
  { Icon: BarChart3,    step: '3', title: 'Rule Engine',     desc: 'Local rules map AI output to recommended action' },
  { Icon: AlertTriangle,step: '4', title: 'Safety Checks',   desc: 'Hazard flags & low confidence trigger manual review' },
  { Icon: Eye,          step: '5', title: 'Human Reviews',   desc: 'Staff validate and make the final decision' },
  { Icon: Check,        step: '6', title: 'Action Taken',    desc: 'Item is reused, repaired, donated or disposed safely' },
]

export default function ResponsibleAIPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
        >
          <Shield className="w-3.5 h-3.5" />
          AI Ethics & Safety
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
        >
          Responsible AI Use
        </h1>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--slate-600)' }}>
          Stemsend Trashformers uses AI to support — not replace — human judgment.
          Understanding its limitations is essential for safe, effective use in schools.
        </p>
      </div>

      {/* Alert banner */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ border: '2px solid #FDE68A', background: '#FFFBEB' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#FEF3C7' }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: '#92400E' }} />
        </div>
        <div>
          <h2 className="font-bold text-base" style={{ color: '#92400E' }}>
            Important Notice for School Staff
          </h2>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: '#B45309' }}>
            This AI system is an educational tool. All recommendations must be reviewed by a
            qualified adult before any physical action is taken on waste items, especially for
            electrical components or items flagged as potentially hazardous.
          </p>
        </div>
      </div>

      {/* Principles */}
      <div className="space-y-4">
        {principles.map((principle, i) => {
          const c = colorMap[principle.color]
          return (
            <div
              key={i}
              className="rounded-2xl p-6 space-y-4 hover:-translate-y-0.5 transition-transform duration-200"
              style={{ border: `1px solid ${c.border}`, background: c.bg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: c.icon }}
                >
                  <principle.Icon className="w-5 h-5" style={{ color: c.iconColor }} />
                </div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
                  {principle.title}
                </h2>
              </div>
              <ul className="space-y-2.5">
                {principle.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--slate-700)' }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--emerald-600)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Decision flow */}
      <div className="card-premium p-6 space-y-5" style={{ borderRadius: '1rem' }}>
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5" style={{ color: 'var(--emerald-700)' }} />
          <h2
            className="font-bold text-xl"
            style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}
          >
            How Decisions Are Made
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {decisionSteps.map((s) => (
            <div
              key={s.step}
              className="rounded-xl p-4 space-y-2"
              style={{ background: '#fff', border: '1px solid var(--slate-100)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                style={{ background: 'var(--emerald-50)' }}
              >
                <s.Icon className="w-5 h-5" style={{ color: 'var(--forest-800)' }} />
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full inline-block"
                style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)' }}
              >
                Step {s.step}
              </span>
              <p className="font-semibold text-sm" style={{ color: 'var(--slate-800)', fontFamily: 'var(--font-jakarta)' }}>
                {s.title}
              </p>
              <p className="text-xs" style={{ color: 'var(--slate-500)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence thresholds */}
      <div className="card-premium p-6 space-y-4" style={{ borderRadius: '1rem' }}>
        <h2
          className="font-bold text-xl"
          style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}
        >
          Confidence Thresholds
        </h2>
        <div className="space-y-3">
          {[
            { range: '75–100%', label: 'High Confidence', color: '#2D6A4F', desc: 'Recommendation is reliable. Standard review recommended before action.' },
            { range: '50–74%', label: 'Medium Confidence', color: '#d97706', desc: 'Exercise caution. A quick visual check by staff is advisable.' },
            { range: '0–49%', label: 'Low Confidence', color: '#ef4444', desc: 'Action is automatically set to Manual Review. Human inspection is required.' },
          ].map((t) => (
            <div
              key={t.range}
              className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: '#fff', border: '1px solid var(--slate-100)' }}
            >
              <div className="text-center w-16 flex-shrink-0">
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.range}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--slate-700)' }}>{t.label}</p>
                <p className="text-xs" style={{ color: 'var(--slate-500)' }}>{t.desc}</p>
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
      <div className="text-center space-y-4 py-4">
        <p className="text-sm" style={{ color: 'var(--slate-500)' }}>Ready to start responsibly?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            id="start-upload-btn"
            className="btn-primary"
            style={{ borderRadius: '0.5rem' }}
          >
            <Camera className="w-4 h-4" />
            Upload an Item
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost"
            style={{ borderRadius: '0.5rem' }}
          >
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
