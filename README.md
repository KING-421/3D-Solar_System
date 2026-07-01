# 🪐 Stellarium — 3D Solar System Explorer

An interactive, full-stack web app that lets you **fly through a real-time 3D solar
system**, read dossiers on every planet, take space quizzes, and climb a global
cosmic leaderboard.

Built with **Next.js 16 (App Router)**, **React Three Fiber** (WebGL 3D),
**Framer Motion**, **Prisma + SQLite**, and **shadcn/ui**.

---

## ✨ Features

### 🌌 Interactive 3D Solar System
- A live WebGL scene rendered with **React Three Fiber** & **Three.js**
- The **Sun** glows with an emissive core, halo, and dynamic point light
- All **8 planets** orbit the Sun at their own speeds and self-rotate
- **Saturn** and **Uranus** have rings; **Earth** has an orbiting moon
- 9,000 procedural background stars and atmospheric fog
- **Click any planet** to fly the camera to it and open its dossier
- Drag to orbit, scroll to zoom, plus play/pause & 0.5×–4× time-warp controls

### 🌠 Realistic Deep-Space Universe Backdrop
- A giant **Milky Way panorama** sky sphere surrounds the entire scene (real astrophotography)
- **5 real galaxies** float in the deep distance as glowing billboards:
  Andromeda, Whirlpool, Sombrero, Triangulum, and a colorful emission nebula
- Each galaxy uses **additive blending** so it glows realistically against the void,
  with a soft halo and gentle twinkle/drift animation
- Zoom out (scroll) to admire the full cosmic vista — the solar system sits inside a living universe

### 🪐 Planet Dossiers
- A slide-over panel with description, fun fact, and 8 real-world stats
  (diameter, distance, day/year length, temperature, moons, gravity, composition)
- One-tap **"Add to star log"** favorites
- **Explorer notes** — leave short star-log comments on any planet

### 🚀 Cosmic Quiz
- 12 questions about the Sun, planets, and the solar system
- Instant feedback with explanations after each answer
- Scores are **persisted to the database** and ranked globally

### 🏆 Leaderboard
- Top explorers ranked by best quiz score & accuracy
- Crown/medal styling for the podium

### 👩‍🚀 Explorers (lightweight auth)
- Pick a handle, name, and signal color — no passwords, no email
- Your session persists in `localStorage`; favorites & scores are tied to you

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| 3D / WebGL | **React Three Fiber** + **@react-three/drei** + **three** |
| Animation | **Framer Motion** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| State | **Zustand** (client) + server components for initial data |
| Database | **Prisma ORM** + **SQLite** |
| Icons | **lucide-react** |
| Fonts | Geist + **Space Grotesk** (display) |

---

## 📂 Project Structure

```
src/
├─ app/
│  ├─ api/                    # REST API route handlers
│  │  ├─ explorers/           # POST create, GET /me
│  │  ├─ planets/             # GET list, GET /[slug] detail + notes
│  │  ├─ favorites/           # GET list, POST toggle
│  │  ├─ quiz/                # GET questions, POST /submit
│  │  ├─ leaderboard/         # GET top explorers
│  │  └─ notes/               # GET / POST planet notes
│  ├─ globals.css             # Cosmic theme (deep-space palette, glass utilities)
│  ├─ layout.tsx              # Root layout, fonts, Toaster
│  └─ page.tsx                # Server component — fetches initial data from DB
├─ components/
│  ├─ three/solar-system.tsx  # The 3D scene (Sun, planets, orbits, camera rig)
│  ├─ three/galaxy-universe.tsx # Milky Way sky + distant real galaxies
│  ├─ explorer-bar.tsx        # Top nav + onboarding modal
│  ├─ hud.tsx                 # Hero overlay + sim controls
│  ├─ planet-info-panel.tsx   # Slide-over dossier + notes
│  ├─ quiz-modal.tsx          # Quiz flow
│  ├─ leaderboard-panel.tsx   # Leaderboard dialog
│  ├─ sections/               # Catalog, stats, quiz CTA, favorites, about
│  ├─ site-footer.tsx
│  └─ ui/                     # shadcn/ui primitives
├─ lib/
│  ├─ db.ts                   # Prisma client singleton
│  ├─ auth.ts                 # Header-based explorer lookup
│  ├─ api.ts                  # Fetcher that injects x-explorer-id
│  ├─ store.ts                # Zustand app store
│  └─ types.ts                # Shared TypeScript types
prisma/
├─ schema.prisma              # Explorer, Planet, Favorite, Note, QuizQuestion, QuizScore
└─ seed.js                    # Seeds 9 celestial bodies + 12 quiz questions
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (or [Bun](https://bun.sh))
- A SQLite-capable environment (no extra install needed)

### Install & run

npm install        # or: bun install


npx prisma db push        # or: bun run db:push


node prisma/seed.js        # or: bun run prisma/seed.js


npm run dev        # or: bun run dev


Open **http://localhost:3000** and start exploring! 🚀

> The database file lives at `db/custom.db` (git-ignored). Run the seed script
> any time to reset the cosmic dataset.

---

## 🗄 Database Schema

```prisma
model Explorer   { handle, name, avatarColor, favorites[], scores[], notes[] }
model Planet     { slug, name, type, color, visualRadius, orbitRadius,
                   orbitSpeed, ringInner/Outer, diameterKm, distanceAu,
                   dayLength, yearLength, temperatureC, moonCount, gravity,
                   description, funFact, composition, ... }
