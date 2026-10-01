import type { FieldError as FormFieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FieldError } from '@/components/ui/field'

export const AuthFieldError = ({ error }: { error?: FormFieldError }) => {
  const { t } = useTranslation('auth')

  if (!error) {
    return null
  }

  return <FieldError>{t(error.message ?? 'errors.generic')}</FieldError>
}
