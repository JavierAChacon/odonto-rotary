import { createFileRoute } from '@tanstack/react-router'

import { HomeScreen } from '@/features/auth/components/home-screen'

export const Route = createFileRoute('/_authenticated/')({
  component: HomeScreen,
})
