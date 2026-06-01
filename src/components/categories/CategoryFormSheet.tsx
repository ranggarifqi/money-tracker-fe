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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/client'
import { useCreateCategory } from '@/lib/queries/categories'
import type { CategoryType } from '@/lib/types'

interface CategoryFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: CategoryType
}

export function CategoryFormSheet({
  open,
  onOpenChange,
  defaultType = 'expense',
}: CategoryFormSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New category</DrawerTitle>
        </DrawerHeader>
        {open && (
          <CategoryFormBody
            defaultType={defaultType}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}

function CategoryFormBody({
  defaultType,
  onDone,
}: {
  defaultType: CategoryType
  onDone: () => void
}) {
  const createMut = useCreateCategory()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [type, setType] = useState<CategoryType>(defaultType)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await createMut.mutateAsync({
        name: name.trim(),
        type,
        icon: icon.trim(),
      })
      toast.success('Category created')
      onDone()
    } catch (err) {
      toast.error(apiErrorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
      <Tabs value={type} onValueChange={(v) => setType(v as CategoryType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-3">
        <div className="w-20 space-y-2">
          <Label htmlFor="cat-icon">Icon</Label>
          <Input
            id="cat-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🍔"
            maxLength={2}
            className="text-center text-xl"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="cat-name">Name</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
            required
          />
        </div>
      </div>

      <DrawerFooter className="px-0">
        <Button type="submit" disabled={createMut.isPending}>
          {createMut.isPending && <Loader2 className="size-4 animate-spin" />}
          Create category
        </Button>
      </DrawerFooter>
    </form>
  )
}
