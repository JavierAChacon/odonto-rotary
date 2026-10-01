import { useTranslation } from 'react-i18next'

import { CenteredCardLayout } from '@/components/centered-card-layout'
import { LoginForm } from '@/features/auth/components/login-form'

export const LoginScreen = () => {
  const { t } = useTranslation('auth')

  return (
    <CenteredCardLayout description={t('login.description')}>
      <LoginForm />
    </CenteredCardLayout>
  )
}
