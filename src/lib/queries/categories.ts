import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createCategory, listCategories } from '@/lib/api/categories'
import type { CreateCategoryRequest } from '@/lib/types'
import { queryKeys } from './keys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: listCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => createCategory(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}
