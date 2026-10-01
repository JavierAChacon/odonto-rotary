import { useMutation, useQueryClient } from '@tanstack/react-query'

import { refreshSession } from '@/features/auth/api/get-session'
import type { SignInCredentials } from '@/features/auth/schemas/auth.schema'
import { unwrapAuthResponse } from '@/lib/api-error'
import { authClient } from '@/lib/auth-client'

export const signIn = async (credentialsToSignIn: SignInCredentials) =>
  unwrapAuthResponse(await authClient.signIn.email(credentialsToSignIn))

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => refreshSession(queryClient),
  })
}
