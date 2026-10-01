import { useMutation, useQueryClient } from '@tanstack/react-query'

import { refreshSession } from '@/features/auth/api/get-session'
import type { PasswordToChange } from '@/features/auth/schemas/auth.schema'
import { unwrapAuthResponse } from '@/lib/api-error'
import { authClient } from '@/lib/auth-client'

export const changePassword = async ({
  currentPassword,
  newPassword,
}: PasswordToChange) =>
  unwrapAuthResponse(
    await authClient.changePassword({ currentPassword, newPassword }),
  )

export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => refreshSession(queryClient),
  })
}
