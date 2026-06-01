import { api } from './client'
import type { CategorySummaryResult, Summary } from '@/lib/types'

// from / to are YYYY-MM-DD ISO dates.
export async function getSummary(from: string, to: string): Promise<Summary> {
  const { data } = await api.get<Summary>('/summary', {
    params: { from, to },
  })
  return data
}

export async function getCategorySummary(
  year: number,
  month: number,
  type?: 'income' | 'expense',
): Promise<CategorySummaryResult> {
  const { data } = await api.get<CategorySummaryResult>('/summary/categories', {
    params: { year, month, ...(type ? { type } : {}) },
  })
  return data
}
