import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useSignIn } from '@/features/auth/api/sign-in'
import { AuthFieldError } from '@/features/auth/components/auth-field-error'
import {
  signInSchema,
  type SignInCredentials,
} from '@/features/auth/schemas/auth.schema'

export const LoginForm = () => {
  const { t } = useTranslation('auth')
  const { t: translateCommon } = useTranslation('common')
  const navigate = useNavigate()
  const signInMutation = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInCredentials>({ resolver: zodResolver(signInSchema) })

  const submitCredentialsToSignIn = async (
    credentialsToSignIn: SignInCredentials,
  ) => {
    const signedInSession = await signInMutation
      .mutateAsync(credentialsToSignIn)
      .catch(() => null)
    if (signedInSession !== null) {
      await navigate({ to: '/' })
    }
  }

  return (
    <form onSubmit={handleSubmit(submitCredentialsToSignIn)} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">{t('login.email')}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <AuthFieldError error={errors.email} />
        </Field>
        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="password">{t('login.password')}</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <AuthFieldError error={errors.password} />
        </Field>
        {signInMutation.error && (
          <FieldError>
            {signInMutation.error.message || t('errors.generic')}
          </FieldError>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner aria-label={translateCommon('loading')} />}
          {t('login.submit')}
        </Button>
      </FieldGroup>
    </form>
  )
}
