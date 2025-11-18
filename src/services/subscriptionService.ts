import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

/**
 * DTO para la respuesta del endpoint /api/subscriptions/current
 */
export interface CurrentPlanDTO {
  planName: string
  isVip: boolean
}

/**
 * Servicio para operaciones relacionadas con suscripciones.
 *
 * <p>Proporciona métodos para consultar y cambiar planes de suscripción.</p>
 */
export class SubscriptionService {

  /**
   * Obtiene el plan actual del usuario autenticado
   * @returns Promise<CurrentPlanDTO> - Información del plan actual
   * @throws Error si no hay sesión válida o token inválido
   */
  static async getCurrentPlan(): Promise<CurrentPlanDTO> {
    try {
      log('info', 'Fetching current subscription plan')

      const response = await fetchWithAuth(`${API_BASE_URL}/api/subscriptions/current`, {
        method: 'GET'
      })

      log('info', 'Response status for /current:', { status: response.status })

      if (response.ok) {
        const planData: CurrentPlanDTO = await response.json()
        log('info', 'Current plan data retrieved successfully:', planData)
        return planData
      }

      if (response.status === 401) {
        throw new Error('SESSION_EXPIRED')
      }

      throw new Error('SUBSCRIPTION_DATA_ERROR')

    } catch (error) {
      log('error', 'Error fetching subscription data:', error)
      throw error
    }
  }

  /**
   * Cambia el plan de suscripción del usuario autenticado
   * @param newPlan Nuevo plan ('STANDARD' | 'PREMIUM')
   * @returns Promise<void>
   * @throws Error si falla el cambio
   */
  static async changePlan(newPlan: 'STANDARD' | 'PREMIUM'): Promise<void> {
    try {
      log('info', 'Changing subscription plan:', { newPlan })

      const response = await fetchWithAuth(`${API_BASE_URL}/api/subscriptions/change`, {
        method: 'POST',
        body: JSON.stringify({
          targetPlan: newPlan
        })
      })

      if (response.ok) {
        log('info', 'Subscription plan changed successfully')
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
      log('error', 'Error changing subscription plan:', error)
      throw error
    }
  }
}