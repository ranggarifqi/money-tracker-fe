import { api } from './client'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/lib/types'

export async function listAccounts(): Promise<Account[]> {
  const { data } = await api.get<Account[]>('/accounts')
  return data ?? []
}

export async function createAccount(
  body: CreateAccountRequest,
): Promise<Account> {
  const { data } = await api.post<Account>('/accounts', body)
  return data
}

export async function updateAccount(
  id: number,
  body: UpdateAccountRequest,
): Promise<Account> {
  const { data } = await api.put<Account>(`/accounts/${id}`, body)
  return data
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/accounts/${id}`)
}

export async function restoreAccount(id: number): Promise<void> {
  await api.post(`/accounts/${id}/restore`)
}
