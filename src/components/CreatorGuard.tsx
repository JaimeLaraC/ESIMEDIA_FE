import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContextHooks'
import { log } from '../config/logConfig'

interface CreatorGuardProps {
  readonly children: React.ReactNode
}

/**
 * Componente que protege las páginas de creadores verificando que el usuario
 * tenga el rol de creador de contenido. Si no tiene permiso, lo redirige a la página de error 403.
 */
export default function CreatorGuard({ children }: CreatorGuardProps) {
  const { user, isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Esperar a que termine de verificar la sesión inicial
    if (isLoading) {
      log('debug', 'CreatorGuard: Verificando sesión...')
      return
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      log('warn', 'CreatorGuard: Usuario no autenticado, redirigiendo a home')
      navigate('/', { replace: true })
      return
    }

    // Verificar si el usuario tiene rol de creador
    if (user?.type !== 'content-creator') {
      log('warn', 'CreatorGuard: Acceso denegado - usuario no es creador', {
        userType: user?.type,
        userEmail: user?.email
      })
      navigate('/error/403', { replace: true })
      return
    }

    log('info', 'CreatorGuard: Acceso autorizado a página de creador', {
      userEmail: user?.email
    })
  }, [isLoading, isAuthenticated, user, navigate])

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
        Verificando permisos...
      </div>
    )
  }

  // Si no está autenticado o no es creador, no renderizar nada
  // (la redirección se maneja en el useEffect)
  if (!isAuthenticated || user?.type !== 'content-creator') {
    return null
  }

  return <>{children}</>
}
