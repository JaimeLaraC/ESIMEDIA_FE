// src/components/UsersList.tsx
import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import FormSelect from '../customcomponents/FormSelect'
import UserItem from './UserItem'
import Textbox from '../customcomponents/Textbox'

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

interface UsersListProps {
  readonly users: User[]
  readonly onRefresh?: () => void
}

export default function UsersList({
  users,
  onRefresh
}: UsersListProps) {
  const { t } = useI18n()
  const { updateUserInfo, toggleBlockUser, removeUser } = useAdminUsers({ autoFetch: false })
  const [userTypeFilter, setUserTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const handleEditStart = (userId: string) => {
    setEditingUserId(userId)
  }

  const handleEditSave = async (userId: string, updatedData: Partial<User>) => {
    try {
      // Convertir los datos al formato esperado por la API
      const updatePayload: any = {
        nombre: updatedData.firstName || '',
        apellido: updatedData.lastName || ''
      }

      // Solo incluir alias para usuarios estándar y premium
      const user = users.find(u => u.id === userId)
      if (user && (user.userType === 'estandar' || user.userType === 'premium')) {
        updatePayload.alias = updatedData.userName?.trim() || undefined
      }
      // Para administradores no incluir alias (no tienen), para creadores/gestores no incluir alias (no editable por admins)

      log('debug', 'Actualizando usuario:', {
        userId,
        userType: user?.userType,
        updatePayload,
        hasAlias: !!updatePayload.alias
      })

      await updateUserInfo(userId, updatePayload)
      log('info', 'Usuario actualizado exitosamente:', userId)
      toast.success(t('admin.users.messages.editSuccess'))
      setEditingUserId(null)
      onRefresh?.() // Refrescar la lista de usuarios
    } catch (error) {
      log('error', 'Error al actualizar usuario:', userId, error)
      const displayErrorMessage = error instanceof Error ? error.message : t('admin.users.messages.editError')
      toast.error(displayErrorMessage)
    }
  }

  const handleToggleBlock = async (userId: string, block: boolean) => {
    try {
      await toggleBlockUser(userId, block)
      log('info', `Usuario ${block ? 'bloqueado' : 'desbloqueado'} exitosamente:`, userId)
      toast.success(t(`admin.users.messages.${block ? 'blockSuccess' : 'unblockSuccess'}`))
      onRefresh?.() // Refrescar la lista de usuarios
    } catch (error) {
      log('error', `Error al ${block ? 'bloquear' : 'desbloquear'} usuario:`, userId, error)
      const action = block ? 'block' : 'unblock'
      const displayErrorMessage = error instanceof Error ? error.message : t(`admin.users.messages.${action}Error`)
      toast.error(displayErrorMessage)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await removeUser(userId)
      log('info', 'Usuario eliminado exitosamente:', userId)
      toast.success(t('admin.users.messages.deleteSuccess'))
      onRefresh?.() // Refrescar la lista de usuarios
    } catch (error) {
      log('error', 'Error al eliminar usuario:', userId, error)
      const displayErrorMessage = error instanceof Error ? error.message : t('admin.users.messages.deleteError')
      toast.error(displayErrorMessage)
    }
  }

  const handleEditCancel = () => {
    setEditingUserId(null)
  }

  const userTypeOptions = [
    { value: '', label: 'Tipo de usuario' },
    { value: 'estandar', label: t('admin.users.types.estandar') },
    { value: 'premium', label: t('admin.users.types.premium') },
    { value: 'creador', label: t('admin.users.types.creador') },
    { value: 'administrador', label: t('admin.users.types.administrador') },
    { value: 'gestor', label: t('admin.users.types.gestor') }
  ]

  const statusOptions = [
    { value: '', label: 'Estado' },
    { value: 'active', label: t('admin.users.filter.active') },
    { value: 'blocked', label: t('admin.users.filter.blocked') }
  ]

  const filteredUsers = users.filter(user => {
    const matchesType = !userTypeFilter || user.userType === userTypeFilter
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? user.isActive : !user.isActive)
    const matchesSearch = !searchQuery ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  return (
    <div className="card card-lg">
      <div className="content-header">
        <h2>{t('admin.users.title')}</h2>
      </div>

      <div className="users-filters">
        <Textbox
          type="text"
          placeholder={t('admin.users.filter.search')}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="filter-search"
          noWrapper={true}
        />
        <div className="filter-group-right">
          <FormSelect
            id="user-type-filter"
            name="userType"
            value={userTypeFilter}
            options={userTypeOptions}
            placeholder={t('admin.users.filter.type')}
            onChange={setUserTypeFilter}
            className="filter-select"
          />
          <FormSelect
            id="user-status-filter"
            name="userStatus"
            value={statusFilter}
            options={statusOptions}
            placeholder={t('admin.users.filter.status')}
            onChange={setStatusFilter}
            className="filter-select"
          />
        </div>
      </div>

      <div className="users-scroll-container">
        <div className="content-list">
          {filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              isEditing={editingUserId === user.id}
              onEditStart={() => handleEditStart(user.id)}
              onEditSave={(updatedData) => handleEditSave(user.id, updatedData)}
              onEditCancel={handleEditCancel}
              onToggleBlock={handleToggleBlock}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}