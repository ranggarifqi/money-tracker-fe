// Types mirror the backend swagger schemas.
// Both responses and request bodies use snake_case.

export type AccountType =
  | 'cash'
  | 'bank'
  | 'e_wallet'
  | 'credit_card'
  | 'investment'
  | 'metal'
  | 'crypto'

export type CategoryType = 'income' | 'expense' | 'transfer'
export type TransactionType = 'income' | 'expense' | 'transfer'

// ---- Entities (responses) ----

export interface Account {
  id: number
  user_id: number
  name: string
  type: AccountType
  currency: string
  initial_balance: number
  should_treat_as_expense: boolean
  balance: number // present on the list endpoint (accountWithBalance)
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Category {
  id: number
  user_id: number | null // null for system categories
  name: string
  type: CategoryType
  icon: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  user_id: number
  account_id: number
  category_id: number
  type: TransactionType
  amount: number
  currency: string
  date: string
  description: string
  source: string
  transfer_pair_id: number
  created_at: string
  updated_at: string
}

export interface Transfer {
  id: number
  user_id: number
  from_transaction_id: number
  to_transaction_id: number
  from_amount: number
  from_currency: string
  to_amount: number
  to_currency: string
  exchange_rate: number
  date: string
  description: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
}

// ---- Activity feed ----

export interface ActivityTransaction {
  id: number
  type: TransactionType
  account_id: number
  account_name: string
  category_id: number
  amount: number
  currency: string
  date: string
  description: string
}

export interface ActivityTransfer {
  id: number
  from_account_id: number
  from_account_name: string
  from_amount: number
  from_currency: string
  to_account_id: number
  to_account_name: string
  to_amount: number
  to_currency: string
  exchange_rate: number
  date: string
  description: string
}

export interface ActivityItem {
  type: 'transaction' | 'transfer'
  date: string
  transaction?: ActivityTransaction
  transfer?: ActivityTransfer
}

// ---- Summary ----

export interface Summary {
  period: { from: string; to: string }
  balances: { total: number; spendable: number; locked: number }
  cash_flow: { income: number; expenses: number; net: number }
  saved: { incoming: number }
}

export interface CategorySummaryRow {
  category_id: number
  category_name: string
  category_icon: string
  category_type: string
  total_amount: number
  transaction_count: number
}

export interface CategorySummaryResult {
  period: { from: string; to: string }
  categories: CategorySummaryRow[]
}

// ---- Request payloads (snake_case) ----

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateAccountRequest {
  name: string
  type: AccountType
  currency: string
  initial_balance: number
  treat_as_expense: boolean
}

export interface UpdateAccountRequest {
  name: string
  type: AccountType
  initial_balance: number
  treat_as_expense: boolean
}

export interface CreateCategoryRequest {
  name: string
  type: CategoryType
  icon: string
}

export interface CreateTransactionRequest {
  account_id: number
  category_id: number
  type: TransactionType
  amount: number
  date: string
  description: string
}

export interface UpdateTransactionRequest {
  category_id: number
  amount: number
  date: string
  description: string
}

export interface CreateTransferRequest {
  from_account_id: number
  to_account_id: number
  from_amount: number
  to_amount: number
  date: string
  description: string
}

export interface UpdateTransferRequest {
  from_amount: number
  to_amount: number
  date: string
  description: string
}
