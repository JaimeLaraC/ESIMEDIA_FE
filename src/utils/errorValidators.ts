// utils/errorValidators.ts

/**
 * Utility functions for error validation and handling
 * Contains logic for validating error codes and determining error types
 */

// Error code constants
export const ERROR_CODES = {
  ACCOUNT_BLOCKED: 'ACCOUNT_BLOCKED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  MFA_REQUIRED: 'MFA_REQUIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

/**
 * Validates if an error code requires navigation to an error page
 */
export function requiresNavigation(errorCode: string): boolean {
  const navigationCodes: string[] = [
    ERROR_CODES.ACCOUNT_BLOCKED,
    ERROR_CODES.SESSION_EXPIRED,
    ERROR_CODES.UNAUTHORIZED
  ]
  return navigationCodes.includes(errorCode)
}

/**
 * Gets the appropriate navigation path for an error code
 */
export function getErrorNavigationPath(errorCode: string): string | null {
  switch (errorCode) {
    case ERROR_CODES.ACCOUNT_BLOCKED:
      return '/error/403'
    case ERROR_CODES.SESSION_EXPIRED:
    case ERROR_CODES.UNAUTHORIZED:
      return '/error/401'
    default:
      return null
  }
}

/**
 * Validates if an error code is an authentication error
 */
export function isAuthError(errorCode: string): boolean {
  return Object.values(ERROR_CODES).includes(errorCode as ErrorCode)
}

/**
 * Gets default error message for an error code
 */
export function getDefaultErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case ERROR_CODES.ACCOUNT_BLOCKED:
      return 'Cuenta bloqueada'
    case ERROR_CODES.SESSION_EXPIRED:
      return 'Sesión expirada'
    case ERROR_CODES.UNAUTHORIZED:
      return 'No autorizado'
    case ERROR_CODES.EMAIL_NOT_VERIFIED:
      return 'Email no verificado'
    case ERROR_CODES.INVALID_CREDENTIALS:
      return 'Credenciales inválidas'
    case ERROR_CODES.MFA_REQUIRED:
      return 'MFA requerida'
    case ERROR_CODES.NETWORK_ERROR:
      return 'Error de red'
    default:
      return 'Error desconocido'
  }
}