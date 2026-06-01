export const queryKeys = {
  accounts: ['accounts'] as const,
  categories: ['categories'] as const,
  activity: (year: number, month: number) =>
    ['activity', year, month] as const,
  summary: (from: string, to: string) => ['summary', from, to] as const,
  categorySummary: (year: number, month: number, type?: string) =>
    ['summary', 'categories', year, month, type ?? 'all'] as const,
}
