import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { log } from '../config/logConfig'
import ProfilePage from './ProfilePage'
import type { UserProfile } from '../utils/profileUtils'
import { mapDTOToUserProfile } from '../utils/profileMapper'
import { mapUserSummaryToUser } from '../utils/userUtils'
import { UserService } from '../services/userService'
import { useApp } from '../hooks/useApp'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { useI18n } from '../hooks/useI18n'
import '../styles/pages/ProfilePage.css'

export default function ProfilePageAdmin() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { setUser } = useApp()
  const { t } = useI18n()
  const { success, error: showError } = useNotifications()
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  log('info', 'ProfilePageAdmin: Rendering for userId:', userId)

  const loadUserProfile = async () => {
    if (!userId) {
      setError('ID de usuario no proporcionado')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Usar el nuevo endpoint /users/:id que devuelve el DTO completo según el rol
      const userData = await UserService.getUserById(userId)
      const profile = mapDTOToUserProfile(userData)
      
      log('info', 'ProfilePageAdmin: Datos del perfil cargados:', profile)
      setProfileData(profile)
      
    } catch (err) {
      log('error', 'ProfilePageAdmin: Error cargando perfil:', err)
      
      // Si es error de autorización, redirigir a página de error 401 y limpiar contexto
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        log('warn', 'ProfilePageAdmin: Sesión expirada, redirigiendo a 401')
        setUser(null)
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        navigate('/error/401', { replace: true })
        return
      }
      
      setError(t('profilePage.error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const handleSaveProfile = async (data: { alias?: string; firstName: string; lastName: string }) => {
    try {
      log('info', 'Guardando perfil de admin:', data)
      
      // Llamar al servicio para actualizar el perfil
      const updatedUser = await UserService.updateProfile({
        nombre: data.firstName,
        apellido: data.lastName,
        alias: data.alias
      })
      
      log('info', 'Perfil actualizado exitosamente:', updatedUser)
      
      // Actualizar el estado local con los nuevos datos
      const updatedProfile = mapDTOToUserProfile(updatedUser)
      setProfileData(updatedProfile)
      
      // Actualizar el contexto de usuario también
      setUser(mapUserSummaryToUser(updatedUser))
      
      success(t('toast.success.profileUpdated'))
    } catch (err) {
      log('error', 'Error guardando perfil:', err)
      
      if (err instanceof Error) {
        if (err.message === 'UNAUTHORIZED') {
          // Sesión expirada, redirigir a login
          setUser(null)
          navigate('/error/401', { replace: true })
          return
        }
      }
      showError(t('toast.error.profileSaveFailed'))
    }
  }

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="profile-loading">
        <p>{t('profilePage.loading')}</p>
      </div>
    )
  }

  // Mostrar error si ocurrió
  if (error || !profileData) {
    return (
      <div className="profile-error">
        <p>{error || t('profilePage.error')}</p>
      </div>
    )
  }

  // El ProfileGuard ya verificó que este sea el perfil propio
  const isOwnProfile = true

  return (
    <ProfilePage
      profileData={profileData}
      isOwnProfile={isOwnProfile}
      onSaveProfile={handleSaveProfile}
      onReloadProfile={loadUserProfile}
    />
  )
}