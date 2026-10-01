import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/features/auth/api/get-session'
import { useSignOut } from '@/features/auth/api/sign-out'

export const SessionGreeting = () => {
  const { t } = useTranslation('auth')
  const { t: translateCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { data: session } = useSession()
  const signOutMutation = useSignOut()

  const signOutCurrentUser = () =>
    signOutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login' }),
    })

  return (
    <div className="flex flex-col gap-4">
      <p>{t('home.greeting', { name: session?.user.name })}</p>
      <Button
        variant="outline"
        onClick={signOutCurrentUser}
        disabled={signOutMutation.isPending}
      >
        {signOutMutation.isPending && (
          <Spinner aria-label={translateCommon('loading')} />
        )}
        {translateCommon('signOut')}
      </Button>
    </div>
  )
}
