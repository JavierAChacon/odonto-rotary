import { useTranslation } from 'react-i18next'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const SUPPORTED_LANGUAGES = ['es', 'en'] as const

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('common')

  const changeLanguage = (selectedLanguages: string[]) => {
    const [selectedLanguage] = selectedLanguages
    if (selectedLanguage) {
      void i18n.changeLanguage(selectedLanguage)
    }
  }

  return (
    <ToggleGroup
      variant="outline"
      aria-label={t('languageSelector')}
      value={[i18n.resolvedLanguage ?? 'en']}
      onValueChange={changeLanguage}
    >
      {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
        <ToggleGroupItem key={supportedLanguage} value={supportedLanguage}>
          {supportedLanguage.toUpperCase()}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
