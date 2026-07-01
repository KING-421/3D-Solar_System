import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExplorer } from '@/lib/auth'

// POST /api/quiz/submit — record a quiz score for the current explorer
// body: { score: number, total: number }
export async function POST(req: Request) {
  const explorer = await getExplorer()
  if (!explorer) {
    return NextResponse.json(
      { error: 'Sign in as an explorer to submit your score' },
      { status: 401 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const score = Number(body?.score)
  const total = Number(body?.total)
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
    return NextResponse.json({ error: 'score and total are required' }, { status: 400 })
  }

  const record = await db.quizScore.create({
    data: {
      explorerId: explorer.id,
      score: Math.max(0, Math.floor(score)),
      total: Math.floor(total),
    },
  })

  return NextResponse.json({ record }, { status: 201 })
}
