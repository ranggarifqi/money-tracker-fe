import { useState } from 'react'
import { ListOrdered } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Skeleton } from '@/components/ui/skeleton'
import { MonthSelector } from '@/components/activity/MonthSelector'
import { ActivityList } from '@/components/activity/ActivityList'
import { ActivityDetailSheet } from '@/components/activity/ActivityDetailSheet'
import { useActivity } from '@/lib/queries/activity'
import { useAppStore } from '@/store/useAppStore'
import type { ActivityItem } from '@/lib/types'

export function ActivityPage() {
  const year = useAppStore((s) => s.year)
  const month = useAppStore((s) => s.month)
  const { data: items, isLoading } = useActivity(year, month)
  const [selected, setSelected] = useState<ActivityItem | null>(null)

  return (
    <PageLayout title="Activity">
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
          Tap + to add an income, expense, or transfer.
        </p>
      </div>
    </div>
  )
}
