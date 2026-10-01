import { createFileRoute, redirect } from '@tanstack/react-router'

import { sessionQueryOptions } from '@/features/auth/api/get-session'
import { ChangePasswordScreen } from '@/features/auth/components/change-password-screen'

export const Route = createFileRoute('/change-password')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions,
    )
    if (!session) {
      throw redirect({ to: '/login' })
    }
    if (!session.user.mustChangePassword) {
      throw redirect({ to: '/' })
    }
  },
  component: ChangePasswordScreen,
})
