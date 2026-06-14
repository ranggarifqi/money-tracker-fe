import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, ListOrdered } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MonthSelector } from '@/components/activity/MonthSelector'
import { ActivityList } from '@/components/activity/ActivityList'
import { ActivityDetailSheet } from '@/components/activity/ActivityDetailSheet'
import { useAccounts } from '@/lib/queries/accounts'
import { useActivity } from '@/lib/queries/activity'
import { useAppStore } from '@/store/useAppStore'
import { ACCOUNT_TYPE_LABELS, formatMoney } from '@/lib/format'
import type { ActivityItem } from '@/lib/types'

export function AccountDetailPage() {
  const { id } = useParams()
  const accountId = Number(id)
  const navigate = useNavigate()

  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const account = accounts?.find((a) => a.id === accountId)

  const year = useAppStore((s) => s.year)
  const month = useAppStore((s) => s.month)
  const { data: items, isLoading } = useActivity(year, month, accountId)
  const [selected, setSelected] = useState<ActivityItem | null>(null)

  const back = (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 mb-3 text-muted-foreground"
      onClick={() => navigate('/accounts')}
    >
      <ChevronLeft className="size-4" />
      Accounts
    </Button>
  )

  if (!accountsLoading && !account) {
    return (
      <PageLayout title="Account">
        {back}
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="font-medium">Account not found</p>
          <p className="text-sm text-muted-foreground">
            It may have been removed.
          </p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={account?.name ?? 'Account'}>
      {back}

      {account ? (
        <div className="mb-4">
          <p className="text-2xl font-semibold tabular-nums">
            {formatMoney(account.balance, account.currency)}
          </p>
          <p className="text-sm text-muted-foreground">
            {ACCOUNT_TYPE_LABELS[account.type] ?? account.type} ·{' '}
            {account.currency}
          </p>
        </div>
      ) : (
        <div className="mb-4 space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      )}

      <div className="mb-3">
        <MonthSelector />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState />
      ) : (
        <ActivityList items={items} onSelect={setSelected} />
      )}

      <ActivityDetailSheet
        item={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </PageLayout>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 pt-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <ListOrdered className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No activity this month</p>
        <p className="text-sm text-muted-foreground">
          Nothing recorded for this account this month.
        </p>
      </div>
    </div>
  )
}
