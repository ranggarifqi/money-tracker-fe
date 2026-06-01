import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CategoryFormSheet } from '@/components/categories/CategoryFormSheet'
import { useCategories } from '@/lib/queries/categories'
import type { Category, CategoryType } from '@/lib/types'

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const [tab, setTab] = useState<CategoryType>('expense')
  const [formOpen, setFormOpen] = useState(false)

  const byType = useMemo(() => {
    const list = categories ?? []
    return {
      expense: list.filter((c) => c.type === 'expense'),
      income: list.filter((c) => c.type === 'income'),
    }
  }, [categories])

  return (
    <PageLayout
      title="Categories"
      action={
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setFormOpen(true)}
          aria-label="Add category"
        >
          <Plus className="size-5" />
        </Button>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as CategoryType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="expense">
          <CategoryList items={byType.expense} loading={isLoading} />
        </TabsContent>
        <TabsContent value="income">
          <CategoryList items={byType.income} loading={isLoading} />
        </TabsContent>
      </Tabs>

      <CategoryFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultType={tab}
      />
    </PageLayout>
  )
}

function CategoryList({
  items,
  loading,
}: {
  items: Category[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="pt-12 text-center text-sm text-muted-foreground">
        No categories here yet.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((cat) => (
        <Card key={cat.id} className="flex items-center gap-3 p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-lg">
            {cat.icon || '🏷️'}
          </div>
          <span className="flex-1 font-medium">{cat.name}</span>
          {cat.user_id == null && <Badge variant="outline">System</Badge>}
        </Card>
      ))}
    </div>
  )
}
