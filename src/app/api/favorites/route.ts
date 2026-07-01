import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExplorer } from '@/lib/auth'

// GET /api/favorites — list the current explorer's favorite planets
export async function GET() {
  const explorer = await getExplorer()
  if (!explorer) {
    return NextResponse.json({ favorites: [] })
  }
  const favorites = await db.favorite.findMany({
    where: { explorerId: explorer.id },
    include: { planet: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({
    favorites: favorites.map((f) => ({ ...f.planet, favoritedAt: f.createdAt })),
  })
}

// POST /api/favorites — toggle a favorite on/off
// body: { planetSlug: string }
export async function POST(req: Request) {
  const explorer = await getExplorer()
  if (!explorer) {
    return NextResponse.json({ error: 'Sign in as an explorer to save favorites' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const planetSlug = body?.planetSlug
  if (typeof planetSlug !== 'string') {
    return NextResponse.json({ error: 'planetSlug is required' }, { status: 400 })
  }

  const planet = await db.planet.findUnique({ where: { slug: planetSlug } })
  if (!planet) {
    return NextResponse.json({ error: 'Planet not found' }, { status: 404 })
  }

  const existing = await db.favorite.findUnique({
    where: {
      explorerId_planetId: { explorerId: explorer.id, planetId: planet.id },
    },
  })

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  }

  await db.favorite.create({
    data: { explorerId: explorer.id, planetId: planet.id },
  })
  return NextResponse.json({ favorited: true })
}
