import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { log } from '../config/logConfig'
import LanguageSelector from '../customcomponents/LanguageSelector'
import '../styles/pages/VerifyPage.css'
import { confirmAccount } from '../services/registerService'

type VerificationState = 'loading' | 'success' | 'error'

interface StateContent {
  titleKey: string
  messageKey: string
  titleFallback: string
  messageFallback: string
  icon: React.ReactNode
}

const VERIFICATION_CONTENT: Record<VerificationState, StateContent> = {
  loading: {
    titleKey: 'auth.verify.loading.title',
    messageKey: 'auth.verify.loading.message',
    titleFallback: 'Verificando cuenta...',
    messageFallback: 'Estamos verificando tu cuenta. Por favor, espera un momento.',
    icon: (
      <div className="verify-loading">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    )
  },
  success: {
    titleKey: 'auth.verify.success.title',
    messageKey: 'auth.verify.success.message',
    titleFallback: '¡Cuenta verificada!',
    messageFallback: 'Tu cuenta ha sido verificada correctamente. Ya puedes disfrutar de todos los servicios de ESIMedia.',
    icon: (
      <div className="verify-checkmark">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    )
  },
  error: {
    titleKey: 'auth.verify.error.title',
    messageKey: 'auth.verify.error.message',
    titleFallback: 'Error de verificación',
    messageFallback: 'Ha ocurrido un error al verificar tu cuenta. El enlace puede haber expirado o ser inválido.',
    icon: (
      <div className="verify-cross">
        <svg className="cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="cross-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="cross-line cross-line-1" fill="none" d="m16 16 20 20" />
          <path className="cross-line cross-line-2" fill="none" d="m36 16-20 20" />
        </svg>
      </div>
    )
  }
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const [verificationState, setVerificationState] = useState<VerificationState>('loading')

useEffect(() => {
  const controller = new AbortController();
  const token = searchParams.get('token');

  if (!token) {
    setVerificationState('error');
    return;
  }

  const verifyAccount = async () => {
    try {
      const result = await confirmAccount(token);

      if (!controller.signal.aborted) {
        if (result.success) {
          setVerificationState('success');
        } else {
          log('error', 'Error de verificación:', result.message);
          setVerificationState('error');
        }
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        log('error', 'Error en verifyAccount:', err);
        setVerificationState('error');
      }
    }
  };

  verifyAccount();

  return () => controller.abort();
}, [searchParams]);


  const content = VERIFICATION_CONTENT[verificationState]
  const showActions = verificationState !== 'loading'

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-content">
          <div className="verify-icon">
            {content.icon}
          </div>

          <div className="verify-message-section">
            <h1 className="verify-title">
              {t(content.titleKey) || content.titleFallback}
            </h1>
            <p className="verify-message">
              {t(content.messageKey) || content.messageFallback}
            </p>
          </div>

          {showActions && (
            <div className="verify-actions">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                {t('auth.verify.goHome') || 'Ir al inicio'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/auth')}>
                {t('auth.verify.goLogin') || 'Iniciar sesión'}
              </button>
            </div>
          )}
        </div>

        <div className="verify-language-selector">
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}