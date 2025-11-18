import { useState, useEffect, useCallback } from 'react'
import { SubscriptionService, type CurrentPlanDTO } from '../services/subscriptionService'
import { log } from '../config/logConfig'

/**
 * Estado de la suscripción del usuario
 */
export interface SubscriptionState {
  planName: string
  isVip: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Hook personalizado para manejar la suscripción del usuario
 *
 * Proporciona estado y métodos para consultar y cambiar la suscripción
 * del usuario autenticado.
 */
export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    planName: 'STANDARD',
    isVip: false,
    isLoading: true,
    error: null
  })

  /**
   * Carga la información de suscripción actual
   */
  const loadSubscription = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const planData: CurrentPlanDTO = await SubscriptionService.getCurrentPlan()

      setState({
        planName: planData.planName,
        isVip: planData.isVip,
        isLoading: false,
        error: null
      })

      log('info', 'Subscription loaded successfully:', planData)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      log('error', 'Error loading subscription:', error)
    }
  }, [])

  /**
   * Cambia el plan de suscripción
   */
  const changePlan = useCallback(async (newPlan: 'STANDARD' | 'PREMIUM') => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      await SubscriptionService.changePlan(newPlan)

      // Recargar la información después del cambio
      await loadSubscription()

      log('info', 'Subscription changed successfully to:', newPlan)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el plan'

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))

      log('error', 'Error changing subscription:', error)
      throw error // Re-lanzar para que el componente pueda manejar el error
    }
  }, [loadSubscription])

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Cargar suscripción al montar el hook
  useEffect(() => {
    loadSubscription()
  }, [loadSubscription])

  return {
    // Estado
    planName: state.planName,
    isVip: state.isVip,
    isLoading: state.isLoading,
    error: state.error,

    // Métodos
    loadSubscription,
    changePlan,
    clearError,

    // Utilidades
    isPremium: state.isVip, // Alias para compatibilidad
    plan: state.planName
  }
}