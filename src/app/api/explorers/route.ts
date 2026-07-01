import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  handle: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle may only contain letters, numbers, and underscores'),
  name: z.string().min(1).max(40).optional(),
  avatarColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'avatarColor must be a hex color')
    .optional(),
})

const COLORS = [
  '#7dd3fc',
  '#f0abfc',
  '#fbbf24',
  '#34d399',
  '#f87171',
  '#a78bfa',
  '#fb923c',
  '#22d3ee',
]

// POST /api/explorers — create a new explorer OR return existing one by handle
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const { handle, name, avatarColor } = parsed.data
    const existing = await db.explorer.findUnique({ where: { handle } })
    if (existing) {
      return NextResponse.json({ explorer: existing })
    }

    const explorer = await db.explorer.create({
      data: {
        handle,
        name: name ?? handle,
        avatarColor: avatarColor ?? COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    })
    return NextResponse.json({ explorer }, { status: 201 })
  } catch (e) {
    console.error('[explorers POST]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
