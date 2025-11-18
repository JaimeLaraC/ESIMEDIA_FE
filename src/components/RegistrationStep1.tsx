import { useI18n } from '../hooks/useI18n'
import { useFormValidation } from '../hooks/useFormValidation'
import { usePasswordValidation } from '../hooks/usePasswordValidation'
import AvatarSelector from './AvatarSelector'
import { PasswordStrengthIndicator } from '../customcomponents/PasswordStrengthIndicator'
import Textbox from '../customcomponents/Textbox'
import '../styles/components/RegistrationStep1.css'
import '../styles/components/Forms.css'
import '../styles/components/Hint.css'
import { useState } from 'react'
import { checkEmailAvailability } from '../services/registerService'

import {
  validateEmail,
  validatePassword,
  validateRepeatPassword,
  validateFirstName,
  validateLastName,
  validateAlias,
  validateBirthDate,
} from '../utils/fieldValidator'

interface FormData {
  email: string
  password: string
  repeatPassword: string
  firstName: string
  lastName: string
  alias: string
  birthDate: string
  fotoPerfilUrl: string  // URL de la imagen de perfil
}

interface RegistrationStep1Props {
  readonly formData: FormData
  readonly onUpdateFormData: (data: Partial<FormData>) => void
  readonly onNext: () => void
}

export default function RegistrationStep1({ formData, onUpdateFormData, onNext }: RegistrationStep1Props) {
  const { t } = useI18n()

  // Use shared form validation hook
  const { validateField } = useFormValidation<FormData>({
    email: validateEmail,
    password: validatePassword,
    firstName: validateFirstName,
    lastName: validateLastName,
    alias: validateAlias,
    birthDate: validateBirthDate
  }, t)

  // Use password validation hook
  const {
    passwordStrength,
    showPasswordHints,
    hibpError,
    repeatPasswordError,
    handlePasswordFocus,
    handlePasswordBlur,
    handlePasswordChange,
    handleRepeatPasswordChange
  } = usePasswordValidation(t)

  // Extend errors to include "general" field
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData | "general", string>>>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    onUpdateFormData({ [field]: value })

    // Validate using shared hook or special case for password/repeatPassword
    let error: string | undefined
    if (field === 'repeatPassword') {
      handleRepeatPasswordChange(value, formData.password)
      return
    } else if (field === 'password') {
      // Valida contraseña con zxcvbn y HIBP
      void handlePasswordChange(value, formData.repeatPassword)
      error = validateField(field, value)
    } else {
      error = validateField(field, value)
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields using shared hook
    const errors: Partial<Record<keyof FormData, string>> = {}
    const fields: (keyof FormData)[] = ['email', 'password', 'firstName', 'lastName', 'alias', 'birthDate']

    fields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) errors[field] = error
    })

    // Validate repeatPassword separately
    const repeatPasswordError = validateRepeatPassword(formData.repeatPassword, formData.password)
    if (repeatPasswordError) {
      errors.repeatPassword = t(repeatPasswordError)
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) return

    // Check email availability
    try {
      const { success, exists, message } = await checkEmailAvailability(formData.email)

      if (!success) {
        setValidationErrors(prev => ({ ...prev, general: message || 'No se pudo validar el correo en el servidor.' }))
        return
      }

      if (exists) {
        setValidationErrors(prev => ({ ...prev, email: 'Este correo ya está registrado.' }))
        return
      }

      onNext()
    } catch {
      setValidationErrors(prev => ({ ...prev, general: t('auth.registration.errors.emailValidation') }))
    }
  }

  return (
    <div className="registration-step1">
      <form onSubmit={handleSubmit} className="step1-form">
        <div className="form-row">
          <div className="form-group">
            <Textbox
              id="firstName"
              type="text"
              label={`${t('auth.forms.firstName')} *`}
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
              placeholder={t('auth.forms.placeholders.firstName')}
              error={validationErrors.firstName}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <Textbox
              id="lastName"
              type="text"
              label={`${t('auth.forms.lastName')} *`}
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
              placeholder={t('auth.forms.placeholders.lastName')}
              error={validationErrors.lastName}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-group">
            <Textbox
              id="email"
              type="email"
              label={`${t('auth.forms.email')} *`}
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              placeholder={t('auth.forms.placeholders.email')}
              error={validationErrors.email}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Textbox
              id="password"
              type="password"
              label={`${t('auth.forms.password')} *`}
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              placeholder={t('auth.forms.placeholders.password')}
              error={validationErrors.password || hibpError}
              autoComplete="new-password"
            />
            <PasswordStrengthIndicator
              strength={passwordStrength}
              password={formData.password}
              showHints={showPasswordHints}
              personalData={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                alias: formData.alias,
                birthDate: formData.birthDate
              }}
              t={t}
            />
          </div>

          <div className="form-group">
            <Textbox
              id="repeatPassword"
              type="password"
              label={`${t('auth.forms.repeatPassword')} *`}
              value={formData.repeatPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('repeatPassword', e.target.value)}
              placeholder={t('auth.forms.placeholders.repeatPassword')}
              error={repeatPasswordError}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Textbox
              id="alias"
              type="text"
              label={t('auth.forms.alias')}
              value={formData.alias}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('alias', e.target.value)}
              placeholder={t('auth.forms.placeholders.alias')}
              error={validationErrors.alias}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <Textbox
              id="birthDate"
              type="date"
              label={`${t('auth.forms.birthDate')} *`}
              value={formData.birthDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('birthDate', e.target.value)}
              error={validationErrors.birthDate}
              autoComplete="off"
              min={new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t('auth.forms.profileImage')}</label>
          <AvatarSelector
            selectedAvatarUrl={formData.fotoPerfilUrl}
            onAvatarSelect={(url) => onUpdateFormData({ fotoPerfilUrl: url })}
          />
          {validationErrors.fotoPerfilUrl && <div className="hint hint-error">{validationErrors.fotoPerfilUrl}</div>}
        </div>

        {validationErrors.general && <div className="general-error">{validationErrors.general}</div>}

        <button type="submit" className="btn-primary btn-next">
          {t('auth.registration.navigation.next')}
        </button>
      </form>
    </div>
  )
}