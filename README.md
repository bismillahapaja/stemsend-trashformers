# Stemsend Trashformers 🌿♻️

**AI-Powered Circular Economy Decision Support System for Schools**

Stemsend Trashformers helps schools identify reusable items from waste and recommends the best circular economy actions using Google Gemini Vision AI.

---

## Features

- 📸 **Image Upload** — Upload photos of waste items (cardboard, plastic, metal, cables, etc.)
- 🤖 **AI Analysis** — Google Gemini 2.5 Flash Vision identifies item type, condition, and hazard status
- ⚙️ **Rule Engine** — Maps AI output to actionable recommendations (reuse, repair, donate, dismantle, dispose)
- 📊 **Dashboard** — Real-time stats with pie/bar charts and CO₂ savings estimates
- 🗂️ **History** — Paginated log of all past analyses stored in SQLite
- 🛡️ **Responsible AI** — Ethics & limitations guide for educators

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 2.5 Flash (Vision) |
| ORM | Prisma + SQLite |
| Charts | Recharts |
| Deployment | Vercel-compatible |

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd stemsend-trashformers
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

> Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/)

### 3. Run development server

```bash
npm run dev
```

The dev server starts immediately. If you change `prisma/schema.prisma`, run `npm run db:generate` then `npm run db:push` first.

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
stemsend-trashformers/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # POST — Gemini AI analysis + rule engine
│   │   ├── upload/route.ts      # POST — Image file upload
│   │   ├── history/route.ts     # GET  — Paginated prediction history
│   │   ├── dashboard/route.ts   # GET  — Aggregated stats
│   │   └── seed/route.ts        # POST — Load sample data
│   ├── dashboard/page.tsx       # Dashboard with charts
│   ├── history/page.tsx         # Prediction history
│   ├── result/page.tsx          # Individual analysis result
│   ├── responsible-ai/page.tsx  # Ethics & limitations guide
│   ├── layout.tsx               # Root layout with Navbar
│   └── globals.css              # Green-themed design system
├── components/
│   ├── Navbar.tsx               # Sticky navigation
│   ├── UploadZone.tsx           # Drag-and-drop upload
│   ├── ResultCard.tsx           # Analysis result display
│   ├── DashboardView.tsx        # Charts & statistics
│   └── HistoryView.tsx          # Paginated history grid
├── lib/
│   ├── gemini.ts                # Gemini Vision API integration
│   ├── rules.ts                 # Rule engine + CO₂ estimations
│   └── prisma.ts                # Prisma singleton client
├── prisma/
│   ├── schema.prisma            # SQLite Prediction model
│   └── seed.ts                  # Sample data seeder
├── data/
│   └── rules.json               # Item type → action rules
├── types/
│   └── index.ts                 # TypeScript type definitions
└── public/
    └── uploads/                 # Uploaded images
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/upload` | Upload image, returns `base64` + `url` |
| `POST` | `/api/analyze` | Analyze with Gemini + apply rules, saves to DB |
| `GET` | `/api/history` | Paginated prediction history |
| `GET` | `/api/dashboard` | Aggregated stats + chart data |
| `POST` | `/api/seed` | Load 15 sample predictions |

---

## Rule Engine

Rules are defined in `data/rules.json`. Each combination of `itemType` × `condition` maps to an `action` and a `recommendation`.

**Actions:** `reuse` · `repair` · `donate` · `dismantle` · `dispose` · `manual_review`

**Override conditions:**
- If `hazard: true` → forced `manual_review`
- If `confidence < 40%` → forced `manual_review`

---

## Responsible AI

This application is a **Decision Support System** — not an autonomous decision maker. Key principles:

- AI confidence below 60% triggers a human review warning
- Hazardous items are always escalated to manual review
- All recommendations must be validated by school staff
- See `/responsible-ai` for full ethics documentation

---

## Deployment on Vercel

> ⚠️ SQLite is not supported on Vercel's serverless functions. For production, switch `DATABASE_URL` to a hosted provider (e.g., Turso, PlanetScale, Neon).

```bash
vercel --prod
```

Add the following environment variables in Vercel dashboard:
- `DATABASE_URL`
- `GEMINI_API_KEY`

---

## Troubleshooting

### `EPERM: operation not permitted` on Windows
This happens when a stale Node.js process is holding the Prisma DLL file.
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
npm run dev
```

### `API key not valid` from Gemini
Ensure your `GEMINI_API_KEY` in `.env` is a valid key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- Keys should start with `AIza...` (39 characters)
- OAuth tokens (`AQ...`) are **not** API keys — do not use them

### Database not found
Run `npm run db:push` once to create the SQLite database:
```bash
npm run db:push
npm run dev
```

---

## License

MIT — Free for educational and non-commercial use.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-green)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)
![LKS AI 2026](https://img.shields.io/badge/LKS_AI-2026-emerald)
