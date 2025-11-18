import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { log } from '../config/logConfig'
import '../styles/pages/PlanPage.css'

export default function PlanPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | ''>('')
  const [isNavigating, setIsNavigating] = useState(false)

  const handleSelectPlan = (planType: 'standard' | 'premium') => {
    if (isNavigating) return // Prevenir clicks múltiples

    setSelectedPlan(planType)
    setIsNavigating(true)
    
    // Guardar el plan seleccionado en localStorage para que esté disponible en la página de registro
    localStorage.setItem('selectedPlan', planType)

    log('info', `Plan seleccionado: ${planType}`)
    
    // Pequeño delay para que se vea el estado de cargando
    setTimeout(() => {
      navigate('/auth', { state: { from: 'plan', selectedPlan: planType } })
    }, 300)
  }

  return (
    <div className="plan-page">
      <div className="plan-page-container">
        
        {/* Encabezado de la página */}
        <div className="plan-page-header">
          <h1>{t('plans.title')}</h1>
          <p>{t('plans.subtitle')}</p>
        </div>

        {/* Contenedor de planes */}
        <div className="plan-page-content">
          <div className="plans-grid">
            
            {/* Plan Premium - Recomendado */}
            <div
              className={`card card-lg card-interactive card-plan card-premium card-with-badge ${selectedPlan === 'premium' ? 'selected' : ''}`}
            >
              <div className="badge badge-sm badge-recommended plan-badge">{t('plans.badge.recommended')}</div>

              <div className="plan-header">
                <h3>{t('plans.premium.title')}</h3>
                <div className="plan-price premium-price">{t('plans.premium.price')}</div>
              </div>

              <ul className="plan-features">
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.0')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.1')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.2')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.3')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.4')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.premium.features.5')}</li>
              </ul>

              <button
                type="button"
                className={`btn btn-premium ${selectedPlan === 'premium' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation() // Evitar propagación al card padre
                  handleSelectPlan('premium')
                }}
                disabled={isNavigating}
              >
                {isNavigating && selectedPlan === 'premium' ? t('common.loading') || 'Cargando...' : t('plans.buttons.premium')}
              </button>
            </div>

            {/* Plan Estándar */}
            <div
              className={`card card-lg card-interactive card-plan ${selectedPlan === 'standard' ? 'selected' : ''}`}
            >
              <div className="plan-header">
                <h3>{t('plans.standard.title')}</h3>
                <div className="plan-price">{t('plans.standard.price')}</div>
              </div>

              <ul className="plan-features">
                <li><span className="feature-icon">✓</span>{t('plans.standard.features.0')}</li>
                <li><span className="feature-icon">✓</span>{t('plans.standard.features.1')}</li>
                <li><span className="feature-icon">⚠️</span>{t('plans.standard.features.2')}</li>
              </ul>

              <button
                type="button"
                className={`btn btn-secondary ${selectedPlan === 'standard' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation() // Evitar propagación al card padre
                  handleSelectPlan('standard')
                }}
                disabled={isNavigating}
              >
                {isNavigating && selectedPlan === 'standard' ? t('common.loading') || 'Cargando...' : t('plans.buttons.standard')}
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="plan-page-info">
          <div className="info-section">
            <h3>{t('plans.info.whyChoose.title')}</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">🎥</div>
                <h4>{t('plans.info.whyChoose.benefits.original.title')}</h4>
                <p>{t('plans.info.whyChoose.benefits.original.description')}</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📱</div>
                <h4>{t('plans.info.whyChoose.benefits.multiplatform.title')}</h4>
                <p>{t('plans.info.whyChoose.benefits.multiplatform.description')}</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🚫</div>
                <h4>{t('plans.info.whyChoose.benefits.noCommitments.title')}</h4>
                <p>{t('plans.info.whyChoose.benefits.noCommitments.description')}</p>
              </div>
            </div>
          </div>            <div className="plan-faq">
              <h3>{t('plans.info.faq.title')}</h3>
              <div className="faq-item">
                <h4>{t('plans.info.faq.questions.changePlan.question')}</h4>
                <p>{t('plans.info.faq.questions.changePlan.answer')}</p>
              </div>
              <div className="faq-item">
                <h4>{t('plans.info.faq.questions.freeTrial.question')}</h4>
                <p>{t('plans.info.faq.questions.freeTrial.answer')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}