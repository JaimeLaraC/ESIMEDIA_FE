import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { PasswordStrengthIndicator } from '../customcomponents/PasswordStrengthIndicator'
import Textbox from '../customcomponents/Textbox'
import Modal from '../customcomponents/Modal'
import zxcvbn from 'zxcvbn'
import { checkPasswordHIBP } from '../services/hibpservice'
import { log } from '../config/logConfig'
import {
  validateCurrentPassword,
  validateNewPassword,
  validateConfirmPassword
} from '../utils/fieldValidator'

interface ChangePasswordModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>
}

export default function ChangePasswordModal({ isOpen, onClose, onPasswordChange }: ChangePasswordModalProps) {
  const { t } = useI18n()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; feedback: { suggestions: string[]; warning: string } } | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string | undefined }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value)

    if (!value) {
      setPasswordStrength(null)
      setValidationErrors(prev => ({ ...prev, newPassword: undefined }))
      return
    }

    const result = zxcvbn(value)
    setPasswordStrength({ score: result.score, feedback: result.feedback })

    if (result.score >= 4) {
      checkPasswordHIBP(value)
        .then(hibpResult => {
          log('info', 'HIBP check result:', { isCompromised: hibpResult.isCompromised, count: hibpResult.count })
          const passwordError = hibpResult.isCompromised ? t('auth.registration.errors.passwordCompromised') : undefined
          setValidationErrors(prev => ({ ...prev, newPassword: passwordError }))
        })
        .catch(error => log('error', 'Error checking HIBP:', error))
    } else {
      setValidationErrors(prev => ({ ...prev, newPassword: undefined }))
    }
  }

  const handleNewPasswordFocus = () => {
    setShowHints(true)
  }

  const handleNewPasswordBlur = () => {
    if (!newPassword) {
      setShowHints(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: { [key: string]: string } = {}

    const currentPasswordError = validateCurrentPassword(currentPassword)
    if (currentPasswordError) {
      errors.currentPassword = t(currentPasswordError)
    }

    const newPasswordError = validateNewPassword(newPassword)
    if (newPasswordError) {
      errors.newPassword = t(newPasswordError)
    } else if (passwordStrength && passwordStrength.score < 3) {
      errors.newPassword = t('auth.registration.errors.passwordTooWeak')
    }

    const confirmPasswordError = validateConfirmPassword(confirmPassword, newPassword)
    if (confirmPasswordError) {
      errors.confirmPassword = t(confirmPasswordError)
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      await onPasswordChange(currentPassword, newPassword)
      // Reset form on success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStrength(null)
      setShowHints(false)
      setValidationErrors({})
      onClose()
    } catch (error) {
      log('error', 'Error changing password:', error)
      // Display the backend error message if available
      const errorMessage = error instanceof Error ? error.message : t('auth.password.error')
      setValidationErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordStrength(null)
    setShowHints(false)
    setValidationErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('auth.password.changeButton')}>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <Textbox
            id="currentPassword"
            type="password"
            label={t('profile.cards.security.currentPassword')}
            value={currentPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
            placeholder={t('auth.forms.placeholders.password')}
            error={validationErrors.currentPassword}
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <Textbox
            id="newPassword"
            type="password"
            label={t('profile.cards.security.newPassword')}
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPasswordChange(e.target.value)}
            onFocus={handleNewPasswordFocus}
            onBlur={handleNewPasswordBlur}
            placeholder={t('auth.forms.placeholders.password')}
            error={validationErrors.newPassword}
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator
            strength={passwordStrength}
            password={newPassword}
            showHints={showHints}
            t={t}
          />
        </div>

        <div className="form-group">
          <Textbox
            id="confirmPassword"
            type="password"
            label={t('profile.cards.security.confirmPassword')}
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.forms.placeholders.repeatPassword')}
            error={validationErrors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        {validationErrors.general && (
          <div className="error-message">{validationErrors.general}</div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={handleClose} className="btn-secondary">
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.password.changeButton')}
          </button>
        </div>
      </form>
    </Modal>
  )
}