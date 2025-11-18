import Modal from '../customcomponents/Modal'
import { useI18n } from '../hooks/useI18n'
import type { UserProfile } from '../utils/profileUtils'
import '../styles/components/SubscriptionConfirmationModal.css'

interface SubscriptionConfirmationModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly profileData: UserProfile
  readonly onConfirm: () => void
  readonly isLoading: boolean
}

export default function SubscriptionConfirmationModal({
  isOpen,
  onClose,
  profileData,
  onConfirm,
  isLoading
}: SubscriptionConfirmationModalProps) {
  const { t } = useI18n()
  const isPremium = profileData.role === 'premium'
  const currentPlan = isPremium ? 'premium' : 'standard'
  const targetPlan = isPremium ? 'standard' : 'premium'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('profile.cards.subscription.confirmation.title')}
      size="medium"
    >
      <div className="subscription-confirmation-content">
        <div className="confirmation-summary">
          <h3>{t('profile.cards.subscription.confirmation.summary')}</h3>
          <div className="plan-change-summary">
            <div className="plan-change-item">
              <span className="change-label">{t('profile.cards.subscription.confirmation.from')}</span>
              <span className={`plan-badge ${currentPlan} ${currentPlan === 'premium' ? 'premium-badge' : ''}`}>
                {t(`profile.badges.${currentPlan}`)}
              </span>
            </div>
            <div className="change-arrow">→</div>
            <div className="plan-change-item">
              <span className="change-label">{t('profile.cards.subscription.confirmation.to')}</span>
              <span className={`plan-badge ${targetPlan} ${targetPlan === 'premium' ? 'premium-badge' : ''}`}>
                {t(`profile.badges.${targetPlan}`)}
              </span>
            </div>
          </div>
        </div>

        <div className="confirmation-warning">
          <p>{t('profile.cards.subscription.confirmation.warning')}</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : t('profile.cards.subscription.confirmation.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  )
}