import { createContext, useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Page, UserType, User, AppContextType } from './AppContextTypes'
import { UserService } from '../services/userService'
import { mapUserSummaryToUser } from '../utils/userUtils'
import { useSubscription } from '../hooks/useSubscription'
import { log } from '../config/logConfig'

const AppContext = createContext<AppContextType | undefined>(undefined)

export { AppContext }

export function AppProvider({ children }: { readonly children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [user, setUser] = useState<User | null>(null)
  const [headerOverride, setHeaderOverride] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) // Inicialmente está cargando

  // Hook para manejar la suscripción del usuario
  const subscription = useSubscription()

  const isAuthenticated = user !== null

  // Verificar sesión al montar el componente usando cookies HttpOnly
  useEffect(() => {
    const checkSession = async () => {
      try {
        log('debug', 'Checking session via HttpOnly cookies')

        // Intentar obtener datos del usuario actual
        // Las cookies HttpOnly se envían automáticamente con la petición
        try {
          const userData = await UserService.getCurrentUser()
          const user = mapUserSummaryToUser(userData)
          setUser(user)
          log('debug', 'User session validated successfully:', { userId: user.id, email: user.email })
        } catch (error) {
          log('debug', 'No valid session found or backend error:', error)

          // Si obtenemos un 401, significa que no hay sesión válida
          if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
            log('debug', 'No active session (401 response)')
            setUser(null)
          } else {
            // Error de conexión u otro problema - asumir no autenticado
            log('debug', 'Backend validation failed - assuming no active session')
            setUser(null)
          }
        }
      } catch (error) {
        log('error', 'Unexpected error checking session:', error)
        setUser(null)
      } finally {
        // Siempre marcar como completada la carga, haya sesión o no
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const value = useMemo(() => ({
    currentPage,
    setCurrentPage,
    user,
    setUser,
    isAuthenticated,
    isLoading,
    headerOverride,
    setHeaderOverride,
    // Información de suscripción
    subscription: {
      planName: subscription.planName,
      isVip: subscription.isVip,
      isPremium: subscription.isPremium,
      isLoading: subscription.isLoading,
      error: subscription.error,
      changePlan: subscription.changePlan,
      loadSubscription: subscription.loadSubscription,
      clearError: subscription.clearError
    }
  }), [currentPage, setCurrentPage, user, setUser, isAuthenticated, isLoading, headerOverride, setHeaderOverride, subscription])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
