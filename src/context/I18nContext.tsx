import { useCallback, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language, LanguageCode } from './I18nContextTypes'
import { defaultTranslations, availableLanguages } from './I18nContextConstants'
import { log } from '../config/logConfig'
import { I18nContext } from './I18nContextProvider'
import { setCookie, getCookie } from '../utils/cookies'

export function I18nProvider({ children }: { readonly children: ReactNode }) {
  // Cargar idioma desde cookie o usar español por defecto
  const getInitialLanguage = (): LanguageCode => {
    const savedLanguage = getCookie('esimedia-language')
    const availableCodes = availableLanguages.map(lang => lang.code)
    if (savedLanguage && availableCodes.includes(savedLanguage as LanguageCode)) {
      return savedLanguage as LanguageCode
    }
    return 'es'
  }

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [translations, setTranslations] = useState(defaultTranslations)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar idioma inicial al montar el componente
  useEffect(() => {
    const loadInitialLanguage = async () => {
      try {
        const langToLoad = getInitialLanguage()
        const module = await import(`../lang/${langToLoad}.json`)
        const translations = module.default
        setTranslations(translations)
        setCurrentLanguage(langToLoad)
      } catch (error) {
        log('error', 'Failed to load initial translations', error)
        // Fallback a español
        try {
          const module = await import('../lang/es.json')
          const spanishTranslations = module.default
          setTranslations(spanishTranslations)
          setCurrentLanguage('es')
        } catch (fallbackError) {
          log('error', 'Failed to load fallback translations', fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialLanguage()
  }, [])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }

    return (value as string) || key
  }, [translations])

  const changeLanguage = useCallback(async (lang: Language): Promise<void> => {
    if (lang.code === currentLanguage) return

    setIsLoading(true)
    try {
      const module = await import(`../lang/${lang.code}.json`)
      const newTranslations = module.default
      setTranslations(newTranslations)
      setCurrentLanguage(lang.code)
      // Guardar el idioma seleccionado en cookie
      setCookie('esimedia-language', lang.code, 365)
    } catch (error) {
      log('error', 'Failed to load translations', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentLanguage])

  const value = useMemo(() => ({
    t,
    translations,
    currentLanguage,
    changeLanguage,
    isLoading,
    availableLanguages
  }), [t, translations, currentLanguage, changeLanguage, isLoading])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
