import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import enAuth from '@/features/auth/locales/en.json'
import esAuth from '@/features/auth/locales/es.json'
import { i18n } from '@/lib/i18n'
import { queryClient } from '@/lib/query-client'

i18n.addResourceBundle('en', 'auth', enAuth)
i18n.addResourceBundle('es', 'auth', esAuth)

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </I18nextProvider>
)
