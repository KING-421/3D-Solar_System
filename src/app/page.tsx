import { db } from '@/lib/db'
import { StellariumApp } from '@/components/stellarium-app'

// Server component — fetch initial data straight from the database
// so the first paint already has the planet catalog (no loading flash).
export default async function Home() {
  const [planets, questionCount, explorerCount] = await Promise.all([
    db.planet.findMany({ orderBy: { orbitRadius: 'asc' } }),
    db.quizQuestion.count(),
    db.explorer.count(),
  ])

  return (
    <StellariumApp
      initialPlanets={planets}
      questionCount={questionCount}
      explorerCount={explorerCount}
    />
  )
}
