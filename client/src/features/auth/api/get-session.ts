import { queryOptions, useQuery, type QueryClient } from '@tanstack/react-query'

import { authClient } from '@/lib/auth-client'
import { unwrapAuthResponse } from '@/lib/api-error'

export const sessionQueryKey = ['auth', 'session'] as const

export const getSession = async () =>
  unwrapAuthResponse(await authClient.getSession())

export const sessionQueryOptions = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: getSession,
})

export const refreshSession = (queryClient: QueryClient) =>
  queryClient.fetchQuery({ ...sessionQueryOptions, staleTime: 0 })

export const useSession = () => useQuery(sessionQueryOptions)
