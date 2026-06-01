import { Link } from 'react-router'
import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ActivityList } from '@/components/activity/ActivityList'
import { ActivityDetailSheet } from '@/components/activity/ActivityDetailSheet'
import { useSummary } from '@/lib/queries/summary'
import { useActivity } from '@/lib/queries/activity'
import { formatMonthLabel } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import type { ActivityItem } from '@/lib/types'

function formatNumber(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export function HomePage() {
  const user = useAppStore((s) => s.user)
  const year = useAppStore((s) => s.year)
  const month = useAppStore((s) => s.month)

  const { data: summary, isLoading: summaryLoading } = useSummary(year, month)
  const { data: activity, isLoading: activityLoading } = useActivity(year, month)
  const [selected, setSelected] = useState<ActivityItem | null>(null)

  const recent = (activity ?? []).slice(0, 5)

  return (
    <PageLayout title={user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Home'}>
      <div className="space-y-6">
        {/* Net worth / balances */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="space-y-1 p-5">
            <p className="text-sm opacity-80">Spendable balance</p>
            {summaryLoading ? (
              <Skeleton className="h-9 w-40 bg-primary-foreground/20" />
            ) : (
              <p className="text-3xl font-bold tabular-nums">
                {formatNumber(summary?.balances.spendable ?? 0)}
              </p>
            )}
            <div className="flex gap-4 pt-2 text-xs opacity-80">
              <span>Total {formatNumber(summary?.balances.total ?? 0)}</span>
              <span>Locked {formatNumber(summary?.balances.locked ?? 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly cash flow */}
        <div>
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {formatMonthLabel(year, month)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FlowCard
              label="Income"
              value={summary?.cash_flow.income ?? 0}
              loading={summaryLoading}
              positive
            />
            <FlowCard
              label="Expenses"
              value={summary?.cash_flow.expenses ?? 0}
              loading={summaryLoading}
            />
          </div>
          <Card className="mt-3">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Net this month</span>
              {summaryLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <span
                  className={cn(
                    'font-semibold tabular-nums',
                    (summary?.cash_flow.net ?? 0) >= 0
                      ? 'text-success'
                      : 'text-destructive',
                  )}
                >
                  {formatNumber(summary?.cash_flow.net ?? 0)}
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between px-1 pb-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recent activity
            </p>
            <Link
              to="/activity"
              className="flex items-center text-xs font-medium text-primary"
            >
              See all
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {activityLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activity yet this month.
            </p>
          ) : (
            <ActivityList items={recent} onSelect={setSelected} />
          )}
        </div>
      </div>

      <ActivityDetailSheet
        item={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </PageLayout>
  )
}

function FlowCard({
  label,
  value,
  loading,
  positive,
}: {
  label: string
  value: number
  loading: boolean
  positive?: boolean
}) {
  const Icon = positive ? ArrowDownLeft : ArrowUpRight
  return (
    <Card>
      <CardContent className="space-y-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon
            className={cn(
              'size-3.5',
              positive ? 'text-success' : 'text-destructive',
            )}
          />
          {label}
        </div>
        {loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <p className="text-lg font-semibold tabular-nums">
            {formatNumber(value)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
