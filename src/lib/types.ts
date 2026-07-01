// Shared types for Stellarium, matching the Prisma models.

export type PlanetType = 'star' | 'planet' | 'dwarf' | 'moon'

export interface Planet {
  id: string
  slug: string
  name: string
  type: PlanetType
  color: string
  emissive: string
  visualRadius: number
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  ringInner: number | null
  ringOuter: number | null
  ringColor: string | null
  diameterKm: string
  distanceAu: string
  dayLength: string
  yearLength: string
  temperatureC: string
  moonCount: number
  gravity: string
  description: string
  funFact: string
  composition: string
}

export interface PlanetDetail extends Planet {
  favoriteCount: number
  notes: Note[]
}

export interface Explorer {
  id: string
  handle: string
  name: string
  avatarColor: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
  explorer: {
    name: string
    handle: string
    avatarColor: string
  }
}

export interface QuizQuestion {
  id: string
  planetSlug: string | null
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface LeaderboardEntry {
  rank: number
  explorerId: string
  name: string
  handle: string
  avatarColor: string
  score: number
  total: number
  accuracy: number
}
