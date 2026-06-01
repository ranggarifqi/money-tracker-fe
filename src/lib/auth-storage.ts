import type { User } from '@/lib/types'

// The HttpOnly auth cookie is the real source of truth for authentication.
// We additionally cache the user's display info (name/email) in localStorage so
// the profile survives a page refresh — the backend has no "current user"
// endpoint to re-fetch it.
const KEY = 'mt_user'

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(user))
  } catch {
    /* ignore */
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
