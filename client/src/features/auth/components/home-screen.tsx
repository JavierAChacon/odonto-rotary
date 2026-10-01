import { CenteredCardLayout } from '@/components/centered-card-layout'
import { SessionGreeting } from '@/features/auth/components/session-greeting'

export const HomeScreen = () => (
  <CenteredCardLayout>
    <SessionGreeting />
  </CenteredCardLayout>
)
