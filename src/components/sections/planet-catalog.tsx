'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Orbit } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Planet } from '@/lib/types'

export function PlanetCatalog() {
  const planets = useApp((s) => s.planets)
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)

  const explore = (slug: string) => {
    selectPlanet(slug)
    setFocusSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
            <Orbit className="h-3.5 w-3.5" /> Catalog
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Worlds of our solar system
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Tap any world to fly the camera to it in the live 3D scene above and
            open its full dossier.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {planets.map((p, i) => (
          <PlanetCard key={p.slug} planet={p} index={i} onExplore={() => explore(p.slug)} />
        ))}
      </div>
    </section>
  )
}

function PlanetCard({ planet, index, onExplore }: { planet: Planet; index: number; onExplore: () => void }) {
  return (
    <motion.button
      onClick={onExplore}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-5 text-left transition-all hover:border-cyan-300/40 hover:bg-card/50"
    >
      {/* Glow blob */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: planet.color }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="relative grid h-12 w-12 place-items-center rounded-2xl"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 24px ${planet.color}66, inset 0 0 12px rgba(0,0,0,0.25)`,
            }}
          >
            {planet.type === 'star' && (
              <span className="absolute inset-0 rounded-2xl ring-2 ring-amber-200/40 animate-pulse-ring" />
            )}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold leading-none">
              {planet.name}
            </h3>
            <span className="text-xs capitalize text-muted-foreground">{planet.type}</span>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
      </div>

      <p className="relative mt-3 line-clamp-2 text-sm text-muted-foreground">
        {planet.description}
      </p>

      <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Distance" value={planet.distanceAu} />
        <MiniStat label="Moons" value={String(planet.moonCount)} />
        <MiniStat label="Gravity" value={planet.gravity} />
      </div>
    </motion.button>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 px-2 py-1.5">
      <div className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="truncate text-xs font-medium">{value}</div>
    </div>
  )
}
