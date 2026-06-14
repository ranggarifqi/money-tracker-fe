import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { ActivityPage } from '@/pages/ActivityPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { AccountDetailPage } from '@/pages/AccountDetailPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { MorePage } from '@/pages/MorePage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'accounts/:id', element: <AccountDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'more', element: <MorePage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
