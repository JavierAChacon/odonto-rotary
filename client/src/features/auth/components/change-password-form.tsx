import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useChangePassword } from '@/features/auth/api/change-password'
import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import {
  changePasswordSchema,
  type PasswordToChange,
} from '@/features/auth/schemas/auth.schema'

export const ChangePasswordForm = () => {
  const { t } = useTranslation('auth')
  const { t: translateCommon } = useTranslation('common')
  const navigate = useNavigate()
  const changePasswordMutation = useChangePassword()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordToChange>({ resolver: zodResolver(changePasswordSchema) })

  const submitPasswordToChange = async (passwordToChange: PasswordToChange) => {
    const changedPassword = await changePasswordMutation
      .mutateAsync(passwordToChange)
      .catch(() => null)
    if (changedPassword !== null) {
      await navigate({ to: '/' })
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordToChange)} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.currentPassword)}>
          <FieldLabel htmlFor="currentPassword">
            {t('changePassword.currentPassword')}
          </FieldLabel>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            {...register('currentPassword')}
          />
          <AuthFieldError error={errors.currentPassword} />
        </Field>
        <Field data-invalid={Boolean(errors.newPassword)}>
          <FieldLabel htmlFor="newPassword">
            {t('changePassword.newPassword')}
          </FieldLabel>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
          <AuthFieldError error={errors.newPassword} />
        </Field>
        <Field data-invalid={Boolean(errors.newPasswordConfirmation)}>
          <FieldLabel htmlFor="newPasswordConfirmation">
            {t('changePassword.confirmPassword')}
          </FieldLabel>
          <Input
            id="newPasswordConfirmation"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPasswordConfirmation)}
            {...register('newPasswordConfirmation')}
          />
          <AuthFieldError error={errors.newPasswordConfirmation} />
        </Field>
        {changePasswordMutation.error && (
          <FieldError>
            {changePasswordMutation.error.message || t('errors.generic')}
          </FieldError>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner aria-label={translateCommon('loading')} />}
          {t('changePassword.submit')}
        </Button>
      </FieldGroup>
    </form>
  )
}
