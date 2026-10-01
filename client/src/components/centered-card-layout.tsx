import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type CenteredCardLayoutProps = {
  description?: string
  children: ReactNode
}

export const CenteredCardLayout = ({
  description,
  children,
}: CenteredCardLayoutProps) => {
  const { t } = useTranslation('common')

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t('appName')}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  )
}
