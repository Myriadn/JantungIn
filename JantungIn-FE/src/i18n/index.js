import { createI18n } from 'vue-i18n'

// Import locale messages
import en from './locales/en.json'
import id from './locales/id.json'

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'id', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    id,
  },
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})

export default i18n
