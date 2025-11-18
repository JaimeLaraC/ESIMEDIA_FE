import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteUserService, DeleteAccountError } from '../services/deleteUserService'
import { useApp } from './useApp'
import { useErrorHandler } from './useErrorHandler'
import { useI18n } from './useI18n'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { log } from '../config/logConfig'

export const useDeleteAccount = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setUser } = useApp()
  const { handleAuthError } = useErrorHandler()
  const { t } = useI18n()
  const { success } = useNotifications()

  const deleteAccount = async (userId: string, password: string) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      log('info', 'Starting account deletion process')
      
      // Llamar al servicio
      await DeleteUserService.deleteAccount(userId, password)

      log('info', 'Account deletion successful, navigating to home')
      
      // Navegar a la página de inicio PRIMERO para evitar que ProfileGuard redirija
      navigate('/')
      
      // Limpiar contexto de usuario después de la navegación
      setUser(null)
      
      // Limpiar almacenamiento local
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      
      // Mostrar notificación de despedida
      success(t('toast.success.accountDeleted'))
      
      log('info', 'User context cleared and navigation completed')
      
    } catch (error) {
      log('error', 'Account deletion failed:', error)
      
      // Manejar errores usando useErrorHandler
      if (error instanceof DeleteAccountError) {
        // Usar handleAuthError para manejar códigos conocidos
        const errorMessage = handleAuthError(error.code, error.message)
        
        // Si handleAuthError retorna null, significa que navegó a página de error
        // Si retorna mensaje, mostrarlo en el modal
        if (errorMessage) {
          setDeleteError(errorMessage)
        }
        // Si es null, el usuario fue redirigido (401, 403)
      } else if (error instanceof Error) {
        // Error genérico
        setDeleteError(error.message)
      } else {
        setDeleteError('Error inesperado al eliminar la cuenta')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const clearError = () => setDeleteError(null)

  return {
    deleteAccount,
    isDeleting,
    deleteError,
    clearError,
  }
}