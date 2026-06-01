import { api } from './client'
import type { Category, CreateCategoryRequest } from '@/lib/types'

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories')
  return data ?? []
}

export async function createCategory(
  body: CreateCategoryRequest,
): Promise<Category> {
  const { data } = await api.post<Category>('/categories', body)
  return data
}
