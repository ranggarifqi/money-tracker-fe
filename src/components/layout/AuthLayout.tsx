import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <Outlet />
    </div>
  )
}
