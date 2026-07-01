import { create } from 'zustand'
import type { Explorer, Planet } from '@/lib/types'

interface AppState {
  explorer: Explorer | null
  setExplorer: (e: Explorer | null) => void

  selectedSlug: string | null
  selectPlanet: (slug: string | null) => void

  focusSlug: string | null // planet the camera should fly to
  setFocusSlug: (slug: string | null) => void

  planets: Planet[]
  setPlanets: (p: Planet[]) => void

  favoriteSlugs: Set<string>
  setFavoriteSlugs: (s: Set<string>) => void
  toggleFavoriteSlug: (slug: string) => void

  // UI panels
  quizOpen: boolean
  setQuizOpen: (v: boolean) => void
  leaderboardOpen: boolean
  setLeaderboardOpen: (v: boolean) => void
  onboardOpen: boolean
  setOnboardOpen: (v: boolean) => void

  paused: boolean
  setPaused: (v: boolean) => void

  speed: number // time multiplier for orbits
  setSpeed: (v: number) => void
}

export const useApp = create<AppState>((set) => ({
  explorer: null,
  setExplorer: (e) => set({ explorer: e }),

  selectedSlug: null,
  selectPlanet: (slug) => set({ selectedSlug: slug }),

  focusSlug: null,
  setFocusSlug: (slug) => set({ focusSlug: slug }),

  planets: [],
  setPlanets: (p) => set({ planets: p }),

  favoriteSlugs: new Set<string>(),
  setFavoriteSlugs: (s) => set({ favoriteSlugs: new Set(s) }),
  toggleFavoriteSlug: (slug) =>
    set((state) => {
      const next = new Set(state.favoriteSlugs)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return { favoriteSlugs: next }
    }),

  quizOpen: false,
  setQuizOpen: (v) => set({ quizOpen: v }),
  leaderboardOpen: false,
  setLeaderboardOpen: (v) => set({ leaderboardOpen: v }),
  onboardOpen: false,
  setOnboardOpen: (v) => set({ onboardOpen: v }),

  paused: false,
  setPaused: (v) => set({ paused: v }),

  speed: 1,
  setSpeed: (v) => set({ speed: v }),
}))
