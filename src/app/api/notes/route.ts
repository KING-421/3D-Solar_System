import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getExplorer } from '@/lib/auth'

// GET /api/notes?planetSlug=earth — notes for a planet
export async function GET(req: NextRequest) {
  const planetSlug = req.nextUrl.searchParams.get('planetSlug')
  if (!planetSlug) {
    return NextResponse.json({ error: 'planetSlug query param is required' }, { status: 400 })
  }
  const planet = await db.planet.findUnique({ where: { slug: planetSlug } })
  if (!planet) {
    return NextResponse.json({ error: 'Planet not found' }, { status: 404 })
  }
  const notes = await db.note.findMany({
    where: { planetId: planet.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      explorer: { select: { name: true, handle: true, avatarColor: true } },
    },
  })
  return NextResponse.json({ notes })
}

// POST /api/notes — leave a star log note on a planet
// body: { planetSlug: string, content: string }
export async function POST(req: NextRequest) {
  const explorer = await getExplorer()
  if (!explorer) {
    return NextResponse.json(
      { error: 'Sign in as an explorer to leave a note' },
      { status: 401 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const planetSlug = body?.planetSlug
  const content = typeof body?.content === 'string' ? body.content.trim() : ''
  if (!planetSlug || !content) {
    return NextResponse.json(
      { error: 'planetSlug and content are required' },
      { status: 400 },
    )
  }
  if (content.length > 280) {
    return NextResponse.json({ error: 'Note must be 280 characters or fewer' }, { status: 400 })
  }

  const planet = await db.planet.findUnique({ where: { slug: planetSlug } })
  if (!planet) {
    return NextResponse.json({ error: 'Planet not found' }, { status: 404 })
  }

  const note = await db.note.create({
    data: { explorerId: explorer.id, planetId: planet.id, content },
    include: {
      explorer: { select: { name: true, handle: true, avatarColor: true } },
    },
  })
  return NextResponse.json({ note }, { status: 201 })
}
