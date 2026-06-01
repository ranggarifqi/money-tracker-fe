import { useQuery } from '@tanstack/react-query'

import { getSummary } from '@/lib/api/summary'
import { monthDateRange } from '@/lib/format'
import { queryKeys } from './keys'

export function useSummary(year: number, month: number) {
  const { from, to } = monthDateRange(year, month)
  return useQuery({
    queryKey: queryKeys.summary(from, to),
    queryFn: () => getSummary(from, to),
  })
}
