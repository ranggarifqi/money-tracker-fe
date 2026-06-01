import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '@/lib/api/transactions'
import type {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '@/lib/types'
import { queryKeys } from './keys'

function useInvalidateLedger() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['activity'] })
    qc.invalidateQueries({ queryKey: ['summary'] })
    qc.invalidateQueries({ queryKey: queryKeys.accounts })
  }
}

export function useCreateTransaction() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: (body: CreateTransactionRequest) => createTransaction(body),
    onSuccess: invalidate,
  })
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number
      body: UpdateTransactionRequest
    }) => updateTransaction(id, body),
    onSuccess: invalidate,
  })
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: invalidate,
  })
}
