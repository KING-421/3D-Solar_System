import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/leaderboard — top explorers by best score (and accuracy as tiebreak)
export async function GET() {
  const rows = await db.quizScore.findMany({
    include: {
      explorer: {
        select: { id: true, name: true, handle: true, avatarColor: true },
      },
    },
    orderBy: { score: 'desc' },
    take: 200,
  })

  // Keep each explorer's best score only
  const byExplorer = new Map<string, (typeof rows)[number]>()
  for (const r of rows) {
    const prev = byExplorer.get(r.explorerId)
    if (!prev || r.score > prev.score) byExplorer.set(r.explorerId, r)
  }

  const leaderboard = [...byExplorer.values()]
    .sort((a, b) => b.score - a.score || b.total - a.total)
    .slice(0, 10)
    .map((r, i) => ({
      rank: i + 1,
      explorerId: r.explorer.id,
      name: r.explorer.name,
      handle: r.explorer.handle,
      avatarColor: r.explorer.avatarColor,
      score: r.score,
      total: r.total,
      accuracy: Math.round((r.score / r.total) * 100),
    }))

  return NextResponse.json({ leaderboard })
}
