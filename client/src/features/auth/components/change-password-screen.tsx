import { useTranslation } from 'react-i18next'

import { CenteredCardLayout } from '@/components/centered-card-layout'
import { ChangePasswordForm } from '@/features/auth/components/change-password-form'

export const ChangePasswordScreen = () => {
  const { t } = useTranslation('auth')

  return (
    <CenteredCardLayout description={t('changePassword.description')}>
      <ChangePasswordForm />
    </CenteredCardLayout>
  )
}
