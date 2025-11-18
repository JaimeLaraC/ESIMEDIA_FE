import { useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import '../styles/components/RegistrationStep2.css'
import '../styles/components/Cards.css'
import '../styles/components/Badges.css'

interface FormData {
  email: string
  password: string
  repeatPassword: string
  firstName: string
  lastName: string
  alias: string
  birthDate: string
  profileImage: string
  selectedPlan: 'standard' | 'premium' | ''
}

interface RegistrationStep2Props {
  readonly formData: FormData
  readonly onUpdateFormData: (data: Partial<FormData>) => void
  readonly onFinish: (finalFormData: FormData) => void; 
}

export default function RegistrationStep2({ formData, onUpdateFormData, onFinish }: RegistrationStep2Props) {
  const { t } = useI18n()

  // Cargar plan preseleccionado desde localStorage cuando el componente se monta
  useEffect(() => {
    const preselectedPlan = localStorage.getItem('selectedPlan') as 'standard' | 'premium' | null
    if (preselectedPlan && !formData.selectedPlan) {
      onUpdateFormData({ selectedPlan: preselectedPlan })
      // Limpiar localStorage después de usar el valor
      localStorage.removeItem('selectedPlan')
    }
  }, [formData.selectedPlan, onUpdateFormData])

  const selectPlan = (plan: 'standard' | 'premium') => {
    // Creamos el objeto final directamente con el booleano correcto
    const finalFormData = {
      ...formData,
      selectedPlan: plan,
      esVip: plan === 'premium', 
    };

    // Actualizamos el estado en el padre
    onUpdateFormData(finalFormData);

    // Enviamos al backend el objeto correcto
    onFinish(finalFormData);
  };

  return (
    <div className="registration-step2">
      <div className="step2-header">
        <h2>{t('auth.registration.steps.step2')}</h2>
        <p>{t('plans.subtitle')}</p>
      </div>

      <div className="step2-form">
        
        <div className="plans-container">
          
          {/* Plan Premium - PRIORIZADO (izquierda/arriba) */}
          <div
            className={`card card-lg card-interactive card-plan card-premium card-with-badge ${formData.selectedPlan === 'premium' ? 'selected' : ''}`}
          >
            <div className="badge badge-sm badge-recommended">{t('plans.badge.recommended')}</div>

            <div className="plan-header">
              <div className="plan-account-type"> {t('plans.premium.title')}</div>
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
              className={`btn btn-premium ${formData.selectedPlan === 'premium' ? 'selected' : ''}`}
              onClick={() => selectPlan('premium')}
            >
              {t('auth.registration.navigation.finish')} Premium
            </button>
          </div>

          {/* Plan Estándar - SECUNDARIO (derecha/abajo) */}
          <div
            className={`card card-lg card-interactive card-plan ${formData.selectedPlan === 'standard' ? 'selected' : ''}`}
          >
            <div className="plan-header">
              <div className="plan-account-type"> {t('plans.standard.title')}</div>
              <div className="plan-price">{t('plans.standard.price')}</div>
            </div>

            <ul className="plan-features">
              <li><span className="feature-icon">✓</span>{t('plans.standard.features.0')}</li>
              <li><span className="feature-icon">✓</span>{t('plans.standard.features.1')}</li>
              <li><span className="feature-icon">⚠️</span>{t('plans.standard.features.2')}</li>
            </ul>

            <button
              type="button"
              className={`btn btn-secondary ${formData.selectedPlan === 'standard' ? 'selected' : ''}`}
              onClick={() => selectPlan('standard')}
            >
              {t('auth.registration.navigation.finish')} Estándar
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
