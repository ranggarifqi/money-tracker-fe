import { api } from './client'
import type {
  CreateTransferRequest,
  Transfer,
  UpdateTransferRequest,
} from '@/lib/types'

export async function createTransfer(
  body: CreateTransferRequest,
): Promise<Transfer> {
  const { data } = await api.post<Transfer>('/transfers', body)
  return data
}

export async function updateTransfer(
  id: number,
  body: UpdateTransferRequest,
): Promise<Transfer> {
  const { data } = await api.put<Transfer>(`/transfers/${id}`, body)
  return data
}

export async function deleteTransfer(id: number): Promise<void> {
  await api.delete(`/transfers/${id}`)
}
