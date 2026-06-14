import {
  Banknote,
  Building2,
  Wallet,
  CreditCard,
  TrendingUp,
  Gem,
  Bitcoin,
  Pencil,
  Trash2,
  RotateCcw,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ACCOUNT_TYPE_LABELS, formatMoney } from '@/lib/format'
import type { Account, AccountType } from '@/lib/types'

const TYPE_ICON: Record<AccountType, typeof Wallet> = {
  cash: Banknote,
  bank: Building2,
  e_wallet: Wallet,
  credit_card: CreditCard,
  investment: TrendingUp,
  metal: Gem,
  crypto: Bitcoin,
}

interface AccountCardProps {
  account: Account
  onClick?: (account: Account) => void
  onEdit?: (account: Account) => void
  onDelete?: (account: Account) => void
  onRestore?: (account: Account) => void
  deleted?: boolean
}

export function AccountCard({
  account,
  onClick,
  onEdit,
  onDelete,
  onRestore,
  deleted,
}: AccountCardProps) {
  const Icon = TYPE_ICON[account.type] ?? Wallet

  const body = (
    <>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{account.name}</p>
          {account.should_treat_as_expense && (
            <Badge variant="secondary" className="shrink-0">
              Locked
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {ACCOUNT_TYPE_LABELS[account.type] ?? account.type} · {account.currency}
        </p>
      </div>
    </>
  )

  return (
    <Card className="flex items-center gap-3 p-3">
      {onClick ? (
        <button
          type="button"
          onClick={() => onClick(account)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label={`View ${account.name} activity`}
        >
          {body}
        </button>
      ) : (
        body
      )}

      {deleted ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestore?.(account)}
        >
          <RotateCcw className="size-4" />
          Restore
        </Button>
      ) : (
        <div className="flex flex-col items-end gap-1">
          <span className="font-semibold tabular-nums">
            {formatMoney(account.balance, account.currency)}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onEdit?.(account)}
              aria-label="Edit account"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-destructive"
              onClick={() => onDelete?.(account)}
              aria-label="Delete account"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
