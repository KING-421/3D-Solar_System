'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Gauge, MousePointerClick, Orbit } from 'lucide-react'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export function Hud() {
  const planets = useApp((s) => s.planets)
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)
  const selectedSlug = useApp((s) => s.selectedSlug)
  const paused = useApp((s) => s.paused)
  const setPaused = useApp((s) => s.setPaused)
  const speed = useApp((s) => s.speed)
  const setSpeed = useApp((s) => s.setSpeed)

  const focus = (slug: string) => {
    selectPlanet(slug)
    setFocusSlug(slug)
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top: hero title */}
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
            <span className="h-1.5 w-1.5 animate-twinkle rounded-full bg-cyan-300" />
            Interactive Cosmos
          </span>
        </motion.div>
        <motion.h1
          className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="aurora-text">Explore the Solar System</span>
        </motion.h1>
        <motion.p
          className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Drag to orbit the camera. Click any planet to fly in, read its dossier,
          and save it to your star log.
        </motion.p>
      </div>

      {/* Bottom: controls + planet chips */}
      <div className="flex flex-col items-center gap-3">
        {/* Planet quick-select */}
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full glass-strong px-2 py-2">
          {planets.map((p) => (
            <button
              key={p.slug}
              onClick={() => focus(p.slug)}
              className={cn(
                'group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                selectedSlug === p.slug
                  ? 'bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-300/50'
                  : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/20"
                style={{
                  backgroundColor: p.color,
                  boxShadow: p.type === 'star' ? `0 0 10px ${p.color}` : 'none',
                }}
              />
              {p.name}
            </button>
          ))}
        </div>

        {/* Sim controls */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-full glass px-2 py-1.5">
          <button
            onClick={() => setPaused(!paused)}
            className="grid h-8 w-8 place-items-center rounded-full bg-card/60 text-foreground transition-colors hover:bg-card"
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2 px-1">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex gap-1">
              {[
                { label: '0.5x', value: 0.5 },
                { label: '1x', value: 1 },
                { label: '2x', value: 2 },
                { label: '4x', value: 4 },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors',
                    speed === s.value
                      ? 'bg-cyan-400/25 text-cyan-100'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-1.5 border-l border-border/50 pl-2 text-[11px] text-muted-foreground sm:flex">
            <MousePointerClick className="h-3.5 w-3.5" />
            <span>Drag to orbit</span>
            <span className="mx-1">·</span>
            <Orbit className="h-3.5 w-3.5" />
            <span>Scroll to zoom</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// AnimatePresence wrapper kept for potential future use
export function HudAnimations({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>
}
