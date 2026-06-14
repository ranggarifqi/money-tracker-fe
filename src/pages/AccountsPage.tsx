import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Wallet } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmSheet } from '@/components/ui/confirm-sheet'
import { toast } from '@/components/ui/toast'
import { AccountCard } from '@/components/accounts/AccountCard'
import { AccountFormSheet } from '@/components/accounts/AccountFormSheet'
import {
  useAccounts,
  useDeleteAccount,
  useRestoreAccount,
} from '@/lib/queries/accounts'
import { apiErrorMessage } from '@/lib/api/client'
import type { Account } from '@/lib/types'

export function AccountsPage() {
  const navigate = useNavigate()
  const { data: accounts, isLoading } = useAccounts()
  const deleteMut = useDeleteAccount()
  const restoreMut = useRestoreAccount()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [deleting, setDeleting] = useState<Account | null>(null)

  const { active, deleted } = useMemo(() => {
    const list = accounts ?? []
    return {
      active: list.filter((a) => !a.deleted_at),
      deleted: list.filter((a) => a.deleted_at),
    }
  }, [accounts])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(account: Account) {
    setEditing(account)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await deleteMut.mutateAsync(deleting.id)
      toast.success('Account deleted')
      setDeleting(null)
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  async function handleRestore(account: Account) {
    try {
      await restoreMut.mutateAsync(account.id)
      toast.success('Account restored')
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <PageLayout
      title="Accounts"
      action={
        <Button size="icon" variant="ghost" onClick={openCreate} aria-label="Add account">
          <Plus className="size-5" />
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : active.length === 0 && deleted.length === 0 ? (
        <EmptyState onAdd={openCreate} />
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="px-1 text-xs text-muted-foreground">
              Tap an account to see its activity.
            </p>
            {active.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={(a) => navigate(`/accounts/${a.id}`)}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>

          {deleted.length > 0 && (
            <div className="space-y-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Deleted
              </p>
              {deleted.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  deleted
                  onRestore={handleRestore}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AccountFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        account={editing}
      />

      <ConfirmSheet
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete ${deleting?.name ?? 'account'}?`}
        description="The account will be hidden but can be restored later."
        confirmLabel="Delete"
        destructive
        pending={deleteMut.isPending}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Wallet className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">No accounts yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first account to start tracking.
        </p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="size-4" />
        Add account
      </Button>
    </div>
  )
}
