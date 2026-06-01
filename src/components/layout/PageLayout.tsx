import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageLayoutProps {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

// Standard authenticated page shell: sticky header + scrollable content with
// padding that clears the fixed bottom nav.
export function PageLayout({
  title,
  action,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {title && (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 pb-3 pt-[calc(0.75rem+var(--safe-top))] backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {action}
        </header>
      )}
      <main
        className={cn(
          'flex-1 px-4 py-4 pb-[calc(5.5rem+var(--safe-bottom))]',
          className,
        )}
      >
        {children}
      </main>
    </div>
  )
}
