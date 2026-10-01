import { useMutation, useQueryClient } from '@tanstack/react-query'

import { unwrapAuthResponse } from '@/lib/api-error'
import { authClient } from '@/lib/auth-client'

export const signOut = async () =>
  unwrapAuthResponse(await authClient.signOut())

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  })
}
