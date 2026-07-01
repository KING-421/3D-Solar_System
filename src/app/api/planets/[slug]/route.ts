import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/planets/[slug] — single planet with notes & favorite count
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const planet = await db.planet.findUnique({ where: { slug } })
  if (!planet) {
    return NextResponse.json({ error: 'Planet not found' }, { status: 404 })
  }

  const [favoriteCount, notes] = await Promise.all([
    db.favorite.count({ where: { planetId: planet.id } }),
    db.note.findMany({
      where: { planetId: planet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        explorer: {
          select: { name: true, handle: true, avatarColor: true },
        },
      },
    }),
  ])

  return NextResponse.json({ planet, favoriteCount, notes })
}
