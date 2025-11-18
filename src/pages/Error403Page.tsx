import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import LanguageSelector from '../customcomponents/LanguageSelector'
import '../styles/pages/Error403Page.css'

export default function Error403Page() {
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="error403-page">
      <div className="error403-container">
        {/* Contenido principal centrado */}
        <div className="error403-content">
          {/* Icono de error */}
          <div className="error403-icon">
            <div className="error403-cross">
              <svg
                className="cross"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="cross-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="cross-line cross-line-1"
                  fill="none"
                  d="m16 16 20 20"
                />
                <path
                  className="cross-line cross-line-2"
                  fill="none"
                  d="m36 16-20 20"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje de error */}
          <div className="error403-message-section">
            <h1 className="error403-title">
              {t('errors.403.title') || '403'}
            </h1>
            <h2 className="error403-subtitle">
              {t('errors.403.subtitle') || 'Acceso denegado'}
            </h2>
            <p className="error403-message">
              {t('errors.403.message') || 'No tienes permisos para acceder a esta página. Si crees que esto es un error, contacta con el administrador.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="error403-actions">
            <button
              className="btn btn-primary"
              onClick={handleGoHome}
            >
              {t('errors.403.goHome') || 'Ir al inicio'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleGoBack}
            >
              {t('errors.403.goBack') || 'Volver atrás'}
            </button>
          </div>
        </div>

        {/* Selector de idioma en la esquina */}
        <div className="error403-language-selector">
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}