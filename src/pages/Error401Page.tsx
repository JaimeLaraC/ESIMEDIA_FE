import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import LanguageSelector from '../customcomponents/LanguageSelector'
import '../styles/pages/Error401Page.css'

export default function Error401Page() {
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGoLogin = () => {
    navigate('/auth')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="error401-page">
      <div className="error401-container">
        {/* Contenido principal centrado */}
        <div className="error401-content">
          {/* Icono de error */}
          <div className="error401-icon">
            <div className="error401-lock">
              <svg
                className="lock"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="lock-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <rect
                  className="lock-body"
                  x="19"
                  y="23"
                  width="14"
                  height="10"
                  rx="2"
                  ry="2"
                  fill="none"
                />
                <path
                  className="lock-shackle"
                  fill="none"
                  d="M22 23c0-3 2-5.5 4.5-5.5s4.5 2.5 4.5 5.5"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje de error */}
          <div className="error401-message-section">
            <h1 className="error401-title">
              {t('errors.401.title') || '401'}
            </h1>
            <p className="error401-description">
              {t('errors.401.message') || 'Debes iniciar sesión para acceder a esta página. Por favor, autentícate para continuar.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="error401-actions">
            <button
              className="btn btn-primary"
              onClick={handleGoLogin}
            >
              {t('errors.401.loginButton') || 'Iniciar Sesión'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleGoHome}
            >
              {t('errors.401.homeButton') || 'Ir al Inicio'}
            </button>
          </div>
        </div>

        {/* Selector de idioma */}
        <div className="error401-language-selector">
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}