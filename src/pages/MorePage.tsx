import { useNavigate, Link } from 'react-router'
import { ChevronRight, LogOut, Shapes, User as UserIcon } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/auth'
import { clearStoredUser } from '@/lib/auth-storage'
import { useAppStore } from '@/store/useAppStore'

export function MorePage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)

  async function handleLogout() {
    try {
      await logout()
    } catch {
      /* ignore network errors — we clear local state regardless */
    }
    clearStoredUser()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <PageLayout title="More">
      <div className="space-y-4">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted">
            <UserIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{user?.name || 'Signed in'}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user?.email || ''}
            </p>
          </div>
        </Card>

        <Card className="divide-y">
          <Link
            to="/categories"
            className="flex items-center gap-3 p-4 active:bg-accent"
          >
            <Shapes className="size-5 text-muted-foreground" />
            <span className="flex-1 font-medium">Categories</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </Card>

        <Button
          variant="outline"
          className="w-full text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </PageLayout>
  )
}
