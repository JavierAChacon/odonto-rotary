import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { sessionQueryOptions } from '@/features/auth/api/get-session'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions,
    )
    if (!session) {
      throw redirect({ to: '/login' })
    }
    if (session.user.mustChangePassword) {
      throw redirect({ to: '/change-password' })
    }
  },
  component: Outlet,
})
