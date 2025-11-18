import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useNavigate } from "react-router-dom";
import Textbox from '../customcomponents/Textbox'
import { validateEmail, validatePassword } from '../utils/fieldValidator'

interface LoginProps {
  readonly onLogin: (email: string, password: string) => Promise<void>
  readonly onSwitchToRegister: () => void
  readonly isLoading?: boolean
  readonly errorMessage?: string | null
  readonly successMessage?: string | null
}

export default function Login({ onLogin, onSwitchToRegister, isLoading = false, errorMessage, successMessage }: LoginProps) {
  const { t } = useI18n()
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({})

  // Limpiar errores de validación cuando cambie el error del servidor
  useEffect(() => {
    if (errorMessage) {
      setValidationErrors({})
    }
  }, [errorMessage])

  const clearValidationError = (field: 'email' | 'password') => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Validación del lado cliente
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    const errors = {
      email: emailError ? t(emailError) : undefined,
      password: passwordError ? t(passwordError) : undefined
    }
    
    setValidationErrors(errors)
    
    // Si hay errores de validación, no continuar
    if (emailError || passwordError) {
      return
    }
    
    await onLogin(email, password)
  }

  return (
    <div className="login-form">
      <h2>{t('auth.buttons.login')}</h2>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <Textbox
            id="email"
            name="email"
            type="email"
            label={t('auth.forms.email')}
            placeholder={t('auth.forms.placeholders.email')}
            required
            error={validationErrors.email}
            onChange={() => clearValidationError('email')}
          />
        </div>
        
        <div className="form-group">
          <Textbox
            id="password"
            name="password"
            type="password"
            label={t('auth.forms.password')}
            placeholder={t('auth.forms.placeholders.password')}
            required
            error={validationErrors.password}
            onChange={() => clearValidationError('password')}
          />
        </div>
        
        {errorMessage && (
          <div className="hint hint-error hint-inline">
            {errorMessage}
          </div>
        )}

        {!errorMessage && successMessage && (
          <div className="hint hint-success hint-inline">
            {successMessage}
          </div>
        )}
        
        <button type="submit" className="btn-secondary" disabled={isLoading}>
          {isLoading ? t('auth.loading') : t('auth.buttons.login')}
        </button>

        <div className="password-reset-link">
          <button
            type="button"
            className="btn-link"
            onClick={() => navigate('/auth/password/request')}
          >
            {t('auth.password.forgot') || '¿Olvidaste tu contraseña?'}
          </button>
        </div>
      </form>
      
      <div className="form-switch">
        <p>{t('auth.switch.noAccount')}</p>
        <button onClick={onSwitchToRegister} className="btn btn-primary">
          {t('auth.switch.signUp')}
        </button>
      </div>
    </div>
  )
}
