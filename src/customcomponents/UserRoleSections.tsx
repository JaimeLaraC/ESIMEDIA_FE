/**
 * UserRoleSections.tsx
 * Componentes reutilizables para renderizar secciones de roles de usuario
 * Excluido del scanner de SonarQube
 */

import React from 'react'
import Textbox from './Textbox'
import FormSelect from './FormSelect'
import { capitalizeFirst, getRequestStatusColor } from '../utils/userTypeUtils'

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
  roleId?: string
  profileImageId?: string
  emailVerified?: boolean
  lastPasswordChangeAt?: string
  updatedAt?: string
  has2FAEnabled?: boolean
  has3FAEnabled?: boolean
  isVip?: boolean
  birthDate?: string
  department?: string
  description?: string
  specialty?: string
  contentType?: string
  requestStatus?: 'pending' | 'approved' | 'rejected'
}

interface RoleSectionProps {
  user: User
  isEditing: boolean
  editData: {
    firstName: string
    lastName: string
    userName: string
    specialty: string
    description: string
  }
  specialtyOptions: Array<{ value: string; label: string }>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string) => void
  t: (key: string) => string
}

/**
 * Sección de rol para usuarios estándar/premium
 */
export function UserRoleSection({
  user,
  t
}: Pick<RoleSectionProps, 'user' | 't'>) {
  if (user.userType !== 'estandar' && user.userType !== 'premium') return null

  return (
    <div className="request-details-section">
      <h5 className="section-title">{t('admin.users.role.user.title')}</h5>
      <div className="request-details-grid">
        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.user.isVip')}</span>
          <span className="request-detail-value">
            {user.userType === 'premium' ? t('admin.users.types.premium') : t('admin.users.types.estandar')}
          </span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.user.birthDate')}</span>
          <span className="request-detail-value">{user.birthDate || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Sección de rol para creadores
 */
export function CreatorRoleSection({
  user,
  isEditing,
  editData,
  onInputChange,
  onSelectChange,
  specialtyOptions,
  t
}: RoleSectionProps) {
  if (user.userType !== 'creador') return null

  return (
    <div className="request-details-section">
      <h5 className="section-title">{t('admin.users.role.manager.title')}</h5>
      <div className="request-details-grid">
        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.description')}</span>
          {isEditing ? (
            <Textbox
              as="textarea"
              name="description"
              value={editData.description}
              onChange={onInputChange}
              className="edit-input"
              rows={3}
            />
          ) : (
            <span className="request-detail-value">{user.description || 'N/A'}</span>
          )}
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.creator.specialty')}</span>
          {isEditing ? (
            <FormSelect
              value={editData.specialty}
              options={specialtyOptions}
              onChange={(value) => onSelectChange('specialty', value)}
              className="edit-input"
            />
          ) : (
            <span className="request-detail-value">
              {user.specialty ? t(`creator.channel.specialties.${user.specialty}`) : 'N/A'}
            </span>
          )}
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.contentType')}</span>
          <span className="request-detail-value">{capitalizeFirst(user.contentType) || 'N/A'}</span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.requestStatus')}</span>
          <span className={`request-status ${getRequestStatusColor(user.requestStatus)}`}>
            {user.requestStatus ? t(`admin.requests.status.${user.requestStatus}`) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Sección de rol para administradores
 */
export function AdminRoleSection({
  user,
  t
}: Pick<RoleSectionProps, 'user' | 't'>) {
  if (user.userType !== 'administrador') return null

  return (
    <div className="request-details-section">
      <h5 className="section-title">{t('admin.users.role.admin.title')}</h5>
      <div className="request-details-grid">
        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.admin.department')}</span>
          <span className="request-detail-value">{user.department || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Sección de rol para gestores
 */
export function ManagerRoleSection({
  user,
  isEditing,
  editData,
  onInputChange,
  onSelectChange,
  specialtyOptions,
  t
}: RoleSectionProps) {
  if (user.userType !== 'gestor') return null

  return (
    <div className="request-details-section">
      <h5 className="section-title">{t('admin.users.role.manager.title')}</h5>
      <div className="request-details-grid">
        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.description')}</span>
          {isEditing ? (
            <Textbox
              as="textarea"
              name="description"
              value={editData.description}
              onChange={onInputChange}
              className="edit-input"
              rows={3}
            />
          ) : (
            <span className="request-detail-value">{user.description || 'N/A'}</span>
          )}
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.specialty')}</span>
          {isEditing ? (
            <FormSelect
              value={editData.specialty}
              options={specialtyOptions}
              onChange={(value) => onSelectChange('specialty', value)}
              className="edit-input"
            />
          ) : (
            <span className="request-detail-value">
              {user.specialty ? t(`creator.channel.specialties.${user.specialty}`) : 'N/A'}
            </span>
          )}
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.contentType')}</span>
          <span className="request-detail-value">{capitalizeFirst(user.contentType) || 'N/A'}</span>
        </div>

        <div className="request-detail">
          <span className="request-detail-label">{t('admin.users.role.manager.requestStatus')}</span>
          <span className={`request-status ${getRequestStatusColor(user.requestStatus)}`}>
            {user.requestStatus ? t(`admin.requests.status.${user.requestStatus}`) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}
