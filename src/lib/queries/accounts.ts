import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createAccount,
  deleteAccount,
  listAccounts,
  restoreAccount,
  updateAccount,
} from '@/lib/api/accounts'
import type {
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/lib/types'
import { queryKeys } from './keys'

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: listAccounts,
  })
}

function useInvalidateAll() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.accounts })
    qc.invalidateQueries({ queryKey: ['activity'] })
    qc.invalidateQueries({ queryKey: ['summary'] })
  }
}

export function useCreateAccount() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: (body: CreateAccountRequest) => createAccount(body),
    onSuccess: invalidate,
  })
}

export function useUpdateAccount() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateAccountRequest }) =>
      updateAccount(id, body),
    onSuccess: invalidate,
  })
}

export function useDeleteAccount() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: invalidate,
  })
}

export function useRestoreAccount() {
  const invalidate = useInvalidateAll()
  return useMutation({
    mutationFn: (id: number) => restoreAccount(id),
    onSuccess: invalidate,
  })
}
