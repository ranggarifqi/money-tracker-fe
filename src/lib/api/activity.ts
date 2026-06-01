import { api } from './client'
import type { ActivityItem } from '@/lib/types'

export async function listActivity(
  year: number,
  month: number,
): Promise<ActivityItem[]> {
  const { data } = await api.get<ActivityItem[]>('/activity', {
    params: { year, month },
  })
  return data ?? []
}
