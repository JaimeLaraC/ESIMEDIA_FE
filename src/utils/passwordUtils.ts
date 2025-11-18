// utils/passwordUtils.ts

import zxcvbn from 'zxcvbn'
import { checkPasswordHIBP } from '../services/hibpservice'
import { log } from '../config/logConfig'

export const MIN_PASSWORD_SCORE = 4

/**
 * Checks password security using zxcvbn and HIBP
 */
export async function checkPasswordSecurity(pwd: string): Promise<{
  strength: zxcvbn.ZXCVBNResult
  isCompromised: boolean | null
}> {
  const result = zxcvbn(pwd)

  // Only check HIBP if password meets minimum strength
  if (result.score < MIN_PASSWORD_SCORE) {
    return { strength: result, isCompromised: null }
  }

  try {
    const hibpResult = await checkPasswordHIBP(pwd)
    log('info', 'HIBP result:', hibpResult)
    return { strength: result, isCompromised: hibpResult.isCompromised }
  } catch (err) {
    log('error', 'Error al verificar HIBP:', err)
    return { strength: result, isCompromised: null }
  }
}

/**
 * Validates password requirements for submission
 */
export function validatePasswordRequirements(
  password: string,
  repeatPassword: string,
  strength: zxcvbn.ZXCVBNResult | null,
  isCompromised: boolean | null
): { isValid: boolean; errorKey?: string } {
  if (password !== repeatPassword) {
    return { isValid: false, errorKey: 'auth.password.mismatch' }
  }

  const hasWeakPassword = !strength || strength.score < MIN_PASSWORD_SCORE
  if (hasWeakPassword) {
    return { isValid: false, errorKey: 'auth.password.weak' }
  }

  if (isCompromised) {
    return { isValid: false, errorKey: 'auth.password.compromised' }
  }

  return { isValid: true }
}