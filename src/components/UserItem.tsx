// src/components/UserItem.tsx
import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { toast } from 'react-toastify'
import Textbox from '../customcomponents/Textbox'
import FormSelect from '../customcomponents/FormSelect'
import { UserRoleSection, CreatorRoleSection, AdminRoleSection, ManagerRoleSection } from '../customcomponents/UserRoleSections'
import { getUserTypeColor, capitalizeFirst } from '../utils/userTypeUtils'
import { formatDate } from '../utils/dateUtils'

interface User {
  id: string
  userName: string
  email: string
  userType: 'estandar' | 'premium' | 'creador' | 'administrador' | 'gestor'
  registrationDate: string
  lastLoginDate: string | null
  firstName: string
  lastName: string
  profileImage: string
  isActive: boolean
  // Nuevos campos
  roleId?: string
  profileImageId?: string
  emailVerified?: boolean
  lastPasswordChangeAt?: string
  updatedAt?: string
  has2FAEnabled?: boolean
  has3FAEnabled?: boolean
  // Campos específicos del rol
  isVip?: boolean
  birthDate?: string
  department?: string
  // Campos específicos del gestor
  description?: string
  specialty?: string
  contentType?: string
  requestStatus?: 'pending' | 'approved' | 'rejected'
}

interface UserItemProps {
  readonly user: User
  readonly isEditing: boolean
  readonly onEditStart: () => void
  readonly onEditSave: (updatedUser: Partial<User>) => void
  readonly onEditCancel: () => void
  readonly onToggleBlock: (userId: string, block: boolean) => void
  readonly onDelete: (userId: string) => void
}

