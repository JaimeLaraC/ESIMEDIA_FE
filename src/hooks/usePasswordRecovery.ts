import { useState, useCallback } from 'react'
import zxcvbn from 'zxcvbn'
import { checkPasswordSecurity, validatePasswordRequirements, MIN_PASSWORD_SCORE } from '../utils/passwordUtils'

/**
 * Custom hook for password recovery and validation
 * Handles password strength checking, HIBP compromise verification, and matching
 */
export function usePasswordRecovery() {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [strength, setStrength] = useState<zxcvbn.ZXCVBNResult | null>(null)
  const [isCheckingHIBP, setIsCheckingHIBP] = useState(false)
  const [isCompromised, setIsCompromised] = useState<boolean | null>(null)

  /**
   * Checks password security using zxcvbn and HIBP
   */
  const checkPasswordSecurityLocal = useCallback(async (pwd: string) => {
    const { strength: newStrength, isCompromised: compromised } = await checkPasswordSecurity(pwd)
    return { strength: newStrength, isCompromised: compromised }
  }, [])

  /**
   * Handles password change with strength and compromise checking
   */
  const handlePasswordChange = useCallback(async (value: string) => {
    setPassword(value)
    setIsCompromised(null)
    setStrength(null)

    if (!value) return

    setIsCheckingHIBP(true)
    const { strength: newStrength, isCompromised: compromised } = await checkPasswordSecurityLocal(value)
    setStrength(newStrength)
    setIsCompromised(compromised)
    setIsCheckingHIBP(false)
  }, [checkPasswordSecurityLocal])

  /**
   * Handles repeat password change
   */
  const handleRepeatPasswordChange = useCallback((value: string) => {
    setRepeatPassword(value)
  }, [])

  /**
   * Validates password requirements for submission
   */
  const validatePassword = useCallback((): { isValid: boolean; errorKey?: string } => {
    return validatePasswordRequirements(password, repeatPassword, strength, isCompromised)
  }, [password, repeatPassword, strength, isCompromised])

  /**
   * Resets all password state
   */
  const resetPasswordState = useCallback(() => {
    setPassword('')
    setRepeatPassword('')
    setStrength(null)
    setIsCompromised(null)
    setIsCheckingHIBP(false)
  }, [])

  // Computed values
  const passwordsMatch = password === repeatPassword
  const hasValidStrength = strength && strength.score >= MIN_PASSWORD_SCORE
  const isFormValid = password && repeatPassword && passwordsMatch && hasValidStrength
  const canSubmit = isFormValid && !isCheckingHIBP && !isCompromised

  return {
    // State
    password,
    repeatPassword,
    strength,
    isCheckingHIBP,
    isCompromised,

    // Computed
    passwordsMatch,
    hasValidStrength,
    isFormValid,
    canSubmit,

    // Actions
    handlePasswordChange,
    handleRepeatPasswordChange,
    validatePassword,
    resetPasswordState,
    checkPasswordSecurity: checkPasswordSecurityLocal
  }
}
