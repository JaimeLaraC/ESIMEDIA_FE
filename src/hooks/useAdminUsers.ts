import { useState, useEffect, useCallback } from 'react'
import { getAllUsers, updateUser, toggleUserBlock, deleteUser, type UserListItem } from '../services/adminService'
import { log } from '../config/logConfig'

/**
 * Hook para gestionar la lista de usuarios del sistema
 * Obtiene automáticamente los usuarios al montar el componente
 * 
 * @param options.autoFetch - Si es false, no carga usuarios automáticamente (útil cuando solo se necesitan las funciones de actualización)
 */
export function useAdminUsers(options: { autoFetch?: boolean } = { autoFetch: true }) {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [isLoading, setIsLoading] = useState(options.autoFetch ?? true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carga la lista de usuarios desde el backend
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await getAllUsers()
      setUsers(data)
      
      log('info', 'Hook useAdminUsers: usuarios cargados', { count: data.length })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios'
      setError(errorMessage)
      log('error', 'Hook useAdminUsers: error al cargar usuarios', err)
    } finally {
      setIsLoading(false)
    }
  }, []) // Este callback NO cambia nunca

  /**
   * Función para recargar manualmente la lista de usuarios
   */
  const refetch = useCallback(() => {
    log('info', 'Hook useAdminUsers: recargando usuarios...')
    fetchUsers()
  }, [fetchUsers])

  /**
   * Actualiza la información de un usuario
   */
  const updateUserInfo = useCallback(async (userId: string, updateData: { nombre: string; apellido: string; alias?: string }) => {
    try {
      log('info', 'Hook useAdminUsers: actualizando usuario', { userId })
      
      const updatedUser = await updateUser(userId, updateData)
      
      // Actualizar el usuario en el estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      )
      
      log('info', 'Hook useAdminUsers: usuario actualizado exitosamente', { userId })
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario'
      log('error', 'Hook useAdminUsers: error al actualizar usuario', { userId, error: err })
      throw new Error(errorMessage)
    }
  }, [])

  /**
   * Bloquea o desbloquea un usuario
   */
  const toggleBlockUser = useCallback(async (userId: string, block: boolean) => {
    try {
      log('info', 'Hook useAdminUsers: cambiando estado de bloqueo', { userId, block })
      
      await toggleUserBlock(userId, block)
      
      // Actualizar el estado del usuario en la lista local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: block ? 'BLOCKED' : 'ACTIVE' } : user
        )
      )
      
      log('info', 'Hook useAdminUsers: estado de bloqueo actualizado', { userId, block })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado de bloqueo'
      log('error', 'Hook useAdminUsers: error al cambiar estado de bloqueo', { userId, block, error: err })
      throw new Error(errorMessage)
    }
  }, [])

  /**
   * Elimina un usuario del sistema
   */
  const removeUser = useCallback(async (userId: string) => {
    try {
      log('info', 'Hook useAdminUsers: eliminando usuario', { userId })
      
      await deleteUser(userId)
      
      // Remover el usuario de la lista local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      
      log('info', 'Hook useAdminUsers: usuario eliminado exitosamente', { userId })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario'
      log('error', 'Hook useAdminUsers: error al eliminar usuario', { userId, error: err })
      throw new Error(errorMessage)
    }
  }, [])

  // Cargar usuarios SOLO al montar el componente SI autoFetch está habilitado
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo se ejecuta UNA VEZ al montar

  return {
    users,
    isLoading,
    error,
    refetch,
    updateUserInfo,
    toggleBlockUser,
    removeUser
  }
}
