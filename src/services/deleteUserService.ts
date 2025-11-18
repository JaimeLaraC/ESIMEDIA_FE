import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

export interface DeleteAccountRequest {
  password: string
}

/**
 * Error personalizado para operaciones de eliminación de cuenta
 */
export class DeleteAccountError extends Error {
  code: string
  statusCode: number
  
  constructor(message: string, code: string, statusCode: number) {
    super(message)
    this.name = 'DeleteAccountError'
    this.code = code
    this.statusCode = statusCode
  }
}

export class DeleteUserService {
  /**
   * Elimina la cuenta del usuario actual
   * @param userId ID del usuario a eliminar
   * @param password Contraseña para reautenticación
   * @throws Error si la eliminación falla
   */
  static async deleteAccount(userId: string, password: string): Promise<void> {
    try {
      log('info', `Attempting to delete account for user: ${userId}`)

      const response = await fetchWithAuth(`${API_BASE_URL}/users/${userId}/delete`, {
        method: 'POST',
        body: JSON.stringify({ password } as DeleteAccountRequest)
      })

      log('info', `Response status for account deletion: ${response.status}`)

      // 204 No Content = Éxito
      if (response.status === 204) {
        log('info', 'Account deleted successfully')
        return
      }

      // Manejar errores - intentar obtener mensaje del backend
      let errorData: { message?: string } = {}
      try {
        errorData = await response.json()
      } catch (parseError) {
        log('warn', 'Could not parse error response as JSON:', parseError)
      }

      const backendMessage = errorData.message || 'Error al eliminar la cuenta'

      // Lanzar errores con códigos que useErrorHandler pueda manejar
      switch (response.status) {
        case 400:
          // ValidationException - contraseña vacía o datos inválidos
          log('error', 'Bad request - validation error:', backendMessage)
          throw new DeleteAccountError(
            'Por favor, ingresa tu contraseña para continuar',
            'VALIDATION_ERROR',
            400
          )
          
        case 401:
          // InvalidCredentialsException o UnauthorizedException
          log('error', 'Unauthorized - invalid password or session expired:', backendMessage)
          
          // Determinar si es contraseña incorrecta o sesión expirada
          if (backendMessage.toLowerCase().includes('contraseña')) {
            throw new DeleteAccountError(
              backendMessage,
              'INVALID_CREDENTIALS',
              401
            )
          } else {
            throw new DeleteAccountError(
              backendMessage,
              'SESSION_EXPIRED',
              401
            )
          }
          
        case 403:
          // ForbiddenException - sin permiso o cuenta bloqueada
          log('error', 'Forbidden - no permission:', backendMessage)
          throw new DeleteAccountError(
            backendMessage,
            'ACCOUNT_BLOCKED',
            403
          )
          
        case 404:
          // UserNotFoundException
          log('error', 'Not found - user does not exist:', backendMessage)
          throw new DeleteAccountError(
            backendMessage,
            'USER_NOT_FOUND',
            404
          )
          
        default:
          log('error', `Unexpected error: ${response.status}`, backendMessage)
          throw new DeleteAccountError(
            backendMessage,
            'UNKNOWN_ERROR',
            response.status
          )
      }
    } catch (error) {
      // Error de red (Failed to fetch, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        log('error', 'Network error while deleting account:', error)
        throw new DeleteAccountError(
          'No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.',
          'NETWORK_ERROR',
          0
        )
      }
      
      // Si ya es un DeleteAccountError, re-lanzarlo
      if (error instanceof DeleteAccountError) {
        throw error
      }
      
      // Otros errores inesperados
      log('error', 'Unexpected error deleting account:', error)
      throw new DeleteAccountError(
        'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
        'UNKNOWN_ERROR',
        0
      )
    }
  }
}