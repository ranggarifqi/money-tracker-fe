import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { TransferForm } from '@/components/forms/TransferForm'
import { apiErrorMessage } from '@/lib/api/client'
import { useDeleteTransaction } from '@/lib/queries/transactions'
import { useDeleteTransfer } from '@/lib/queries/transfers'
import { formatMoney } from '@/lib/format'
import type { ActivityItem } from '@/lib/types'

interface ActivityDetailSheetProps {
  item: ActivityItem | null
  onOpenChange: (open: boolean) => void
}

function itemKey(item: ActivityItem): string {
  return `${item.type}-${item.transaction?.id ?? item.transfer?.id}`
}

export function ActivityDetailSheet({
  item,
  onOpenChange,
}: ActivityDetailSheetProps) {
  // The body mounts per selected item (keyed by identity), so its view state
  // resets to "actions" whenever a different item is opened.
  return (
    <Drawer open={!!item} onOpenChange={onOpenChange}>
      <DrawerContent>
        {item && (
          <DetailBody
            key={itemKey(item)}
            item={item}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}

type View = 'actions' | 'edit' | 'confirm'

function DetailBody({
  item,
  onClose,
}: {
  item: ActivityItem
  onClose: () => void
}) {
  const [view, setView] = useState<View>('actions')
  const deleteTxn = useDeleteTransaction()
  const deleteTransfer = useDeleteTransfer()

  const isTransfer = item.type === 'transfer'
  const txn = item.transaction
  const tr = item.transfer
  const deleting = deleteTxn.isPending || deleteTransfer.isPending

  async function handleDelete() {
    try {
      if (isTransfer && tr) {
        await deleteTransfer.mutateAsync(tr.id)
        toast.success('Transfer deleted')
      } else if (txn) {
        await deleteTxn.mutateAsync(txn.id)
        toast.success('Transaction deleted')
      }
      onClose()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  if (view === 'edit') {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>Edit {isTransfer ? 'transfer' : txn?.type}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto pb-2">
          {isTransfer && tr ? (
            <TransferForm
              initial={{
                id: tr.id,
                fromCurrency: tr.from_currency,
                toCurrency: tr.to_currency,
                fromAmount: tr.from_amount,
                toAmount: tr.to_amount,
                date: tr.date,
                description: tr.description,
              }}
              onSuccess={onClose}
            />
          ) : txn ? (
            <TransactionForm
              type={txn.type}
              initial={{
                id: txn.id,
                accountId: txn.account_id,
                categoryId: txn.category_id,
                amount: txn.amount,
                date: txn.date,
                description: txn.description,
              }}
              onSuccess={onClose}
            />
          ) : null}
        </div>
      </>
    )
  }

  if (view === 'confirm') {
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>
            Delete {isTransfer ? 'transfer' : 'transaction'}?
          </DrawerTitle>
          <DrawerDescription>
            {isTransfer
              ? 'This deletes both sides of the transfer.'
              : 'This permanently removes the transaction.'}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setView('actions')}>
            Cancel
          </Button>
        </DrawerFooter>
      </>
    )
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>
          {isTransfer
            ? `${tr?.from_account_name} → ${tr?.to_account_name}`
            : txn?.description || txn?.account_name}
        </DrawerTitle>
        <DrawerDescription>
          {isTransfer && tr
            ? `${formatMoney(tr.from_amount, tr.from_currency)}${
                tr.from_currency !== tr.to_currency
                  ? ` → ${formatMoney(tr.to_amount, tr.to_currency)}`
                  : ''
              }`
            : txn
              ? `${txn.type === 'income' ? '+' : '-'}${formatMoney(
                  txn.amount,
                  txn.currency,
                )} · ${txn.account_name}`
              : ''}
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button onClick={() => setView('edit')}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => setView('confirm')}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </DrawerFooter>
    </>
  )
}
