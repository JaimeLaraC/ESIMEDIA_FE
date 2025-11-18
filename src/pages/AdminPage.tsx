import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import { useCreatorRequests } from '../hooks/useCreatorRequests'
import { useAdminUsers } from '../hooks/useAdminUsers'
import HeaderAdmin from '../components/HeaderAdmin'
import CreatorRequestsList from '../components/CreatorRequestsList'
import UsersList from '../components/UsersList'
import CreateAdminForm from '../components/CreateAdminForm'
import ConfirmationModal from '../components/ConfirmationModal'
import LoadingState from '../customcomponents/LoadingState'
import ErrorState from '../customcomponents/ErrorState'
import { log } from '../config/logConfig'
import defaultAvatar from '../assets/profile_images/default.svg'
import '../styles/pages/AdminPage.css'

export default function AdminPage() {
  const { t } = useI18n()
  const { user } = useApp()
  const navigate = useNavigate()

  // Estado para el modal de confirmación
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    confirmButtonClass?: string
    onConfirm: () => void | Promise<void>
    isLoading?: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  useEffect(() => {
    if (user?.type !== 'administrator') {
      navigate('/error/401', { replace: true })
    }
  }, [user, navigate])

  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    handleApprove,
    handleReject,
    retry: retryRequests
  } = useCreatorRequests()

  // Hook para obtener usuarios del sistema
  const {
    users: adminUsers,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useAdminUsers()

  // Función para mapear rol del backend a tipo de usuario del frontend
  const mapRolToUserType = (role: string, esVIP: boolean): 'estandar' | 'premium' | 'creador' | 'administrador' | 'gestor' => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'ADMINISTRADOR':
        return 'administrador'
      case 'CREATOR':
      case 'CREADOR_DE_CONTENIDO':
        return 'gestor' // Los creators del backend son gestores en el frontend
      case 'USER':
      case 'USUARIO':
        return esVIP ? 'premium' : 'estandar'
      default:
        return 'estandar'
    }
  }

  // Mapear usuarios del backend al formato que espera UsersList
  const users = adminUsers.map((backendUser) => {
    // Debug: log del primer usuario para ver qué campos llegan
    if (adminUsers.indexOf(backendUser) === 0) {
      log('debug', 'Primer usuario del backend:', {
        id: backendUser.id,
        role: backendUser.role,
        roleId: backendUser.roleId,
        status: backendUser.status,
        emailVerified: backendUser.emailVerified,
        lastLoginAt: backendUser.lastLoginAt,
        createdAt: backendUser.createdAt,
        requestStatus: backendUser.requestStatus,
        hasFields: {
          departamento: !!backendUser.departamento,
          descripcion: !!backendUser.descripcion,
          especialidad: !!backendUser.especialidad,
          fechaNacimiento: !!backendUser.fechaNacimiento,
          esVIP: backendUser.esVIP,
          has2FAEnabled: backendUser.has2FAEnabled,
          has3FAEnabled: backendUser.has3FAEnabled
        }
      })
    }

    return {
      id: backendUser.id,
      userName: backendUser.alias || backendUser.nombre,
      email: backendUser.email,
      userType: mapRolToUserType(backendUser.role, backendUser.esVIP || false),
      registrationDate: backendUser.createdAt || '',
      lastLoginDate: backendUser.lastLoginAt || null,
      firstName: backendUser.nombre,
      lastName: backendUser.apellido || '',
      profileImage: backendUser.fotoPerfilUrl || defaultAvatar,
      isActive: backendUser.status?.toUpperCase() === 'ACTIVE' || 
                backendUser.status?.toUpperCase() === 'ENABLED' ||
                backendUser.status?.toUpperCase() === 'VERIFIED',
      // Campos del UserSummaryBaseDTO
      roleId: backendUser.roleId, // ID del rol
      profileImageId: backendUser.fotoPerfilId,
      emailVerified: backendUser.emailVerified,
      lastPasswordChangeAt: backendUser.lastPasswordChangeAt,
      updatedAt: backendUser.updatedAt,
      has2FAEnabled: backendUser.has2FAEnabled,
      has3FAEnabled: backendUser.has3FAEnabled,
      // Campos específicos del rol (dependen del tipo de UserSummaryDTO que llegue)
      isVip: backendUser.esVIP || undefined,
      birthDate: backendUser.fechaNacimiento || undefined,
      department: backendUser.departamento,
      // Campos específicos del gestor/creador
      description: backendUser.descripcion,
      specialty: backendUser.especialidad || undefined,
      contentType: backendUser.tipoContenido,
      requestStatus: backendUser.requestStatus as 'pending' | 'approved' | 'rejected' | undefined // Estado de la solicitud si aplica
    }
  })

  // Combinar estados de carga y error
  const loading = requestsLoading || usersLoading
  const error = requestsError || usersError

  const retry = () => {
    retryRequests()
    refetchUsers()
  }

  if (user?.type !== 'administrator') return null

  if (loading) {
    return (
      <div className="admin-page">
        <HeaderAdmin />
        <div className="admin-container">
          <LoadingState message={t('adminPage.loading')} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-page">
        <HeaderAdmin />
        <div className="admin-container">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <HeaderAdmin />
      <div className="admin-container">
        <div className="admin-header">
          <h1>{t('admin.dashboard.title')}</h1>
          <p>{t('admin.dashboard.welcome')}</p>
        </div>

        <CreatorRequestsList
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <UsersList
          users={users}
          onRefresh={refetchUsers}
        />

        <CreateAdminForm onSubmit={(adminData) => {
          log('info', 'Nuevo admin:', adminData)
        }} />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          confirmButtonClass={confirmationModal.confirmButtonClass}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => setConfirmationModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
          isLoading={confirmationModal.isLoading}
        />
      </div>
    </div>
  )
}
