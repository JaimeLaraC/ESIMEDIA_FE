import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import Textbox from '../customcomponents/Textbox'
import Modal from '../customcomponents/Modal'
import { useNotifications } from '../customcomponents/NotificationProvider'
import '../styles/components/Enable3FAModal.css'

interface Enable3FAModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onEnable3FA: (verificationCode: string) => Promise<void>
  readonly userEmail?: string
}

export default function Enable3FAModal({ isOpen, onClose, onEnable3FA, userEmail }: Enable3FAModalProps) {
  const { t } = useI18n()
  const { success } = useNotifications()
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [error, setError] = useState<string>('')
  const [countdown, setCountdown] = useState(0)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('setup')
      setVerificationCode('')
      setError('')
      setCountdown(0)
    }
  }, [isOpen])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!userEmail) {
      setError(t('profile.cards.security.threeFactor.errors.emailRequired'))
      return
    }

    setIsSendingCode(true)
    setError('')

    try {
      // TODO: Implement actual send verification code API call
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setStep('verify')
      setCountdown(60) // 60 seconds countdown before allowing resend
      success(t('profile.cards.security.threeFactor.setup.codeSent'))
    } catch (error) {
      console.error('Error sending verification code:', error)
      setError(t('profile.cards.security.threeFactor.errors.sendFailed'))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError(t('profile.cards.security.threeFactor.errors.codeRequired'))
      return
    }

    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setError(t('profile.cards.security.threeFactor.errors.invalidCode'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onEnable3FA(verificationCode)
      success(t('profile.cards.security.threeFactor.success.enabled'))
      handleClose()
    } catch (error) {
      console.error('Error enabling 3FA:', error)
      setError(t('profile.cards.security.threeFactor.errors.verificationFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return

    await handleSendCode()
  }

  const handleClose = () => {
    setStep('setup')
    setVerificationCode('')
    setError('')
    setCountdown(0)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('profile.cards.security.threeFactor.setup.title')}
      size="medium"
    >
      {step === 'setup' ? (
        <div className="enable-3fa-setup">
          <div className="setup-instructions">
            <h3>{t('profile.cards.security.threeFactor.setup.title')}</h3>
            <p>{t('profile.cards.security.threeFactor.setup.emailDescription')}</p>
          </div>

          <div className="email-display">
            <label>{t('profile.cards.security.threeFactor.setup.emailLabel')}</label>
            <div className="email-value">
              {userEmail || t('common.notSpecified')}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSendCode}
              className="btn btn-primary"
              disabled={isSendingCode || !userEmail}
            >
              {isSendingCode
                ? t('profile.cards.security.threeFactor.setup.sending')
                : t('profile.cards.security.threeFactor.setup.sendCode')
              }
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifyCode} className="enable-3fa-verify">
          <div className="verify-instructions">
            <h3>{t('profile.cards.security.threeFactor.verify.title')}</h3>
            <p>{t('profile.cards.security.threeFactor.verify.description')}</p>
          </div>

          <div className="form-group">
            <Textbox
              type="text"
              label={t('profile.cards.security.threeFactor.verify.codeLabel')}
              value={verificationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replaceAll(/\D/g, '').slice(0, 6)
                setVerificationCode(value)
                if (error) setError('')
              }}
              placeholder="000000"
              maxLength={6}
              autoFocus
              error={error}
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="resend-section">
            <button
              type="button"
              onClick={handleResendCode}
              className="btn-link"
              disabled={countdown > 0 || isSendingCode}
            >
              {(() => {
                if (isSendingCode) {
                  return t('profile.cards.security.threeFactor.verify.resending')
                } else if (countdown > 0) {
                  return `${t('profile.cards.security.threeFactor.verify.resend')} (${countdown}s)`
                } else {
                  return t('profile.cards.security.threeFactor.verify.resend')
                }
              })()}
            </button>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading
                ? t('profile.cards.security.threeFactor.verify.verifying')
                : t('profile.cards.security.threeFactor.verify.confirm')
              }
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}