export default function UserItem({
  user,
  isEditing,
  onEditStart,
  onEditSave,
  onEditCancel,
  onToggleBlock,
  onDelete
}: UserItemProps) {
  const { t, translations } = useI18n()
  const { updateUserInfo } = useAdminUsers({ autoFetch: false })
  const [isExpanded, setIsExpanded] = useState(false)
  const [editData, setEditData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    specialty: user.specialty || '',
    description: user.description || ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEditSave = async () => {
    try {
      setIsUpdating(true)

      // Preparar datos según restricciones de rol
      const updatePayload: { nombre: string; apellido: string; alias?: string; especialidad?: string; descripcion?: string } = {
        nombre: editData.firstName.trim(),
        apellido: editData.lastName.trim()
      }

      // Solo incluir alias para usuarios estándar
      if (user.userType === 'estandar' || user.userType === 'premium') {
        updatePayload.alias = editData.userName?.trim() || undefined
      }

      // Incluir especialidad y descripción para creadores y gestores
      if (user.userType === 'creador' || user.userType === 'gestor') {
        updatePayload.especialidad = editData.specialty?.trim() || undefined
        updatePayload.descripcion = editData.description?.trim() || undefined
      }

      console.log('UserItem - Actualizando usuario:', {
        userId: user.id,
        userType: user.userType,
        canEditAlias,
        updatePayload,
        hasAlias: !!updatePayload.alias,
        aliasValue: updatePayload.alias
      })

      // Llamar a la API
      await updateUserInfo(user.id, updatePayload)

      // Notificar al componente padre
      onEditSave({
        firstName: editData.firstName,
        lastName: editData.lastName,
        userName: editData.userName,
        specialty: editData.specialty,
        description: editData.description
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar usuario'
      toast.error(errorMessage)
      console.error('Error al actualizar usuario:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const canEditAlias = user.userType === 'estandar' || user.userType === 'premium'

  // Generar opciones de especialidad desde las traducciones
  const specialtyKeys = Object.keys(translations.creator?.channel?.specialties || {})
  const specialtyOptions = [
    { value: '', label: t('creator.form.fields.specialty') },
    ...specialtyKeys.map(specialty => ({
      value: specialty,
      label: t(`creator.channel.specialties.${specialty}`)
    }))
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const renderAliasField = () => {
    if (isEditing) {
      return canEditAlias ? (
        <Textbox
          type="text"
          name="userName"
          value={editData.userName}
          onChange={handleInputChange}
          className="edit-input"
        />
      ) : (
        <span className="request-detail-value">{t('admin.users.noAlias')}</span>
      )
    }
    return <span className="request-detail-value">
      {user.userType === 'administrador' ? t('admin.users.noAlias') : user.userName}
    </span>
  }

  const handleToggleBlock = () => {
    onToggleBlock(user.id, user.isActive)
  }

  const handleDelete = () => {
    onDelete(user.id)
  }

  // Wrapper para formatDate que usa valor por defecto de traducción
  const formatDateWithFallback = (dateString: string | null | undefined): string => {
    return formatDate(dateString, t('admin.users.never'))
  }

  const renderBasicInfoSection = () => (
    <div className="request-details-grid">
      <div className="request-detail">
        <span className="request-detail-label">{t('profile.cards.profile.fields.firstName')}</span>
        {isEditing ? (
          <Textbox
            type="text"
            name="firstName"
            value={editData.firstName}
            onChange={handleInputChange}
            className="edit-input"
          />
        ) : (
          <span className="request-detail-value">{user.firstName}</span>
        )}
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('profile.cards.profile.fields.lastName')}</span>
        {isEditing ? (
          <Textbox
            type="text"
            name="lastName"
            value={editData.lastName}
            onChange={handleInputChange}
            className="edit-input"
          />
        ) : (
          <span className="request-detail-value">{user.lastName}</span>
        )}
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.alias')}</span>
        {renderAliasField()}
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.id')}</span>
        <span className="request-detail-value">{user.id}</span>
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.roleId')}</span>
        <span className="request-detail-value">{user.roleId || 'N/A'}</span>
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.created')}</span>
        <span className="request-detail-value">{formatDateWithFallback(user.registrationDate)}</span>
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.lastLogin')}</span>
        <span className="request-detail-value">{formatDateWithFallback(user.lastLoginDate)}</span>
      </div>

      <div className="request-detail">
        <span className="request-detail-label">{t('admin.users.updatedAt')}</span>
        <span className="request-detail-value">{formatDateWithFallback(user.updatedAt)}</span>
      </div>
    </div>
  )

  const renderAuthSection = () => (
    <div className="request-details-section">
      <h5 className="section-title">{t('admin.users.auth.title')}</h5>
      <div className="request-details-grid">
        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.emailVerified')}</span>
          <span className="request-detail-value">
            {user.emailVerified ? t('admin.users.yes') : t('admin.users.no')}
          </span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.lastPasswordChange')}</span>
          <span className="request-detail-value">{formatDateWithFallback(user.lastPasswordChangeAt)}</span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.auth.has2FA')}</span>
          <span className="request-detail-value">
            {user.has2FAEnabled ? t('admin.users.yes') : t('admin.users.no')}
          </span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.auth.has3FA')}</span>
          <span className="request-detail-value">
            {user.has3FAEnabled ? t('admin.users.yes') : t('admin.users.no')}
          </span>
        </div>
      </div>
    </div>
  )


  const handleEditStart = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      specialty: user.specialty || '',
      description: user.description || ''
    })
    onEditStart()
  }

  const handleEditCancel = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      specialty: user.specialty || '',
      description: user.description || ''
    })
    onEditCancel()
  }

  const renderActions = () => {
    if (!isExpanded) return null

    return (
      <div className="content-actions">
        {isEditing ? (
          <>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEditSave}
              disabled={isUpdating}
              title={t('admin.users.save')}
            >
              {isUpdating ? t('admin.users.saving') : t('admin.users.save')}
            </button>
            <button
              className="btn btn-cancel btn-sm"
              onClick={handleEditCancel}
              disabled={isUpdating}
              title={t('admin.users.cancel')}
            >
              {t('admin.users.cancel')}
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleEditStart}
              title={t('admin.users.edit')}
            >
              {t('admin.users.edit')}
            </button>
            <button
              className={`btn ${user.isActive ? 'btn-cancel' : 'btn-primary'} btn-sm`}
              onClick={handleToggleBlock}
              title={user.isActive ? t('admin.users.block') : t('admin.users.unblock')}
            >
              {user.isActive ? t('admin.users.block') : t('admin.users.unblock')}
            </button>
            {/* Solo mostrar botón de eliminar para admins y gestores, no para usuarios finales */}
            {(user.userType === 'administrador' || user.userType === 'gestor' || user.userType === 'creador') && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                title={t('admin.users.delete')}
              >
                {t('admin.users.delete')}
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="content-list-item">
      <div className="request-info">
        <div className="request-header">
          <div className="user-main-info">
            <h4 className="request-user">{user.firstName} {user.lastName}</h4>
            <span className="request-email">{user.email}</span>
            <div className="user-badges">
              <span className={`request-status ${getUserTypeColor(user.userType)}`}>
                {t(`admin.users.types.${user.userType}`)}
              </span>
              {!user.isActive && (
                <span className="request-status request-status-blocked">
                  {t('admin.users.status.blocked')}
                </span>
              )}
            </div>
          </div>
          <div className="user-dates">
            <div className="date-info">
              <span className="date-label">{t('admin.users.created')}</span>
              <span className="date-value">{formatDate(user.registrationDate)}</span>
            </div>
            <div className="date-info">
              <span className="date-label">{t('admin.users.lastLogin')}</span>
              <span className="date-value">{formatDate(user.lastLoginDate)}</span>
            </div>
          </div>
          <button
            className="btn-collapse"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? t('admin.requests.collapse') : t('admin.requests.expand')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <path d="M7,10L12,15L17,10H7Z" />
            </svg>
          </button>
        </div>

        <div className="request-metadata">
          {/* Acciones en vista compacta */}
          <div className="content-actions-compact">
            <button
              className={`btn ${user.isActive ? 'btn-cancel' : 'btn-primary'} btn-sm`}
              onClick={handleToggleBlock}
              title={user.isActive ? t('admin.users.block') : t('admin.users.unblock')}
            >
              {user.isActive ? t('admin.users.block') : t('admin.users.unblock')}
            </button>
            {/* Solo mostrar botón de eliminar para admins y gestores, no para usuarios finales */}
            {(user.userType === 'administrador' || user.userType === 'gestor' || user.userType === 'creador') && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                title={t('admin.users.delete')}
              >
                {t('admin.users.delete')}
              </button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="request-expanded-content">
            {/* Información básica */}
            {renderBasicInfoSection()}

            {/* Información de autenticación */}
            {renderAuthSection()}

            {/* Información específica del rol */}
            <UserRoleSection user={user} t={t} />
            <CreatorRoleSection
              user={user}
              isEditing={isEditing}
              editData={editData}
              specialtyOptions={specialtyOptions}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              t={t}
            />
            <AdminRoleSection user={user} t={t} />
            <ManagerRoleSection
              user={user}
              isEditing={isEditing}
              editData={editData}
              specialtyOptions={specialtyOptions}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              t={t}
            />

            <div className="request-profile-image">
              <span className="request-detail-label">{t('profile.photo.placeholder')}</span>
              <div className="profile-image-info">
                <img
                  src={user.profileImage}
                  alt={t('profile.photo.placeholder')}
                  className="profile-image-preview"
                />
                <span className="profile-image-id">{t('admin.users.profileImageId')}: {user.profileImageId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderActions()}
    </div>
  )
}