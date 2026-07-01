import { db } from '@/lib/db'
import { headers } from 'next/headers'

/**
 * Lightweight handle-based "auth".
 * The client stores the explorer id in localStorage and sends it via the
 * `x-explorer-id` header. No passwords — this is a demo space exploration app.
 */
export async function getExplorer(): Promise<{
  id: string
  handle: string
  name: string
  avatarColor: string
} | null> {
  const h = await headers()
  const id = h.get('x-explorer-id')
  if (!id) return null
  const explorer = await db.explorer.findUnique({
    where: { id },
    select: { id: true, handle: true, name: true, avatarColor: true },
  })
  return explorer
}

export async function requireExplorer() {
  const explorer = await getExplorer()
  if (!explorer) {
    throw new Error('UNAUTHORIZED')
  }
  return explorer
}
