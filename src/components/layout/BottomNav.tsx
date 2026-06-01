import { NavLink } from 'react-router'
import { Home, ListOrdered, Wallet, Menu, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

interface BottomNavProps {
  onAdd: () => void
}

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/activity', label: 'Activity', icon: ListOrdered, end: false },
  { to: '/accounts', label: 'Accounts', icon: Wallet, end: false },
  { to: '/more', label: 'More', icon: Menu, end: false },
]

export function BottomNav({ onAdd }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[var(--safe-bottom)] backdrop-blur">
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-5 items-center">
        {items.slice(0, 2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* Center add button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onAdd}
            aria-label="Add record"
            className="flex size-14 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
          >
            <Plus className="size-6" />
          </button>
        </div>

        {items.slice(2).map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof Home
  end: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground',
        )
      }
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </NavLink>
  )
}
