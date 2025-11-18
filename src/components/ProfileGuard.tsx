import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContextHooks'
import { log } from '../config/logConfig'

interface ProfileGuardProps {
  readonly children: React.ReactNode
}

/**
 * Componente que protege las páginas de perfil verificando que el usuario
 * solo pueda acceder a su propio perfil. Si intenta acceder al perfil de
 * otro usuario, lo redirige a la página de error 401.
 */
export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, isAuthenticated, isLoading } = useApp()
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    // Esperar a que termine de verificar la sesión inicial
    if (isLoading) {
      log('debug', 'ProfileGuard: Verificando sesión...')
      return
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      log('warn', 'ProfileGuard: Usuario no autenticado, redirigiendo a home')
      navigate('/', { replace: true })
      return
    }

    // Verificar si el userId de la ruta coincide con el usuario autenticado
    if (!userId || user?.id !== userId) {
      log('warn', 'ProfileGuard: Intento de acceso no autorizado al perfil', {
        requestedUserId: userId,
        authenticatedUserId: user?.id,
        authenticatedUser: user?.email
      })
      navigate('/error/401', { replace: true })
      return
    }

    log('info', 'ProfileGuard: Acceso autorizado al perfil propio', {
      userId,
      userEmail: user?.email
    })
  }, [isLoading, isAuthenticated, user, userId, navigate])

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

  // Si no está autenticado o no es el propietario, no renderizar nada
  // (la redirección se maneja en el useEffect)
  if (!isAuthenticated || user?.id !== userId) {
    return null
  }

  return <>{children}</>
}