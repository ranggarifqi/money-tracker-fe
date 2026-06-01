import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/format'
import type { ActivityItem as ActivityItemType } from '@/lib/types'

interface ActivityItemProps {
  item: ActivityItemType
  onClick: () => void
}

export function ActivityRow({ item, onClick }: ActivityItemProps) {
  if (item.type === 'transfer' && item.transfer) {
    const t = item.transfer
    const crossCurrency = t.from_currency !== t.to_currency
    return (
      <Row
        onClick={onClick}
        icon={<ArrowLeftRight className="size-4" />}
        iconClass="bg-muted text-foreground"
        title={`${t.from_account_name} → ${t.to_account_name}`}
        subtitle={t.description || 'Transfer'}
        amount={
          <span className="text-muted-foreground">
            {formatMoney(t.from_amount, t.from_currency)}
            {crossCurrency && (
              <span className="block text-xs">
                {formatMoney(t.to_amount, t.to_currency)}
              </span>
            )}
          </span>
        }
      />
    )
  }

  if (item.transaction) {
    const t = item.transaction
    const isIncome = t.type === 'income'
    return (
      <Row
        onClick={onClick}
        icon={
          isIncome ? (
            <ArrowDownLeft className="size-4" />
          ) : (
            <ArrowUpRight className="size-4" />
          )
        }
        iconClass={
          isIncome
            ? 'bg-success/10 text-success'
            : 'bg-destructive/10 text-destructive'
        }
        title={t.description || t.account_name}
        subtitle={t.account_name}
        amount={
          <span className={cn(isIncome ? 'text-success' : 'text-foreground')}>
            {isIncome ? '+' : '-'}
            {formatMoney(t.amount, t.currency)}
          </span>
        }
      />
    )
  }

  return null
}

function Row({
  icon,
  iconClass,
  title,
  subtitle,
  amount,
  onClick,
}: {
  icon: React.ReactNode
  iconClass: string
  title: string
  subtitle: string
  amount: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors active:bg-accent"
    >
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          iconClass,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="shrink-0 text-right text-sm font-semibold tabular-nums">
        {amount}
      </div>
    </button>
  )
}
