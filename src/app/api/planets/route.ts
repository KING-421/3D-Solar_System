import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/planets — all celestial bodies, ordered by orbit radius
export async function GET() {
  const planets = await db.planet.findMany({
    orderBy: { orbitRadius: 'asc' },
  })
  return NextResponse.json({ planets })
}
