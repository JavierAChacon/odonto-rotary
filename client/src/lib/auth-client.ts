import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { env } from '@/config/env'

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
  fetchOptions: { credentials: 'include' },
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: { mustChangePassword: { type: 'boolean' } },
    }),
  ],
})
