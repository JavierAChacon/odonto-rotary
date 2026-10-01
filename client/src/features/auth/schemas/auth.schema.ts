import { z } from 'zod'

const PASSWORD_MINIMUM_LENGTH = 8

export const signInSchema = z.object({
  email: z.email({ error: 'validation.emailInvalid' }),
  password: z.string().min(1, { error: 'validation.passwordRequired' }),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: 'validation.currentPasswordRequired' }),
    newPassword: z
      .string()
      .min(PASSWORD_MINIMUM_LENGTH, { error: 'validation.newPasswordTooShort' }),
    newPasswordConfirmation: z.string(),
  })
  .refine(
    (passwordToChange) =>
      passwordToChange.newPassword === passwordToChange.newPasswordConfirmation,
    {
      path: ['newPasswordConfirmation'],
      error: 'validation.confirmPasswordMismatch',
    },
  )
  .refine(
    (passwordToChange) =>
      passwordToChange.newPassword !== passwordToChange.currentPassword,
    {
      path: ['newPassword'],
      error: 'validation.newPasswordSameAsCurrent',
    },
  )

export type SignInCredentials = z.infer<typeof signInSchema>
export type PasswordToChange = z.infer<typeof changePasswordSchema>
