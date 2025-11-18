import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import '../styles/components/Forms.css';
import ProgressIndicator from '../customcomponents/ProgressIndicator'
import RegistrationStep1 from './RegistrationStep1'
import RegistrationStep2 from './RegistrationStep2'
import '../styles/components/Registration.css'
import { registerUser } from '../services/registerService';
import { useNotifications } from '../customcomponents/NotificationProvider';

interface FormData {
  email: string
  password: string
  repeatPassword: string
  firstName: string
  lastName: string
  alias: string
  birthDate: string
  fotoPerfilUrl: string  // URL de la imagen de perfil
  selectedPlan: 'standard' | 'premium' | ''
}

interface RegistrationProps {
  selectedPlan?: 'standard' | 'premium' | ''
}

export default function Registration({ selectedPlan = '' }: RegistrationProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { success, error } = useNotifications()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    repeatPassword: '',
    firstName: '',
    lastName: '',
    alias: '',
    birthDate: '',
    fotoPerfilUrl: '/src/assets/profile_images/default.svg',  // URL por defecto
    selectedPlan: selectedPlan
  })

  // Actualizar selectedPlan cuando cambie la prop
  useEffect(() => {
    setFormData(prev => ({ ...prev, selectedPlan }))
  }, [selectedPlan])

  const handleUpdateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setCurrentStep(2)
  }

  const handleFinish = async (finalFormData: FormData) => {
    try {
      const result = await registerUser(finalFormData);

      if (result.success) {
        success(t('toast.success.registrationCompleted'));
        navigate('/');
      } else {
        error(t('toast.error.registrationFailed'));
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al registrar usuario. Por favor, inténtalo más tarde.';
      error(errorMessage);
    }
  };

  const stepTitles = [
    t('auth.registration.steps.step1'),
    t('auth.registration.steps.step2')
  ]

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>{t('auth.buttons.register')}</h1>
      </div>
      
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={2}
        stepTitles={stepTitles}
      />
      
      <div className="registration-content">
        {currentStep === 1 ? (
          <RegistrationStep1
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onNext={handleNext}
          />
        ) : (
          <RegistrationStep2
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  )
}
