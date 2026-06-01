import { useMemo, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DrawerFooter } from '@/components/ui/drawer'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/client'
import { useAccounts } from '@/lib/queries/accounts'
import { useCategories } from '@/lib/queries/categories'
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '@/lib/queries/transactions'
import { todayISO } from '@/lib/format'
import type { TransactionType } from '@/lib/types'

export interface TransactionInitial {
  id: number
  accountId: number
  categoryId: number
  amount: number
  date: string
  description: string
}

interface TransactionFormProps {
  type: TransactionType
  initial?: TransactionInitial // present => edit mode
  onSuccess: () => void
}

export function TransactionForm({
  type,
  initial,
  onSuccess,
}: TransactionFormProps) {
  const isEdit = !!initial
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const createMut = useCreateTransaction()
  const updateMut = useUpdateTransaction()

  const activeAccounts = useMemo(
    () => (accounts ?? []).filter((a) => !a.deletedAt),
    [accounts],
  )
  const typeCategories = useMemo(
    () => (categories ?? []).filter((c) => c.type === type),
    [categories, type],
  )

  const [accountId, setAccountId] = useState<string>(
    initial ? String(initial.accountId) : '',
  )
  const [categoryId, setCategoryId] = useState<string>(
    initial ? String(initial.categoryId) : '',
  )
  const [amount, setAmount] = useState<string>(
    initial ? String(initial.amount) : '',
  )
  const [date, setDate] = useState<string>(initial?.date.slice(0, 10) ?? todayISO())
  const [description, setDescription] = useState(initial?.description ?? '')

  const selectedAccount = activeAccounts.find(
    (a) => String(a.id) === accountId,
  )
  const pending = createMut.isPending || updateMut.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast.error('Enter an amount greater than zero')
      return
    }
    if (!categoryId) {
      toast.error('Pick a category')
      return
    }
    try {
      if (isEdit && initial) {
        await updateMut.mutateAsync({
          id: initial.id,
          body: {
            category_id: Number(categoryId),
            amount: amt,
            date,
            description: description.trim(),
          },
        })
        toast.success('Transaction updated')
      } else {
        if (!accountId) {
          toast.error('Pick an account')
          return
        }
        await createMut.mutateAsync({
          account_id: Number(accountId),
          category_id: Number(categoryId),
          type,
          amount: amt,
          date,
          description: description.trim(),
        })
        toast.success(type === 'income' ? 'Income added' : 'Expense added')
      }
      onSuccess()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
      <div className="space-y-2">
        <Label>Account</Label>
        <Select
          value={accountId}
          onValueChange={setAccountId}
          disabled={isEdit}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {activeAccounts.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.name} · {a.currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEdit && (
          <p className="text-xs text-muted-foreground">
            Account can't be changed after creation.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="txn-amount">
          Amount{selectedAccount ? ` (${selectedAccount.currency})` : ''}
        </Label>
        <Input
          id="txn-amount"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {typeCategories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.icon ? `${c.icon} ` : ''}
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="txn-date">Date</Label>
        <Input
          id="txn-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="txn-desc">Description</Label>
        <Input
          id="txn-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional note"
        />
      </div>

      <DrawerFooter className="px-0">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Add'}
        </Button>
      </DrawerFooter>
    </form>
  )
}
