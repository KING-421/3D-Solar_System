'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ExplorerBar } from '@/components/explorer-bar'
import { Hud } from '@/components/hud'
import { PlanetInfoPanel } from '@/components/planet-info-panel'
import { QuizModal } from '@/components/quiz-modal'
import { LeaderboardPanel } from '@/components/leaderboard-panel'
import { PlanetCatalog } from '@/components/sections/planet-catalog'
import { StatsSection } from '@/components/sections/stats-section'
import { QuizCta, AboutSection } from '@/components/sections/quiz-cta'
import { FavoritesSection } from '@/components/sections/favorites-section'
import { SiteFooter } from '@/components/site-footer'
import { useApp } from '@/lib/store'
import { api, getStoredExplorerId } from '@/lib/api'
import type { Planet } from '@/lib/types'

// The 3D canvas must run client-side only (Three.js needs the DOM).
const SolarSystem = dynamic(
  () => import('@/components/three/solar-system'),
  { ssr: false, loading: () => <SceneSkeleton /> },
)

function SceneSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#05060f]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-amber-300/20" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Igniting engines…
        </p>
      </div>
    </div>
  )
}

export function StellariumApp({
  initialPlanets,
  questionCount,
  explorerCount,
}: {
  initialPlanets: Planet[]
  questionCount: number
  explorerCount: number
}) {
  const setPlanets = useApp((s) => s.setPlanets)
  const explorer = useApp((s) => s.explorer)
  const setFavoriteSlugs = useApp((s) => s.setFavoriteSlugs)
  const [ready, setReady] = useState(false)

  // Seed planets into the store immediately
  useEffect(() => {
    setPlanets(initialPlanets)
  }, [initialPlanets, setPlanets])

  // When an explorer becomes available, load their favorites
  useEffect(() => {
    if (!explorer) {
      setFavoriteSlugs(new Set())
      return
    }
    api
      .get<{ favorites: Planet[] }>('/api/favorites')
      .then((r) => setFavoriteSlugs(new Set(r.favorites.map((f) => f.slug))))
      .catch(() => setFavoriteSlugs(new Set()))
  }, [explorer, setFavoriteSlugs])

  // Mark ready after first paint to allow the canvas to mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <ExplorerBar />

      {/* Hero: full-viewport 3D solar system */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        {ready && <SolarSystem />}
        <Hud />
        <PlanetInfoPanel />

        {/* Top + bottom gradient veils for readability of overlay text */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Lower content */}
      <main className="flex-1">
        <StatsSection
          planetCount={initialPlanets.length}
          questionCount={questionCount}
          explorerCount={explorerCount}
        />
        <PlanetCatalog />
        <QuizCta />
        <FavoritesSection />
        <AboutSection />
      </main>

      <SiteFooter />

      {/* Global overlays */}
      <QuizModal />
      <LeaderboardPanel />
    </>
  )
}

// Re-export for convenience if needed elsewhere
export { getStoredExplorerId }
