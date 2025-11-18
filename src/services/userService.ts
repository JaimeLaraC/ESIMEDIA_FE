import { log } from '../config/logConfig'
import type { UserSummaryDTO } from './loginService'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

/**
 * Servicio para operaciones relacionadas con usuarios.
 * 
 * <p>Proporciona métodos para obtener datos de usuario, incluyendo el usuario actual
 * y perfiles de otros usuarios (si está autorizado).</p>
 */
export class UserService {
  
  /**
   * Obtiene los datos del usuario autenticado actual
   * @returns Promise<UserSummaryDTO> - Datos del usuario
   * @throws Error si no hay sesión válida o token inválido
   */
  static async getCurrentUser(): Promise<UserSummaryDTO> {
    try {
      log('info', 'Fetching current user data')

      const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        method: 'GET'
      })

      log('info', 'Response status for /me:', { status: response.status })

      if (response.ok) {
        const userData: UserSummaryDTO = await response.json()
        log('info', 'Current user data retrieved successfully')
        return userData
      }

      if (response.status === 401) {
        throw new Error('SESSION_EXPIRED')
      }

      throw new Error('USER_DATA_ERROR')

    } catch (error) {
      log('error', 'Error fetching user data:', error)
      throw error
    }
  }

  /**
   * Obtiene los datos de un usuario por su ID
   *
   * NOTA: Este método está preparado para cuando se implemente el endpoint
   * GET /users/:id en el backend para ver perfiles de otros usuarios.
   * Por ahora, las páginas de perfil usan getCurrentUser() ya que el ProfileGuard
   * asegura que solo se puede ver el perfil propio.
   *
   * @param userId ID del usuario
   * @returns Promise<UserSummaryDTO> - Datos del usuario
   * @throws Error si el usuario no existe o no está autorizado
   */
  static async getUserById(userId: string): Promise<UserSummaryDTO> {
    try {
      log('info', 'Fetching user data by ID:', { userId })

      const response = await fetchWithAuth(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET'
      })

      if (response.ok) {
        const userData: UserSummaryDTO = await response.json()
        log('info', 'User data retrieved successfully')
        return userData
      }

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED')
      }

      if (response.status === 404) {
        throw new Error('USER_NOT_FOUND')
      }

      throw new Error('USER_DATA_ERROR')

    } catch (error) {
      log('error', 'Error fetching user by ID:', error)
      throw error
    }
  }

  /**
   * Verifica si el usuario tiene una sesión válida
   * @returns Promise<boolean> - true si está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      log('debug', 'User not authenticated:', error)
      return false
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   *
   * El userId se extrae automáticamente del JWT token en el backend.
   *
   * @param data Datos actualizados del perfil
   * @returns Promise con el usuario actualizado
   * @throws Error si falla la actualización
   */
  static async updateProfile(data: {
    nombre: string
    apellido: string
    alias?: string
    especialidad?: string
    descripcion?: string
  }): Promise<UserSummaryDTO> {
    try {
      log('info', 'Updating user profile:', data)

      const response = await fetchWithAuth(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        log('info', 'Profile updated successfully')

        // El backend devuelve { success: true, message: string, user: UserSummaryDTO }
        return result.user
      }

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED')
      }

      if (response.status === 409) {
        // El alias ya está en uso
        const error = await response.json()
        throw new Error(error.message || 'El alias ya está en uso')
      }

      if (response.status === 400) {
        const error = await response.json()
        throw new Error(error.message || 'Datos de perfil inválidos')
      }

      throw new Error('PROFILE_UPDATE_ERROR')

    } catch (error) {
      log('error', 'Error updating profile:', error)
      throw error
    }
  }

  /**
   * Cambia la contraseña del usuario autenticado
   *
   * Requiere que el usuario proporcione su contraseña actual para verificar
   * su identidad antes de permitir el cambio. El userId se extrae automáticamente
   * del JWT token en el backend.
   *
   * @param currentPassword Contraseña actual del usuario
   * @param newPassword Nueva contraseña deseada
   * @returns Promise que se resuelve cuando el cambio es exitoso
   * @throws Error con mensaje descriptivo si falla el cambio
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      log('info', 'Changing user password')

      const response = await fetchWithAuth(`${API_BASE_URL}/api/profile/password`, {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      if (response.ok) {
        const result = await response.json()
        log('info', 'Password changed successfully:', result.message)
        return
      }

      if (response.status === 401) {
        // Contraseña actual incorrecta o no autenticado
        const error = await response.json()
        throw new Error(error.message || 'La contraseña actual es incorrecta')
      }

      if (response.status === 400) {
        // Validación fallida (contraseña débil, etc.)
        const error = await response.json()
        throw new Error(error.message || 'La nueva contraseña no cumple los requisitos de seguridad')
      }

      if (response.status === 404) {
        throw new Error('Usuario no encontrado')
      }

      // Error genérico del servidor
      const error = await response.json()
      throw new Error(error.message || 'Error al cambiar la contraseña')

    } catch (error) {
      log('error', 'Error changing password:', error)
      throw error
    }
  }

  /**
   * Cambia la suscripción del usuario autenticado
   *
   * Permite cambiar entre planes standard y premium.
   * El userId se extrae automáticamente del JWT token en el backend.
   *
   * @param newPlan Nuevo plan de suscripción ('standard' | 'premium')
   * @returns Promise que se resuelve cuando el cambio es exitoso
   * @throws Error con mensaje descriptivo si falla el cambio
   */
  static async changeSubscription(newPlan: 'standard' | 'premium'): Promise<void> {
    try {
      log('info', 'Changing user subscription:', { newPlan })

      const response = await fetchWithAuth(`${API_BASE_URL}/api/subscriptions/change`, {
        method: 'POST',
        body: JSON.stringify({
          targetPlan: newPlan.toUpperCase()
        })
      })

      if (response.ok) {
        log('info', 'Subscription changed successfully')
        return
      }

      if (response.status === 401) {
        throw new Error('UNAUTHORIZED')
      }

      if (response.status === 400) {
        throw new Error('Ya tienes este plan de suscripción')
      }

      if (response.status === 402) {
        throw new Error('Pago requerido para cambiar a plan premium')
      }

      if (response.status === 404) {
        throw new Error('Plan de suscripción no encontrado')
      }

      // Error genérico del servidor
      throw new Error('Error al cambiar la suscripción')

    } catch (error) {
      log('error', 'Error changing subscription:', error)
      throw error
    }
  }
}

