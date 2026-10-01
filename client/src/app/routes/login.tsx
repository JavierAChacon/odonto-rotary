import { createFileRoute, redirect } from '@tanstack/react-router'

import { sessionQueryOptions } from '@/features/auth/api/get-session'
import { LoginScreen } from '@/features/auth/components/login-screen'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      sessionQueryOptions,
    )
    if (session) {
      throw redirect({
        to: session.user.mustChangePassword ? '/change-password' : '/',
      })
    }
  },
  component: LoginScreen,
})
