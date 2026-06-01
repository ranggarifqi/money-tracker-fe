import { create } from 'zustand'
import type { User } from '@/lib/types'
import { getStoredUser } from '@/lib/auth-storage'

interface AppState {
  // Auth
  user: User | null
  authReady: boolean // true once we've checked the session at least once
  setUser: (user: User | null) => void
  setAuthReady: (ready: boolean) => void

  // Selected month for activity / summary views
  year: number
  month: number // 1-12
  setMonth: (year: number, month: number) => void
  prevMonth: () => void
  nextMonth: () => void
}

const now = new Date()

export const useAppStore = create<AppState>((set) => ({
  user: getStoredUser(),
  authReady: false,
  setUser: (user) => set({ user }),
  setAuthReady: (authReady) => set({ authReady }),

  year: now.getFullYear(),
  month: now.getMonth() + 1,
  setMonth: (year, month) => set({ year, month }),
  prevMonth: () =>
    set((s) => {
      const m = s.month - 1
      return m < 1 ? { year: s.year - 1, month: 12 } : { month: m }
    }),
  nextMonth: () =>
    set((s) => {
      const m = s.month + 1
      return m > 12 ? { year: s.year + 1, month: 1 } : { month: m }
    }),
}))
