// Lightweight fetcher that injects the explorer id header from localStorage.
const STORAGE_KEY = 'stellarium.explorer'

export function getStoredExplorerId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredExplorerId(id: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function clearStoredExplorerId() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const explorerId = getStoredExplorerId()
  const headers = new Headers(options.headers)
  if (explorerId) headers.set('x-explorer-id', explorerId)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      (data && (data.error as string)) || `Request failed (${res.status})`
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
}
