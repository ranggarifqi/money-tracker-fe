import { create } from 'zustand'
import { CheckCircle2, XCircle, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastStore {
  toasts: ToastItem[]
  push: (message: string, variant?: ToastVariant) => void
  dismiss: (id: number) => void
}

let counter = 0

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, variant = 'info') => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string) =>
    useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  info: (message: string) => useToastStore.getState().push(message, 'info'),
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+var(--safe-top))] z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = icons[t.variant]
        return (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm shadow-lg animate-in slide-in-from-top-2',
              t.variant === 'success' && 'text-success',
              t.variant === 'error' && 'text-destructive',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-card-foreground">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
