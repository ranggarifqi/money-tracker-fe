import { api } from './client'
import type {
  CreateTransactionRequest,
  Transaction,
  UpdateTransactionRequest,
} from '@/lib/types'

export async function createTransaction(
  body: CreateTransactionRequest,
): Promise<Transaction> {
  const { data } = await api.post<Transaction>('/transactions', body)
  return data
}

export async function updateTransaction(
  id: number,
  body: UpdateTransactionRequest,
): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, body)
  return data
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`)
}
