import React, { useState, useMemo } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import { mapUserSummaryToUser } from '../utils/userUtils'
import Modal from '../customcomponents/Modal'
import Textbox from '../customcomponents/Textbox'
import type { ProfilePageProps } from '../utils/profileUtils'
import {
  getRolePermissions,
  getBadgeClass,
  formatDate
} from '../utils/profileUtils'
import { useProfileEditing } from '../hooks/useProfileEditing'
import { useSecurityModals } from '../hooks/useSecurityModals'
import ChangePasswordModal from '../components/ChangePasswordModal'
import Enable2FAModal from '../components/Enable2FAModal'
import Enable3FAModal from '../components/Enable3FAModal'
import SubscriptionModal from '../components/SubscriptionModal'
import SubscriptionConfirmationModal from '../components/SubscriptionConfirmationModal'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { UserService } from '../services/userService'
import { log } from '../config/logConfig'
import { getSecuritySections } from '../config/securitySectionsConfig'
import '../styles/pages/ProfilePage.css'

// 👇 añadido: resolutor de rutas + imagen por defecto
import defaultAvatar from '../assets/profile_images/default.svg'
import { resolveAvatarUrl } from '../utils/avatar'

export default function ProfilePage({
  profileData,
  isOwnProfile,
  onSaveProfile,
  onReloadProfile
}: Readonly<ProfilePageProps>) {
  const { t } = useI18n()
  const { success, error: showError } = useNotifications()
  const { setUser, subscription } = useApp()

  const profileEditing = useProfileEditing(profileData, onSaveProfile)
  const securityModals = useSecurityModals()

  // Subscription modal states
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isSubscriptionConfirmationModalOpen, setIsSubscriptionConfirmationModalOpen] = useState(false)
  const [isChangingSubscription, setIsChangingSubscription] = useState(false)
  const [targetPlan, setTargetPlan] = useState<'standard' | 'premium'>('standard')

  const permissions = getRolePermissions(profileData.role)

  // Usa la URL directa del perfil o el default
  const avatarUrl = profileData?.profileImage || defaultAvatar



  // Consolidated security action handlers
  const handlePasswordChange = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      log('info', 'Password change requested')
      await UserService.changePassword(currentPassword, newPassword)
      success(t('toast.success.passwordChanged'))
    } catch (error) {
      log('error', 'Error changing password:', error)
      // Re-throw to let the modal handle the error display
      throw error
    }
  }

  const handleEnable2FA = async (verificationCode: string): Promise<void> => {
    log('info', '2FA enable requested:', { verificationCode })
    await new Promise(resolve => setTimeout(resolve, 1000))
    success(t('profile.cards.security.twoFactor.success.enabled'))
  }

  const handleEnable3FA = async (verificationCode: string): Promise<void> => {
    log('info', '3FA enable requested:', { verificationCode })
    await new Promise(resolve => setTimeout(resolve, 1000))
    success(t('profile.cards.security.threeFactor.success.enabled'))
  }

  // Subscription handlers
  const handleOpenSubscriptionModal = () => {
    setIsSubscriptionModalOpen(true)
  }

  const handleCloseSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false)
  }

  const handleSubscriptionChange = (newPlan: 'standard' | 'premium') => {
    setTargetPlan(newPlan)
    setIsSubscriptionModalOpen(false)
    setIsSubscriptionConfirmationModalOpen(true)
  }

  const handleCloseSubscriptionConfirmationModal = () => {
    setIsSubscriptionConfirmationModalOpen(false)
    setTargetPlan('standard')
  }

  const handleConfirmSubscriptionChange = async () => {
    setIsChangingSubscription(true)
    try {
      await UserService.changeSubscription(targetPlan)
      success(t('toast.success.subscriptionChanged'))
      
      // Actualizar el usuario en el contexto con los datos actualizados
      try {
        const updatedUserData = await UserService.getCurrentUser()
        const updatedUser = mapUserSummaryToUser(updatedUserData)
        setUser(updatedUser)
        
        // También recargar la información de suscripción
        await subscription.loadSubscription()
        
        // Recargar el perfil completo para actualizar la interfaz
        if (onReloadProfile) {
          await onReloadProfile()
        }
        
        log('info', 'User context, subscription and profile updated after subscription change:', updatedUser)
      } catch (refreshError) {
        log('error', 'Error refreshing user data after subscription change:', refreshError)
        // Si falla la actualización, recargar la página como fallback
        window.location.reload()
      }
    } catch (error) {
      log('error', 'Error changing subscription:', error)
      showError(t('toast.error.subscriptionChangeFailed'))
    } finally {
      setIsChangingSubscription(false)
      setIsSubscriptionConfirmationModalOpen(false)
      setTargetPlan('standard')
    }
  }

  const renderProfileCard = () => (
    <section className="card card-md">
      <div className="card-header">
        <h2 className="card-title">{t('profile.cards.profile.title')}</h2>
        {isOwnProfile && (
          <button
            onClick={profileEditing.handleProfileEditToggle}
            className="btn btn-secondary btn-sm"
            title={t('profile.actions.editProfileInfo')}
            aria-label={t('profile.actions.editProfileInfo')}
          >
            ✏️
          </button>
        )}
      </div>

      <div className="profile-info-layout">
        <div className="profile-avatar-section">
          <img
  src={avatarUrl}
  alt={t('profile.avatar.alt')}
  className="profile-avatar-large"
/>

          <span className={`badge badge-md profile-badge ${getBadgeClass(profileData.role)}`}>
            {t(`profile.badges.${profileData.role}`)}
          </span>
        </div>

        <div className="profile-details">
          <div className="info-row">
            <div className="info-field editable">
              <label>{t('profile.cards.profile.fields.firstName')}</label>
              {profileEditing.isEditingProfile ? (
                <div className="edit-field">
                  <Textbox
                    type="text"
                    value={profileEditing.firstNameValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => profileEditing.setFirstNameValue(e.target.value)}
                    className="name-input"
                  />
                </div>
              ) : (
                <span>{profileData.firstName}</span>
              )}
            </div>
            <div className="info-field editable">
              <label>{t('profile.cards.profile.fields.lastName')}</label>
              {profileEditing.isEditingProfile ? (
                <div className="edit-field">
                  <Textbox
                    type="text"
                    value={profileEditing.lastNameValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => profileEditing.setLastNameValue(e.target.value)}
                    className="name-input"
                  />
                </div>
              ) : (
                <span>{profileData.lastName}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>{t('profile.cards.profile.fields.email')}</label>
              <span>{profileData.email}</span>
            </div>
            <div className="info-field editable">
              <label>{t('profile.cards.profile.fields.alias')}</label>
              {profileEditing.isEditingProfile && profileData.role !== 'admin' ? (
                <div className="edit-field">
                  <Textbox
                    type="text"
                    value={profileEditing.aliasValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => profileEditing.setAliasValue(e.target.value)}
                    className="alias-input"
                  />
                </div>
              ) : (
                <span>{profileData.alias || t('profile.cards.profile.fields.noAlias')}</span>
              )}
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>{t('profile.cards.profile.fields.birthDate')}</label>
              <span>{formatDate(profileData.birthDate)}</span>
            </div>
            <div className="info-field">
              <label>{t('profile.cards.profile.fields.memberSince')}</label>
              <span>{formatDate(profileData.joinDate)}</span>
            </div>
          </div>

          {profileEditing.isEditingProfile && (
            <div className="profile-edit-actions">
              <button
                onClick={profileEditing.handleSaveProfile}
                className="btn btn-primary"
                title={t('common.save')}
              >
                ✓ {t('common.save')}
              </button>
              <button
                onClick={profileEditing.handleProfileEditToggle}
                className="btn btn-secondary"
                title={t('common.cancel')}
              >
                ✕ {t('common.cancel')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  const renderSubscriptionCard = () => {
    if (!permissions.canSeeSubscription) return null

    return (
      <section className="card card-md">
        <h2 className="card-title" style={{ paddingBottom: '16px' }}>{t('profile.cards.subscription.title')}</h2>

        <div className="subscription-info">
          <div className={`current-plan ${permissions.isPremium ? 'premium-plan' : ''}`}>
            <h3>{t('profile.cards.subscription.currentPlan')}</h3>
            <p className="plan-name">{t(`profile.badges.${profileData.role}`)}</p>
          </div>

        <div className="subscription-actions">
            <p className="subscription-date">
              {t('profile.cards.subscription.subscribedSince')}: {formatDate(profileData.joinDate)}
            </p>
            <button className={`btn ${permissions.isPremium ? 'btn-secondary' : 'btn-premium'}`} onClick={handleOpenSubscriptionModal}>
              {t('profile.cards.subscription.updateSubscription')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Security sections configuration
  const securitySections = useMemo(() =>
    getSecuritySections(t, {
      onPasswordClick: securityModals.handleOpenPasswordModal,
      on2FAClick: securityModals.handleOpen2FAModal,
      on3FAClick: securityModals.handleOpen3FAModal
    }),
    [t, securityModals]
  )

  const renderSecuritySection = (section: typeof securitySections[0]) => (
    <div key={section.key} className="security-section">
      <h3 className="security-subtitle">{section.title}</h3>
      <div className="change-password-container">
        <p className="change-password-description">{section.description}</p>
        <button className="btn btn-secondary" onClick={section.onClick}>
          {section.buttonText}
        </button>
      </div>
    </div>
  )

  const renderSecurityCard = () => (
    <section className="card card-md">
      <h2 className="card-title">{t('profile.cards.security.title')}</h2>
      {securitySections.map(renderSecuritySection)}
    </section>
  )

  const renderCancellationCard = () => {
    if (!permissions.canSeeCancellation) return null

    return (
      <section className="card card-md card-danger">
        <h2 className="card-title">{t('profile.cards.cancellation.title')}</h2>

        <div className="cancellation-warning">
          <p>{t('profile.cards.cancellation.description')}</p>
          <p className="warning-text">{t('profile.cards.cancellation.warning')}</p>
        </div>

        <div className="cancellation-actions">
          <button className="btn btn-danger" onClick={securityModals.handleOpenDeleteConfirmModal}>
            {t('profile.cards.cancellation.deleteAccount')}
          </button>
        </div>
      </section>
    )
  }

  const renderSecurityModals = () => (
    <>
      <ChangePasswordModal
        isOpen={securityModals.isPasswordModalOpen}
        onClose={securityModals.handleClosePasswordModal}
        onPasswordChange={handlePasswordChange}
      />
      <Enable2FAModal
        isOpen={securityModals.is2FAModalOpen}
        onClose={securityModals.handleClose2FAModal}
        onEnable2FA={handleEnable2FA}
      />
      <Enable3FAModal
        isOpen={securityModals.is3FAModalOpen}
        onClose={securityModals.handleClose3FAModal}
        onEnable3FA={handleEnable3FA}
        userEmail={profileData.email}
      />
    </>
  )

  const renderDeleteConfirmModal = () => (
    <Modal
      isOpen={securityModals.isDeleteConfirmModalOpen}
      onClose={securityModals.handleCloseDeleteConfirmModal}
      title={t('profile.cards.cancellation.confirmDeleteTitle')}
      size="medium"
    >
      <div className="delete-confirmation-content">
        <div className="delete-warning-icon">⚠️</div>
        <h3>{t('profile.cards.cancellation.confirmDeleteMessage')}</h3>
        <p>{t('profile.cards.cancellation.confirmDeleteDescription')}</p>
        <div className="delete-consequences">
          <ul>
            <li>{t('profile.cards.cancellation.consequence1')}</li>
            <li>{t('profile.cards.cancellation.consequence2')}</li>
            <li>{t('profile.cards.cancellation.consequence3')}</li>
            <li>{t('profile.cards.cancellation.consequence4')}</li>
          </ul>
        </div>
        <p className="delete-final-warning">{t('profile.cards.cancellation.finalWarning')}</p>
        <div className="modal-actions delete-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={securityModals.handleCloseDeleteConfirmModal}
          >
            {t('profile.cards.cancellation.keepAccount')}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={securityModals.handleConfirmDelete}
          >
            {t('profile.cards.cancellation.confirmDelete')}
          </button>
        </div>
      </div>
    </Modal>
  )

  const renderDeletePasswordModal = () => (
    <Modal
      isOpen={securityModals.isDeletePasswordModalOpen}
      onClose={securityModals.handleCloseDeletePasswordModal}
      title={t('profile.cards.cancellation.passwordRequiredTitle')}
      size="medium"
    >
      <div className="delete-password-content">
        <p>{t('profile.cards.cancellation.passwordRequiredMessage')}</p>  
                
        <form onSubmit={(e) => { e.preventDefault(); securityModals.handleDeleteAccount(); }}>
          <div className="form-group">
            <Textbox
              type="password"
              label={t('profile.cards.cancellation.enterPassword')}
              required
              value={securityModals.deletePassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => securityModals.setDeletePassword(e.target.value)}
              placeholder={t('profile.cards.cancellation.passwordPlaceholder')}
              disabled={securityModals.isDeleting}
              autoFocus
            />
          </div>
          {securityModals.deleteError && (
            <div className="error-message" role="alert">
              <span className="error-icon">❌</span>
              <span>{securityModals.deleteError}</span>
            </div>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={securityModals.handleCloseDeletePasswordModal}
              disabled={securityModals.isDeleting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={!securityModals.deletePassword.trim() || securityModals.isDeleting}
            >
              {securityModals.isDeleting 
                ? t('profile.cards.cancellation.deleting') 
                : t('profile.cards.cancellation.deleteAccountPermanently')
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )

  const renderSubscriptionModals = () => (
    <>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={handleCloseSubscriptionModal}
        profileData={profileData}
        onChangePlan={() => handleSubscriptionChange(permissions.isPremium ? 'standard' : 'premium')}
      />
      <SubscriptionConfirmationModal
        isOpen={isSubscriptionConfirmationModalOpen}
        onClose={handleCloseSubscriptionConfirmationModal}
        profileData={profileData}
        onConfirm={handleConfirmSubscriptionChange}
        isLoading={isChangingSubscription}
      />
    </>
  )

  return (
    <main className="profile-page">
      <div className="profile-container">
        {renderProfileCard()}
        {renderSubscriptionCard()}
        {renderSecurityCard()}
        {renderCancellationCard()}
        {renderSecurityModals()}
        {renderDeleteConfirmModal()}
        {renderDeletePasswordModal()}
        {renderSubscriptionModals()}
      </div>
    </main>
  )
}
