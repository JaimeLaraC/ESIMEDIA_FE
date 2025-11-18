import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextHooks'
import { log } from '../config/logConfig'

interface AuthGuardProps {
  readonly children: React.ReactNode
}

/**
 * Componente que protege rutas verificando que el usuario esté autenticado.
 * Si no está autenticado, redirige a la página de error 401.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Esperar a que termine de verificar la sesión inicial
    if (isLoading) {
      log('debug', 'AuthGuard: Verificando sesión...')
      return
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      log('warn', 'AuthGuard: Usuario no autenticado, redirigiendo a home')
      navigate('/', { replace: true })
      return
    }

    log('info', 'AuthGuard: Acceso autorizado - usuario autenticado')
  }, [isLoading, isAuthenticated, navigate])

  // Mostrar indicador de carga mientras verifica la sesión
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Verificando sesión...
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada
  // (la redirección se maneja en el useEffect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
