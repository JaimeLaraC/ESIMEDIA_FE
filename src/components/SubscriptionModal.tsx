import Modal from '../customcomponents/Modal'
import { useI18n } from '../hooks/useI18n'
import type { UserProfile } from '../utils/profileUtils'
import '../styles/components/SubscriptionModal.css'

interface SubscriptionModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly profileData: UserProfile
  readonly onChangePlan: () => void
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  profileData,
  onChangePlan
}: SubscriptionModalProps) {
  const { t } = useI18n()
  const isPremium = profileData.role === 'premium'
  const currentPlan = isPremium ? 'premium' : 'standard'
  const targetPlan = isPremium ? 'standard' : 'premium'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('profile.cards.subscription.modal.title')}
      size="large"
    >
      <div className="subscription-modal-content">
        <div className="current-plan-info">
          <h3>{t('profile.cards.subscription.modal.currentPlan')}</h3>
          <p className={`plan-badge ${currentPlan} ${currentPlan === 'premium' ? 'premium-badge' : ''}`}>
            {t(`profile.badges.${currentPlan}`)}
          </p>
        </div>

        <div className="change-plan-section">
          <p>{t('profile.cards.subscription.modal.changeDescription')}</p>
          
          {/* Preview de la card del plan target */}
          <div className={`card card-lg card-plan ${targetPlan === 'premium' ? 'card-premium card-with-badge' : ''}`}>
            {targetPlan === 'premium' && (
              <div className="badge badge-sm badge-recommended plan-badge">
                {t('plans.badge.recommended')}
              </div>
            )}

            <div className="plan-header">
              <h3>{t(`plans.${targetPlan}.title`)}</h3>
              <div className={`plan-price ${targetPlan === 'premium' ? 'premium-price' : ''}`}>
                {t(`plans.${targetPlan}.price`)}
              </div>
            </div>

            <ul className="plan-features">
              {targetPlan === 'premium' ? (
                <>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.0')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.1')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.2')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.3')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.4')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.premium.features.5')}</li>
                </>
              ) : (
                <>
                  <li><span className="feature-icon">✓</span>{t('plans.standard.features.0')}</li>
                  <li><span className="feature-icon">✓</span>{t('plans.standard.features.1')}</li>
                  <li><span className="feature-icon">⚠️</span>{t('plans.standard.features.2')}</li>
                </>
              )}
            </ul>
          </div>

          <button
            className={`btn ${isPremium ? 'btn-secondary' : 'btn-premium btn-large'}`}
            onClick={onChangePlan}
          >
            {t('profile.cards.subscription.modal.changeTo')} {t(`profile.badges.${targetPlan}`)}
          </button>
        </div>
      </div>
    </Modal>
  )
}