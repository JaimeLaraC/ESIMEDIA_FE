import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useFormValidation } from '../hooks/useFormValidation'
import '../styles/pages/CreatorFormPage.css'
import '../styles/components/CreatorBranding.css'
import '../styles/components/CreatorForm.css'
import '../styles/components/PhotoUpload.css'
import '../styles/components/Combobox.css'
import FormSelect from '../customcomponents/FormSelect'
import Textbox from '../customcomponents/Textbox'
import logotipo from '../assets/logotipo.png'
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateAlias,
  validateChannelDescription,
  validateContentType,
  validateSpecialty,
  validatePhoto,
} from '../utils/fieldValidator'
import { registerCreator } from '../services/creatorService'
import AvatarSelector from '../components/AvatarSelector'


interface CreatorFormData {
  email: string
  firstName: string
  lastName: string
  alias: string
  channelDescription: string
  contentType: 'Audio' | 'Video' | ''
  specialty: string
  profileImage: string
}

export default function CreatorFormPage() {
  const { t, translations } = useI18n()
  const navigate = useNavigate()

  // Use shared form validation hook
  const { errors, setErrors, validateField } = useFormValidation<CreatorFormData>({
    email: validateEmail,
    firstName: validateFirstName,
    lastName: validateLastName,
    alias: validateAlias,
    channelDescription: validateChannelDescription,
    contentType: validateContentType,
    specialty: validateSpecialty,
    profileImage: validatePhoto
  }, t)

  // Generar dinámicamente las especialidades desde las traducciones
  const specialtyKeys = Object.keys(translations.creator.channel.specialties)
  // Generar dinámicamente los tipos de contenido desde las traducciones
  const contentTypeKeys = Object.keys(translations.creator.channel.contentTypes)

  const contentTypeOptions = [
    { value: '', label: t('creator.form.fields.contentType') },
    ...contentTypeKeys.map(contentType => ({
      value: contentType,
      label: t(`creator.channel.contentTypes.${contentType}`)
    }))
  ]

  const specialtyOptions = [
    { value: '', label: t('creator.form.fields.specialty') },
    ...specialtyKeys.map(specialty => ({
      value: specialty,
      label: t(`creator.channel.specialties.${specialty}`)
    }))
  ]

  const [formData, setFormData] = useState<CreatorFormData>({
    email: '',
    firstName: '',
    lastName: '',
    alias: '',
    channelDescription: '',
    contentType: '',
    specialty: '',
    profileImage: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  // VALIDACIÓN INDIVIDUAL - REMOVIDA, solo se valida en submit
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const field = name as keyof CreatorFormData
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    const field = name as keyof CreatorFormData
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpiar errores cuando el usuario cambie la selección
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // VALIDACIÓN GLOBAL AL SUBMIT
  const validateForm = (): boolean => {
    // Validate all fields using shared hook
    const newErrors: Record<string, string> = {}
    const fields: (keyof CreatorFormData)[] = [
      'email', 'firstName', 'lastName', 'alias',
      'channelDescription', 'contentType', 'specialty', 'profileImage'
    ]

    fields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setSubmitError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await registerCreator(formData);
      navigate('/', { state: { message: t('creator.form.success') } });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('creator.form.errors.submitError');
      
      // Check if the error is related to email registration
      if (message.includes('email') || message.includes('registrado') || message.includes('already')) {
        setErrors({ email: message });
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderError = (fieldName: string) => {
    const field = fieldName as keyof CreatorFormData
    return errors[field] ? <span className="error-message">{errors[field]}</span> : null
  }

  // Helper para clases visuales si quieres pintar borde rojo, verde, etc.
  const getFieldStatus = (name: keyof CreatorFormData): string => {
    if (isSubmitted && errors[name]) return 'error'
    if (formData[name] && !errors[name]) return 'valid'
    return ''
  }

  return (
    <div className="creator-form-page">
      <div className="creator-form-container">
        
        {/* Panel Izquierdo - Formulario */}
        <div className="creator-form-panel">
          {/* Botón de regreso - flotando */}
          <button 
            className="back-to-home"
            onClick={() => navigate('/')}
            aria-label={t('creator.form.backToHome')}
          >
            ← {t('creator.form.backToHome')}
          </button>

          {/* Header del formulario */}
          <div className="creator-form-header">
            <h1 className="creator-form-title">{t('creator.form.title')}</h1>
            <p className="creator-form-subtitle">{t('creator.form.subtitle')}</p>
          </div>

          {/* Main Form */}
          <div className="creator-form-content">
            <form className="creator-form" onSubmit={handleSubmit}>
              
              {/* Personal Information */}
              <div className="form-section">
                <h2 className="section-title">{t('creator.form.sections.personalInfo')}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <Textbox
                      type="email"
                      id="email"
                      name="email"
                      label={`${t('creator.form.fields.email')} *`}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('creator.form.placeholders.email')}
                      required
                    />
                    {renderError('email')}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Textbox
                      type="text"
                      id="firstName"
                      name="firstName"
                      label={`${t('creator.form.fields.firstName')} *`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={t('creator.form.placeholders.firstName')}
                      error={errors.firstName}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Textbox
                      type="text"
                      id="lastName"
                      name="lastName"
                      label={`${t('creator.form.fields.lastName')} *`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={t('creator.form.placeholders.lastName')}
                      error={errors.lastName}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Channel Information */}
              <div className="form-section">
                <h2 className="section-title">{t('creator.form.sections.channelInfo')}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <Textbox
                      type="text"
                      id="alias"
                      name="alias"
                      label={`${t('creator.form.fields.alias')} *`}
                      value={formData.alias}
                      onChange={handleInputChange}
                      placeholder={t('creator.form.placeholders.alias')}
                      error={errors.alias}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="channelDescription" className="form-label">
                      {t('creator.form.fields.channelDescription')}
                    </label>
                    <Textbox
                      as="textarea"
                      id="channelDescription"
                      name="channelDescription"
                      value={formData.channelDescription}
                      onChange={handleInputChange}
                      placeholder={t('creator.form.placeholders.channelDescription')}
                      className={`form-textarea ${getFieldStatus('channelDescription')}`}
                      error={errors.channelDescription}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contentType" className="form-label">
                      {t('creator.form.fields.contentType')} *
                    </label>
                    <FormSelect
                      id="contentType"
                      value={formData.contentType}
                      options={contentTypeOptions}
                      onChange={(value) => handleSelectChange('contentType', value)}
                      className={getFieldStatus('contentType')}
                    />
                    {renderError('contentType')}
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty" className="form-label">
                      {t('creator.form.fields.specialty')} *
                    </label>
                    <FormSelect
                      id="specialty"
                      value={formData.specialty}
                      options={specialtyOptions}
                      onChange={(value) => handleSelectChange('specialty', value)}
                      className={getFieldStatus('specialty')}
                    />
                    {renderError('specialty')}
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="form-section">
                <h2 className="section-title">{t('creator.form.sections.photo')}</h2>
                <div className="form-group">
                  <AvatarSelector
                    selectedAvatarUrl={formData.profileImage}
                    onAvatarSelect={(avatar) => setFormData(prev => ({ ...prev, profileImage: avatar }))}
                  />
                  {errors.profileImage && <span className="error-message">{errors.profileImage}</span>}
                </div>
              </div>


              {/* Submit Section */}
              <div className="form-submit-section">
                {submitError && <span className="error-message">{submitError}</span>}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('creator.form.submitting') : t('creator.form.submitButton')}
                </button>
                <p className="form-disclaimer">
                  {t('creator.form.disclaimer')}
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Panel Derecho - Branding */}
        <div className="creator-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <img src={logotipo} alt="ESIMedia" className="brand-logo-img" />
              <span className="brand-tagline">{t('creator.branding.tagline')}</span>
            </div>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">🎬</span>
                <div className="feature-text">
                  <h3>{t('creator.branding.features.platform.title')}</h3>
                  <p>{t('creator.branding.features.platform.desc')}</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">💰</span>
                <div className="feature-text">
                  <h3>{t('creator.branding.features.monetization.title')}</h3>
                  <p>{t('creator.branding.features.monetization.desc')}</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">📈</span>
                <div className="feature-text">
                  <h3>{t('creator.branding.features.growth.title')}</h3>
                  <p>{t('creator.branding.features.growth.desc')}</p>
                </div>
              </div>
            </div>
            <div className="brand-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">{t('creator.branding.stats.creators')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">{t('creator.branding.stats.audience')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">€50K+</span>
                <span className="stat-label">{t('creator.branding.stats.earnings')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}