import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import LanguageSelector from '../customcomponents/LanguageSelector'
import '../styles/pages/Error404Page.css'

export default function Error404Page() {
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="error404-page">
      <div className="error404-container">
        {/* Contenido principal centrado */}
        <div className="error404-content">
          {/* Icono de error */}
          <div className="error404-icon">
            <div className="error404-question">
              <svg
                className="question"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="question-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <text
                  className="question-mark"
                  x="26"
                  y="32"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill="var(--warning, #f59e0b)"
                >
                  !
                </text>
              </svg>
            </div>
          </div>

          {/* Mensaje de error */}
          <div className="error404-message-section">
            <h1 className="error404-title">
              {t('errors.404.title') || '404'}
            </h1>
            <h2 className="error404-subtitle">
              {t('errors.404.subtitle') || 'Página no encontrada'}
            </h2>
            <p className="error404-message">
              {t('errors.404.message') || 'La página que buscas no existe o ha sido movida. Verifica la URL o regresa a la página principal.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="error404-actions">
            <button
              className="btn btn-primary"
              onClick={handleGoHome}
            >
              {t('errors.404.goHome') || 'Ir al inicio'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleGoBack}
            >
              {t('errors.404.goBack') || 'Volver atrás'}
            </button>
          </div>
        </div>

        {/* Selector de idioma en la esquina */}
        <div className="error404-language-selector">
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}