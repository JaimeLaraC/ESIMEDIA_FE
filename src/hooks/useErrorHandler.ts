import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { log } from '../config/logConfig'
import { requiresNavigation, getErrorNavigationPath, getDefaultErrorMessage } from '../utils/errorValidators'

/**
 * Hook personalizado para manejar errores de autenticación y navegación
 * @returns Objeto con métodos para manejar diferentes tipos de errores
 */
export function useErrorHandler() {
  const navigate = useNavigate()

  /**
   * Maneja errores de autenticación, navega a páginas de error cuando es necesario
   * y retorna el mensaje de error apropiado para mostrar en la UI
   * @param errorCode Código del error
   * @param errorMessage Mensaje del error
   * @returns Mensaje de error localizado o null si requiere navegación
   */
  const handleAuthError = useCallback((errorCode?: string, errorMessage?: string): string | null => {
    log('info', 'Handling auth error:', { errorCode, errorMessage })

    if (errorCode && requiresNavigation(errorCode)) {
      const path = getErrorNavigationPath(errorCode)
      if (path) {
        navigate(path)
        return null
      }
    }

    // For non-navigation errors, return the message
    return errorMessage || getDefaultErrorMessage(errorCode || '')
  }, [navigate])

  const goToLogin = useCallback(() => {
    navigate('/auth')
  }, [navigate])

  const goToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return {
    handleAuthError,
    goToLogin,
    goToHome,
    goBack
  }
}