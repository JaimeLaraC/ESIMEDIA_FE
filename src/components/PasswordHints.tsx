import { useI18n } from '../hooks/useI18n'
import { useState, useEffect } from 'react'
import { getPasswordRequirements, type PasswordRequirements } from '../utils/fieldValidator'

interface PasswordHintsProps {
  password: string
  showHints: boolean
  personalData?: {
    firstName?: string
    lastName?: string
    alias?: string
    birthDate?: string
  }
}

export const PasswordHints = ({ password, showHints, personalData }: PasswordHintsProps) => {
  const { t } = useI18n()
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    length: false,
    mixedCase: false,
    numbersOrSymbols: false,
    noObviousPatterns: false,
    noCommonWords: false,
    noPersonalData: false
  })

  useEffect(() => {
    const newRequirements = getPasswordRequirements(password, personalData)
    setRequirements(newRequirements)
  }, [password, personalData])

  if (!showHints) return null

  // Si todos los requisitos están cumplidos, no mostrar las pistas
  const allRequirementsMet = Object.values(requirements).every(Boolean)
  if (allRequirementsMet) return null

  return (
    <div className="password-requirements">
      <div className={`requirement ${requirements.length ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.length')}
      </div>
      <div className={`requirement ${requirements.mixedCase ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.mixedCase')}
      </div>
      <div className={`requirement ${requirements.numbersOrSymbols ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.numbersOrSymbols')}
      </div>
      <div className={`requirement ${requirements.noObviousPatterns ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.noObviousPatterns')}
      </div>
      <div className={`requirement ${requirements.noCommonWords ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.noCommonWords')}
      </div>
      <div className={`requirement ${requirements.noPersonalData ? 'met' : 'unmet'}`}>
        {t('auth.registration.passwordHints.noPersonalData')}
      </div>
    </div>
  )
}