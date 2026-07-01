import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/quiz — all quiz questions (options parsed from JSON)
export async function GET() {
  const questions = await db.quizQuestion.findMany({
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({
    questions: questions.map((q) => ({
      id: q.id,
      planetSlug: q.planetSlug,
      question: q.question,
      options: JSON.parse(q.options),
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })),
  })
}
