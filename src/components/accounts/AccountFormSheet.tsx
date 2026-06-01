import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { ACCOUNT_TYPES, CURRENCIES } from '@/lib/currencies'
import { apiErrorMessage } from '@/lib/api/client'
import { useCreateAccount, useUpdateAccount } from '@/lib/queries/accounts'
import type { Account, AccountType } from '@/lib/types'

interface AccountFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: Account | null // present => edit mode
}

export function AccountFormSheet({
  open,
  onOpenChange,
  account,
}: AccountFormSheetProps) {
  // Rendering the body only while open means it mounts fresh on each open,
  // initializing state from props — no prop-to-state syncing effect needed.
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{account ? 'Edit account' : 'New account'}</DrawerTitle>
        </DrawerHeader>
        {open && (
          <AccountFormBody
            account={account}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}

function AccountFormBody({
  account,
  onDone,
}: {
  account?: Account | null
  onDone: () => void
}) {
  const isEdit = !!account
  const createMut = useCreateAccount()
  const updateMut = useUpdateAccount()

  const [name, setName] = useState(account?.name ?? '')
  const [type, setType] = useState<AccountType>(account?.type ?? 'cash')
  const [currency, setCurrency] = useState(account?.currency ?? 'IDR')
  const [initialBalance, setInitialBalance] = useState(
    String(account?.initialBalance ?? 0),
  )
  const [treatAsExpense, setTreatAsExpense] = useState(
    account?.shouldTreatAsExpense ?? false,
  )

  const pending = createMut.isPending || updateMut.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const amount = Number(initialBalance)
    if (Number.isNaN(amount)) {
      toast.error('Initial balance must be a number')
      return
    }
    try {
      if (isEdit && account) {
        await updateMut.mutateAsync({
          id: account.id,
          body: {
            name: name.trim(),
            type,
            initial_balance: amount,
            treat_as_expense: treatAsExpense,
          },
        })
        toast.success('Account updated')
      } else {
        await createMut.mutateAsync({
          name: name.trim(),
          type,
          currency,
          initial_balance: amount,
          treat_as_expense: treatAsExpense,
        })
        toast.success('Account created')
      }
      onDone()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 overflow-y-auto px-4"
    >
      <div className="space-y-2">
        <Label htmlFor="acc-name">Name</Label>
        <Input
          id="acc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Main Bank"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Currency</Label>
        <Select value={currency} onValueChange={setCurrency} disabled={isEdit}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} — {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEdit && (
          <p className="text-xs text-muted-foreground">
            Currency can't be changed after creation.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="acc-balance">Initial balance</Label>
        <Input
          id="acc-balance"
          type="number"
          inputMode="decimal"
          step="any"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          required
        />
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="acc-treat">Treat as expense</Label>
          <p className="text-xs text-muted-foreground">
            For savings/investments. Transfers in won't count as income.
          </p>
        </div>
        <Switch
          id="acc-treat"
          checked={treatAsExpense}
          onCheckedChange={setTreatAsExpense}
        />
      </div>

      <DrawerFooter className="px-0">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create account'}
        </Button>
      </DrawerFooter>
    </form>
  )
}
