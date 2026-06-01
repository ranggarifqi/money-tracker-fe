import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatMonthLabel } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'

export function MonthSelector() {
  const { year, month, prevMonth, nextMonth } = useAppStore()

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={prevMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <span className="text-sm font-medium">
        {formatMonthLabel(year, month)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
        aria-label="Next month"
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  )
}
