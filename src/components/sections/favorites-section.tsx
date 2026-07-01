'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2, Orbit } from 'lucide-react'
import { useApp } from '@/lib/store'
import { api } from '@/lib/api'
import type { Planet } from '@/lib/types'

type FavPlanet = Planet & { favoritedAt: string }

export function FavoritesSection() {
  const explorer = useApp((s) => s.explorer)
  const favoriteSlugs = useApp((s) => s.favoriteSlugs)
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)

  const [favs, setFavs] = useState<FavPlanet[]>([])
  const [loading, setLoading] = useState(false)

  // Re-fetch whenever the favorites set changes (count change) or explorer changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!explorer) {
      setFavs([])
      return
    }
    setLoading(true)
    api
      .get<{ favorites: FavPlanet[] }>('/api/favorites')
      .then((r) => setFavs(r.favorites))
      .finally(() => setLoading(false))
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [explorer, favoriteSlugs.size])

  if (!explorer) return null

  const explore = (slug: string) => {
    selectPlanet(slug)
    setFocusSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-5 w-5 text-rose-400" />
        <h2 className="font-display text-2xl font-bold">Your star log</h2>
        <span className="text-sm text-muted-foreground">({favs.length})</span>
      </div>

      {loading ? (
        <div className="grid h-32 place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
        </div>
      ) : favs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
          <Orbit className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No saved worlds yet. Open a planet above and tap{' '}
            <span className="font-medium text-rose-200">Add to star log</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {favs.map((p) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => explore(p.slug)}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-4 text-left transition-colors hover:border-rose-300/40 hover:bg-card/50"
              >
                <div
                  className="mx-auto mb-3 h-14 w-14 rounded-full transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 24px ${p.color}55, inset 0 0 10px rgba(0,0,0,0.25)`,
                  }}
                />
                <div className="text-center">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] capitalize text-muted-foreground">
                    {p.type}
                  </div>
                </div>
                <Heart className="absolute right-2.5 top-2.5 h-3.5 w-3.5 fill-rose-400 text-rose-400" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
