import { useMemo } from 'react'

import { formatDate } from '@/lib/format'
import type { ActivityItem } from '@/lib/types'
import { ActivityRow } from './ActivityItem'

interface ActivityListProps {
  items: ActivityItem[]
  onSelect: (item: ActivityItem) => void
}

export function ActivityList({ items, onSelect }: ActivityListProps) {
  // Group by calendar day, preserving the API's date-desc ordering.
  const groups = useMemo(() => {
    const map = new Map<string, ActivityItem[]>()
    for (const item of items) {
      const day = item.date.slice(0, 10)
      const arr = map.get(day)
      if (arr) arr.push(item)
      else map.set(day, [item])
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div className="space-y-5">
      {groups.map(([day, dayItems]) => (
        <div key={day}>
          <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {formatDate(day)}
          </p>
          <div className="space-y-0.5">
            {dayItems.map((item, idx) => (
              <ActivityRow
                key={`${item.type}-${item.transaction?.id ?? item.transfer?.id}-${idx}`}
                item={item}
                onClick={() => onSelect(item)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
