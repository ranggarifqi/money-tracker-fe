import axios from 'axios'

// All requests go to the backend under /v1. In dev, Vite proxies /v1 to the
// API server (see vite.config.ts). Cookies (auth_token) are sent automatically.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/v1',
  withCredentials: true,
})

// Callback registered by the app to react to auth loss (e.g. redirect to login).
let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    const url: string = error?.config?.url ?? ''
    // Don't trigger the global handler for the login call itself — the login
    // form shows its own inline error.
    if (status === 401 && !url.includes('/auth/login')) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

// Extract a human-readable message from an axios error.
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined
    return data?.error || data?.message || error.message || fallback
  }
  return fallback
}
