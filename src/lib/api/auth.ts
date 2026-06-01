import { api } from './client'
import type { LoginRequest, User } from '@/lib/types'

export async function login(body: LoginRequest): Promise<User> {
  const { data } = await api.post<User>('/auth/login', body)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
