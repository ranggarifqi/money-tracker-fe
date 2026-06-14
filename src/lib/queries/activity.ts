import { useQuery } from '@tanstack/react-query'

import { listActivity } from '@/lib/api/activity'
import { queryKeys } from './keys'

export function useActivity(year: number, month: number, accountId?: number) {
  return useQuery({
    queryKey: queryKeys.activity(year, month, accountId),
    queryFn: () => listActivity(year, month, accountId),
  })
}
