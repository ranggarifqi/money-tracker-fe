import { useState } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionForm } from './TransactionForm'
import { TransferForm } from './TransferForm'

interface AddRecordSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Mode = 'expense' | 'income' | 'transfer'

export function AddRecordSheet({ open, onOpenChange }: AddRecordSheetProps) {
  // Mounting the body only while open resets the tab to "expense" each time.
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add record</DrawerTitle>
        </DrawerHeader>
        {open && <AddRecordBody onDone={() => onOpenChange(false)} />}
      </DrawerContent>
    </Drawer>
  )
}

function AddRecordBody({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<Mode>('expense')

  return (
    <>
      <div className="px-4 pb-2">
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-y-auto pb-2">
        {mode === 'expense' && (
          <TransactionForm type="expense" onSuccess={onDone} />
        )}
        {mode === 'income' && (
          <TransactionForm type="income" onSuccess={onDone} />
        )}
        {mode === 'transfer' && <TransferForm onSuccess={onDone} />}
      </div>
    </>
  )
}
