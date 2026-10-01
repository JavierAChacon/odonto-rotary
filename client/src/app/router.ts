import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/app/route-tree.gen'
import { queryClient } from '@/lib/query-client'

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
