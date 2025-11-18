import { useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import '../styles/pages/CookiePage.css'

export default function CookiePage() {
  const { t } = useI18n()

  // Scroll al inicio de la página cuando se carga el componente
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(t('cookies.page.locale'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="cookie-page">
      <div className="cookie-page-container">
        {/* Header */}
        <header className="cookie-page-header">
          <h1>{t('cookies.page.title')}</h1>
          <p className="cookie-page-subtitle">{t('cookies.page.subtitle')}</p>
          <p className="cookie-page-updated">
            {t('cookies.page.lastUpdated')}: {getCurrentDate()}
          </p>
        </header>

        {/* What are cookies */}
        <section className="cookie-section">
          <h2>{t('cookies.page.whatAre.title')}</h2>
          <p>{t('cookies.page.whatAre.description')}</p>
          <p>{t('cookies.page.whatAre.purpose')}</p>
        </section>

        {/* Cookies we use */}
        <section className="cookie-section">
          <h2>{t('cookies.page.weUse.title')}</h2>
          <p>{t('cookies.page.weUse.description')}</p>

          {/* Essential Cookies */}
          <div className="cookie-category">
            <h3>{t('cookies.page.categories.essential.title')}</h3>
            <p>{t('cookies.page.categories.essential.description')}</p>
            
            <div className="cookie-table-container">
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>{t('cookies.page.table.name')}</th>
                    <th>{t('cookies.page.table.purpose')}</th>
                    <th>{t('cookies.page.table.duration')}</th>
                    <th>{t('cookies.page.table.type')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>esimedia-language</code></td>
                    <td>{t('cookies.page.essential.language.purpose')}</td>
                    <td>{t('cookies.page.essential.language.duration')}</td>
                    <td>{t('cookies.page.table.typeOwn')}</td>
                  </tr>
                  <tr>
                    <td><code>esimedia-cookies-accepted</code></td>
                    <td>{t('cookies.page.essential.consent.purpose')}</td>
                    <td>{t('cookies.page.essential.consent.duration')}</td>
                    <td>{t('cookies.page.table.typeOwn')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="cookie-category">
            <h3>{t('cookies.page.categories.analytics.title')}</h3>
            <p>{t('cookies.page.categories.analytics.description')}</p>
            
            <div className="cookie-table-container">
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>{t('cookies.page.table.name')}</th>
                    <th>{t('cookies.page.table.purpose')}</th>
                    <th>{t('cookies.page.table.duration')}</th>
                    <th>{t('cookies.page.table.type')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>{t('cookies.page.analytics.ga.purpose')}</td>
                    <td>{t('cookies.page.analytics.ga.duration')}</td>
                    <td>Google</td>
                  </tr>
                  <tr>
                    <td><code>_ga_*</code></td>
                    <td>{t('cookies.page.analytics.gaId.purpose')}</td>
                    <td>{t('cookies.page.analytics.gaId.duration')}</td>
                    <td>Google</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Legal basis */}
        <section className="cookie-section">
          <h2>{t('cookies.page.legal.title')}</h2>
          <ul className="cookie-legal-list">
            <li>{t('cookies.page.legal.gdpr')}</li>
            <li>{t('cookies.page.legal.lssi')}</li>
            <li>{t('cookies.page.legal.lopd')}</li>
          </ul>
        </section>

        {/* User rights */}
        <section className="cookie-section">
          <h2>{t('cookies.page.rights.title')}</h2>
          <p>{t('cookies.page.rights.description')}</p>
          
          <div className="cookie-rights-grid">
            <div className="cookie-right-item">
              <h4>{t('cookies.page.rights.access.title')}</h4>
              <p>{t('cookies.page.rights.access.description')}</p>
            </div>
            <div className="cookie-right-item">
              <h4>{t('cookies.page.rights.rectification.title')}</h4>
              <p>{t('cookies.page.rights.rectification.description')}</p>
            </div>
            <div className="cookie-right-item">
              <h4>{t('cookies.page.rights.erasure.title')}</h4>
              <p>{t('cookies.page.rights.erasure.description')}</p>
            </div>
            <div className="cookie-right-item">
              <h4>{t('cookies.page.rights.objection.title')}</h4>
              <p>{t('cookies.page.rights.objection.description')}</p>
            </div>
          </div>
        </section>

        {/* How to manage cookies */}
        <section className="cookie-section">
          <h2>{t('cookies.page.manage.title')}</h2>
          <p>{t('cookies.page.manage.description')}</p>
          
          <div className="cookie-browser-links">
            <h4>{t('cookies.page.manage.browsers.title')}</h4>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  {t('cookies.page.manage.browsers.chrome')}
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                  {t('cookies.page.manage.browsers.firefox')}
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  {t('cookies.page.manage.browsers.safari')}
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                  {t('cookies.page.manage.browsers.edge')}
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="cookie-section">
          <h2>{t('cookies.page.contact.title')}</h2>
          <div className="cookie-contact-info">
            <p>{t('cookies.page.contact.description')}</p>
            <ul>
              <li><strong>{t('cookies.page.contact.email')}</strong>: cookies@esimedia.com</li>
              <li><strong>{t('cookies.page.contact.company')}</strong>: ESIMedia</li>
              <li><strong>{t('cookies.page.contact.authority')}</strong>: {t('cookies.page.contact.aepd')}</li>
            </ul>
          </div>
        </section>

        {/* Back to home */}
        <div className="cookie-page-footer">
          <a href="/" className="cookie-page-back">
            ← {t('cookies.page.backToHome')}
          </a>
        </div>
      </div>
    </div>
  )
}