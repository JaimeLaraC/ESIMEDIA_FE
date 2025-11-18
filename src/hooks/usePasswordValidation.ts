/**
 * usePasswordValidation.ts
 * Hook personalizado para validación de contraseña con HIBP
 * Excluido del scanner de SonarQube
 */

import { useState, useCallback } from 'react'
import zxcvbn from 'zxcvbn'
import { checkPasswordHIBP } from '../services/hibpservice'
import { validateRepeatPassword } from '../utils/fieldValidator'
import { log } from '../config/logConfig'

interface PasswordStrength {
  score: number
  feedback: {
    suggestions: string[]
    warning: string
  }
}

interface PersonalData {
  firstName?: string
  lastName?: string
  alias?: string
  birthDate?: string
}

interface UsePasswordValidationResult {
  passwordStrength: PasswordStrength | null
  showPasswordHints: boolean
  hibpError: string | undefined
  repeatPasswordError: string | undefined
  handlePasswordFocus: () => void
  handlePasswordBlur: () => void
  handlePasswordChange: (password: string, repeatPassword?: string) => Promise<void>
  handleRepeatPasswordChange: (repeatPassword: string, password: string) => void
}

/**
 * Hook para gestionar la validación de contraseña
 * Incluye validación de fortaleza (zxcvbn) y verificación HIBP
 * @param t - Función de traducción
 * @returns Objeto con estado y manejadores de validación de contraseña
 */
export const usePasswordValidation = (
  t: (key: string) => string
): UsePasswordValidationResult => {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)
  const [showPasswordHints, setShowPasswordHints] = useState(false)
  const [hibpError, setHibpError] = useState<string | undefined>(undefined)
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | undefined>(undefined)

  /**
   * Muestra los hints de contraseña cuando se enfoca el campo
   */
  const handlePasswordFocus = (): void => {
    setShowPasswordHints(true)
  }

  /**
   * Oculta los hints de contraseña cuando se desenfo ca el campo (si está vacío)
   */
  const handlePasswordBlur = (): void => {
    setShowPasswordHints(false)
  }

  /**
   * Valida la contraseña usando zxcvbn y verifica contra HIBP si es fuerte
   */
  const handlePasswordChange = useCallback(
    async (password: string, repeatPassword?: string): Promise<void> => {
      // Si no hay contraseña, limpiar estado
      if (!password) {
        setPasswordStrength(null)
        setHibpError(undefined)
        setRepeatPasswordError(undefined)
        return
      }

      // Calcular fortaleza con zxcvbn
      const result = zxcvbn(password)
      setPasswordStrength({
        score: result.score,
        feedback: result.feedback
      })

      // Validar contraseña repetida si se proporciona
      if (repeatPassword) {
        const repeatError = validateRepeatPassword(repeatPassword, password)
        setRepeatPasswordError(repeatError ? t(repeatError) : undefined)
      }

      // Si la contraseña es fuerte, verificar contra HIBP
      if (result.score >= 4) {
        try {
          const hibpResult = await checkPasswordHIBP(password)
          log('info', 'HIBP check result:', {
            isCompromised: hibpResult.isCompromised,
            count: hibpResult.count
          })

          const error = hibpResult.isCompromised
            ? t('auth.registration.errors.passwordCompromised')
            : undefined
          setHibpError(error)
        } catch (error) {
          log('error', 'Error checking HIBP:', error)
          // No bloqueamos si falla la verificación HIBP
          setHibpError(undefined)
        }
      } else {
        // Contraseña no es lo suficientemente fuerte, limpiar error HIBP
        setHibpError(undefined)
      }
    },
    [t]
  )

  /**
   * Valida la contraseña repetida
   */
  const handleRepeatPasswordChange = useCallback(
    (repeatPassword: string, password: string): void => {
      const error = validateRepeatPassword(repeatPassword, password)
      setRepeatPasswordError(error ? t(error) : undefined)
    },
    [t]
  )

  return {
    passwordStrength,
    showPasswordHints,
    hibpError,
    repeatPasswordError,
    handlePasswordFocus,
    handlePasswordBlur,
    handlePasswordChange,
    handleRepeatPasswordChange
  }
}
