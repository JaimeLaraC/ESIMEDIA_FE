import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import Textbox from '../customcomponents/Textbox'
import Modal from '../customcomponents/Modal'
import { useNotifications } from '../customcomponents/NotificationProvider'
import '../styles/components/Enable2FAModal.css'

interface Enable2FAModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onEnable2FA: (verificationCode: string) => Promise<void>
}

export default function Enable2FAModal({ isOpen, onClose, onEnable2FA }: Enable2FAModalProps) {
  const { t } = useI18n()
  const { success } = useNotifications()
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Generar secreto y QR cuando se abre el modal
  useEffect(() => {
    if (isOpen && step === 'setup') {
      generate2FASecret()
    }
  }, [isOpen, step])

  const generate2FASecret = () => {
    // Generar un secreto aleatorio de 32 caracteres (base32)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let generatedSecret = ''
    for (let i = 0; i < 32; i++) {
      generatedSecret += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setSecret(generatedSecret)

    // Generar URL para Google Authenticator
    // otpauth://totp/Issuer:Account?secret=SECRET&issuer=Issuer
    const issuer = 'ESIMedia'
    const account = 'user@esimedia.com' // TODO: Usar email del usuario actual
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${generatedSecret}&issuer=${encodeURIComponent(issuer)}`

    // Generar QR code usando una API externa (puedes cambiar esto por una librería)
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`
    setQrCodeUrl(qrCodeApiUrl)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError(t('profile.cards.security.twoFactor.errors.codeRequired'))
      return
    }

    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setError(t('profile.cards.security.twoFactor.errors.invalidCode'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onEnable2FA(verificationCode)
      success(t('profile.cards.security.twoFactor.success.enabled'))
      handleClose()
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      setError(t('profile.cards.security.twoFactor.errors.verificationFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('setup')
    setQrCodeUrl('')
    setSecret('')
    setVerificationCode('')
    setError('')
    onClose()
  }

  const handleBackToSetup = () => {
    setStep('setup')
    setVerificationCode('')
    setError('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('profile.cards.security.twoFactor.setup.title')}
      size="large"
    >
      {step === 'setup' ? (
        <div className="enable-2fa-setup">
          <div className="setup-instructions">
            <h3>{t('profile.cards.security.twoFactor.setup.instructions.title')}</h3>
            <ol>
              <li>{t('profile.cards.security.twoFactor.setup.instructions.step1')}</li>
              <li>{t('profile.cards.security.twoFactor.setup.instructions.step2')}</li>
              <li>{t('profile.cards.security.twoFactor.setup.instructions.step3')}</li>
            </ol>
          </div>

          <div className="qr-code-section">
            <h4>{t('profile.cards.security.twoFactor.setup.qrCode.title')}</h4>
            {qrCodeUrl && (
              <div className="qr-code-container">
                <img
                  src={qrCodeUrl}
                  alt={t('profile.cards.security.twoFactor.setup.qrCode.alt')}
                  className="qr-code-image"
                />
              </div>
            )}

            <div className="manual-setup">
              <p>{t('profile.cards.security.twoFactor.setup.manual.title')}</p>
              <div className="secret-code">
                <code>{secret}</code>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => navigator.clipboard.writeText(secret)}
                  title={t('profile.cards.security.twoFactor.setup.manual.copy')}
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={() => setStep('verify')}
              className="btn btn-primary"
            >
              {t('profile.cards.security.twoFactor.setup.continue')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifyCode} className="enable-2fa-verify">
          <div className="verify-instructions">
            <h3>{t('profile.cards.security.twoFactor.verify.title')}</h3>
            <p>{t('profile.cards.security.twoFactor.verify.description')}</p>
          </div>

          <div className="form-group">
            <Textbox
              type="text"
              label={t('profile.cards.security.twoFactor.verify.codeLabel')}
              value={verificationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
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

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleBackToSetup}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {t('profile.cards.security.twoFactor.verify.back')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading
                ? t('profile.cards.security.twoFactor.verify.verifying')
                : t('profile.cards.security.twoFactor.verify.confirm')
              }
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}