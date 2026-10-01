import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enCommon from '@/locales/en.json'
import esCommon from '@/locales/es.json'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    initAsync: false,
    resources: {
      en: { common: enCommon },
      es: { common: esCommon },
    },
    defaultNS: 'common',
    supportedLngs: ['es', 'en'],
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: 'locale',
      caches: ['cookie'],
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        maxAge: ONE_YEAR_IN_SECONDS,
      },
    },
  })

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

export { i18n }
