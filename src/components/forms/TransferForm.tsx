import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

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
import {
  useCreateTransfer,
  useUpdateTransfer,
} from '@/lib/queries/transfers'
import { todayISO } from '@/lib/format'

export interface TransferInitial {
  id: number
  fromCurrency: string
  toCurrency: string
  fromAmount: number
  toAmount: number
  date: string
  description: string
}

interface TransferFormProps {
  initial?: TransferInitial // present => edit mode
  onSuccess: () => void
}

export function TransferForm({ initial, onSuccess }: TransferFormProps) {
  const isEdit = !!initial
  const { data: accounts } = useAccounts()
  const createMut = useCreateTransfer()
  const updateMut = useUpdateTransfer()

  const activeAccounts = useMemo(
    () => (accounts ?? []).filter((a) => !a.deleted_at),
    [accounts],
  )

  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [fromAmount, setFromAmount] = useState(
    initial ? String(initial.fromAmount) : '',
  )
  const [toAmount, setToAmount] = useState(
    initial ? String(initial.toAmount) : '',
  )
  const [date, setDate] = useState(initial?.date.slice(0, 10) ?? todayISO())
  const [description, setDescription] = useState(initial?.description ?? '')

  const fromAcc = activeAccounts.find((a) => String(a.id) === fromId)
  const toAcc = activeAccounts.find((a) => String(a.id) === toId)

  // Currencies: from selected accounts (create) or from the transfer (edit).
  const fromCurrency = isEdit ? initial!.fromCurrency : fromAcc?.currency
  const toCurrency = isEdit ? initial!.toCurrency : toAcc?.currency
  const sameCurrency =
    !!fromCurrency && !!toCurrency && fromCurrency === toCurrency

  // For same-currency transfers, the two sides are always equal.
  const effectiveTo = sameCurrency ? fromAmount : toAmount

  const rate =
    Number(fromAmount) > 0 && Number(effectiveTo) > 0
      ? Number(effectiveTo) / Number(fromAmount)
      : null

  const pending = createMut.isPending || updateMut.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fromAmt = Number(fromAmount)
    const toAmt = Number(effectiveTo)
    if (!fromAmt || fromAmt <= 0) {
      toast.error('Enter a from amount greater than zero')
      return
    }
    if (!toAmt || toAmt <= 0) {
      toast.error('Enter a to amount greater than zero')
      return
    }
    try {
      if (isEdit && initial) {
        await updateMut.mutateAsync({
          id: initial.id,
          body: {
            from_amount: fromAmt,
            to_amount: toAmt,
            date,
            description: description.trim(),
          },
        })
        toast.success('Transfer updated')
      } else {
        if (!fromId || !toId) {
          toast.error('Pick both accounts')
          return
        }
        if (fromId === toId) {
          toast.error('Choose two different accounts')
          return
        }
        await createMut.mutateAsync({
          from_account_id: Number(fromId),
          to_account_id: Number(toId),
          from_amount: fromAmt,
          to_amount: toAmt,
          date,
          description: description.trim(),
        })
        toast.success('Transfer added')
      }
      onSuccess()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
      {isEdit ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
          <span className="font-medium">{initial!.fromCurrency}</span>
          <ArrowRight className="size-4 text-muted-foreground" />
          <span className="font-medium">{initial!.toCurrency}</span>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromId} onValueChange={setFromId}>
              <SelectTrigger>
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name} · {a.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRight className="mb-3 size-4 text-muted-foreground" />
          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger>
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name} · {a.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tr-from-amount">
          {sameCurrency ? 'Amount' : 'From amount'}
          {fromCurrency ? ` (${fromCurrency})` : ''}
        </Label>
        <Input
          id="tr-from-amount"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          placeholder="0"
          required
        />
      </div>

      {!sameCurrency && (
        <div className="space-y-2">
          <Label htmlFor="tr-to-amount">
            To amount{toCurrency ? ` (${toCurrency})` : ''}
          </Label>
          <Input
            id="tr-to-amount"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            placeholder="0"
            required
          />
          {rate && (
            <p className="text-xs text-muted-foreground">
              Exchange rate: 1 {fromCurrency} = {rate.toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })}{' '}
              {toCurrency}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tr-date">Date</Label>
        <Input
          id="tr-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tr-desc">Description</Label>
        <Input
          id="tr-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional note"
        />
      </div>

      <DrawerFooter className="px-0">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Add transfer'}
        </Button>
      </DrawerFooter>
    </form>
  )
}
