import type { Translations } from './I18nContextTypes'

// Traducciones por defecto (vacías inicialmente, se cargarán dinámicamente)
export const defaultTranslations = {} as Translations

// Idiomas disponibles
export const availableLanguages = [
  { code: 'es' as const, flag: '🇪🇸', name: 'Español' },
  { code: 'en' as const, flag: '🇬🇧', name: 'English' },
  { code: 'fr' as const, flag: '🇫🇷', name: 'Français' },
  { code: 'it' as const, flag: '🇮🇹', name: 'Italiano' },
  { code: 'de' as const, flag: '🇩🇪', name: 'Deutsch' }
]