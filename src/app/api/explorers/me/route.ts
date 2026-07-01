import { NextResponse } from 'next/server'
import { getExplorer } from '@/lib/auth'

// GET /api/explorers/me — current explorer from x-explorer-id header
export async function GET() {
  const explorer = await getExplorer()
  if (!explorer) {
    return NextResponse.json({ explorer: null }, { status: 200 })
  }
  return NextResponse.json({ explorer })
}
