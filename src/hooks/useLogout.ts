import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextHooks'
import { LoginService } from '../services/loginService'
import { useI18n } from '../hooks/useI18n'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { log } from '../config/logConfig'
import { TokenManager } from '../utils/authTokens'

/**
 * Hook personalizado para manejar el logout del usuario.
 *
 * Implementa el flujo correcto de logout:
 * 1. Navega a home primero (para evitar que ProfileGuard redirija a 401)
 * 2. Limpia el contexto de usuario después
 * 3. Limpia el token JWT del almacenamiento
 *
 * @returns Función handleLogout que puede ser llamada con un callback opcional para cerrar menús
 *
 * @example
 * const handleLogout = useLogout()
 *
 * // Uso simple
 * <button onClick={handleLogout}>Cerrar sesión</button>
 *
 * // Con cierre de menú
 * <button onClick={() => handleLogout(userMenu.close)}>Cerrar sesión</button>
 */
export function useLogout() {
  const { setUser } = useApp()
  const navigate = useNavigate()
  const { t } = useI18n()
  const notifications = useNotifications()

  return useCallback((closeMenu?: () => void) => {
    // Cerrar menú si se proporciona
    closeMenu?.()

    // Navegar ANTES de limpiar el contexto para evitar que ProfileGuard redirija a 401
    navigate('/')

    // Pequeño delay para asegurar que la navegación se inicia antes de limpiar
    setTimeout(async () => {
      try {
        await LoginService.logout(setUser)
        // Asegurar que los tokens se limpian completamente
        TokenManager.removeTokens()
      } catch (error) {
        log('error', 'Logout error:', error)
        // Limpiar tokens incluso si hay error en logout
        TokenManager.removeTokens()
        notifications.error(t('toast.error.logoutFailed'))
      }
    }, 0)
  }, [setUser, navigate, t, notifications])
}
