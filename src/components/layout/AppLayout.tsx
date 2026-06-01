import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'

import { setUnauthorizedHandler } from '@/lib/api/client'
import { useAccounts } from '@/lib/queries/accounts'
import { clearStoredUser } from '@/lib/auth-storage'
import { useAppStore } from '@/store/useAppStore'
import { BottomNav } from './BottomNav'
import { AddRecordSheet } from '@/components/forms/AddRecordSheet'

export function AppLayout() {
  const navigate = useNavigate()
  const setUser = useAppStore((s) => s.setUser)
  const [addOpen, setAddOpen] = useState(false)

  // Redirect to login whenever any request returns 401.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearStoredUser()
      setUser(null)
      navigate('/login', { replace: true })
    })
    return () => setUnauthorizedHandler(() => {})
  }, [navigate, setUser])

  // Probe the session. This same query also powers the Accounts page.
  const { isLoading, isError } = useAccounts()

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // On a 401 the interceptor already redirected; render nothing meanwhile.
  if (isError) return null

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <Outlet />
      <BottomNav onAdd={() => setAddOpen(true)} />
      <AddRecordSheet open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
