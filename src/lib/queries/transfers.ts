import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createTransfer,
  deleteTransfer,
  updateTransfer,
} from '@/lib/api/transfers'
import type {
  CreateTransferRequest,
  UpdateTransferRequest,
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

export function useCreateTransfer() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: (body: CreateTransferRequest) => createTransfer(body),
    onSuccess: invalidate,
  })
}

export function useUpdateTransfer() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTransferRequest }) =>
      updateTransfer(id, body),
    onSuccess: invalidate,
  })
}

export function useDeleteTransfer() {
  const invalidate = useInvalidateLedger()
  return useMutation({
    mutationFn: (id: number) => deleteTransfer(id),
    onSuccess: invalidate,
  })
}
