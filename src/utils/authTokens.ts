/**
 * Gestor centralizado de autenticación con localStorage
 * Los JWT tokens se almacenan en localStorage y se envían en el encabezado Authorization
 * Cambiado de cookies HttpOnly por problemas de CORS entre Firebase y Render
 */

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const TokenManager = {
  /**
   * Verifica si hay una sesión activa
   */
  hasToken: (): boolean => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    return !!token
  },

  /**
   * Obtiene los headers de autenticación
   */
  getAuthHeader: (): Record<string, string> => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token) {
      return { 'Authorization': `Bearer ${token}` }
    }
    return {}
  },

  /**
   * Obtiene todos los headers de autenticación
   */
  getFullAuthHeaders: (additionalHeaders?: Record<string, string>): Record<string, string> => {
    const authHeader = TokenManager.getAuthHeader()
    return {
      'Content-Type': 'application/json',
      ...authHeader,
      ...additionalHeaders
    }
  },

  /**
   * Almacena los tokens
   */
  setTokens: (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  /**
   * Almacena el token de acceso
   */
  setToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  /**
   * Limpia los tokens
   */
  removeTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Obtiene el token de acceso
   */
  getToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  /**
   * Obtiene el token de refresh
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
}