model Favorite   { explorer, planet }              // unique pair
model Note       { explorer, planet, content }     // <= 280 chars
model QuizQuestion { planetSlug?, question, options (JSON), correctIndex, explanation }
model QuizScore  { explorer, score, total, createdAt }
```

---

## 🔌 API Reference

All routes are relative to `/api`. Authenticated routes read the `x-explorer-id`
header (set automatically by the client from `localStorage`).

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/explorers` | Create or sign in an explorer by handle |
| `GET` | `/explorers/me` | Current explorer from header |
| `GET` | `/planets` | All celestial bodies (ordered by orbit) |
| `GET` | `/planets/:slug` | One planet + its notes + favorite count |
| `GET` | `/favorites` | Current explorer's favorite planets |
| `POST` | `/favorites` | Toggle a favorite `{ planetSlug }` |
| `GET` | `/quiz` | All quiz questions (options parsed from JSON) |
| `POST` | `/quiz/submit` | Record a score `{ score, total }` |
| `GET` | `/leaderboard` | Top 10 explorers by best score |
| `GET` | `/notes?planetSlug=` | Notes for a planet |
| `POST` | `/notes` | Post a note `{ planetSlug, content }` |

---

## 🎨 Design Notes

- **Cosmic theme** — a permanently dark, deep-space palette with cyan (primary),
  amber (accent), and violet highlights. No indigo/blue defaults.
- **Glassmorphism** panels (`backdrop-blur` + translucent fills) float over the 3D scene.
- **Aurora gradient text** for hero headlines, **twinkle** animations for accents.
- **Sticky footer** that pins to the viewport on short pages and pushes down on long ones.
- Fully **responsive** — mobile-first HUD, collapsible labels, touch-friendly targets.

---

## 🧪 Example: The Golden Path

1. Click **Become an Explorer** → pick handle `star_voyager` → launch
2. The **quiz auto-opens** → answer 12 questions → see your score
3. Open the **leaderboard** → find yourself ranked
4. Click a **planet** in the 3D scene (or the catalog) → read its dossier
5. Tap **Add to star log** → it appears in your **star log** section
6. Leave a **note** for fellow explorers on any world

---

## 📜 Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Start the Next.js dev server (Turbopack) on port 3000 |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Apply the Prisma schema to SQLite |
| `bun run db:generate` | Regenerate the Prisma Client |
| `bun run prisma/seed.js` | Seed planets + quiz questions |

---

## 🌟 Acknowledgements

- Planet data adapted from public NASA / astronomy references (educational use).
- 3D scene powered by the amazing [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
  & [drei](https://github.com/pmndrs/drei) ecosystem.
- UI primitives by [shadcn/ui](https://ui.shadcn.com/).

---

## 📄 License

MIT — free to use, learn from, and remix. Have fun exploring the cosmos! 🌠
