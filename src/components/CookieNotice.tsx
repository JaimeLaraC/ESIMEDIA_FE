import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../hooks/useI18n'
import { setCookie, getCookie, deleteCookie } from '../utils/cookies'
import '../styles/components/CookieNotice.css'
import '../styles/components/Buttons.css'

interface CookieNoticeProps {
  onAccept?: () => void
  onReject?: () => void
}

export default function CookieNotice({ onAccept, onReject }: Readonly<CookieNoticeProps>) {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(false)
  const [forceVisible, setForceVisible] = useState(false)

  const handleAccept = useCallback(() => {
    setCookie('esimedia-cookies-accepted', 'true', 365)
    deleteCookie('esimedia-cookies-rejected')
    setIsVisible(false)
    onAccept?.()
  }, [onAccept])

  const handleReject = useCallback(() => {
    setCookie('esimedia-cookies-rejected', 'true', 365)
    deleteCookie('esimedia-cookies-accepted')
    setIsVisible(false)
    onReject?.()
  }, [onReject])



  useEffect(() => {
    // Verificar si ya se han aceptado las cookies
    const cookiesAccepted = getCookie('esimedia-cookies-accepted')
    const cookiesRejected = getCookie('esimedia-cookies-rejected')
    
    if (!cookiesAccepted && !cookiesRejected) {
      // Mostrar el aviso después de un pequeño delay para mejor UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  // Escuchar eventos de desarrollo
  useEffect(() => {
    const handleDevToggle = (event: CustomEvent) => {
      setForceVisible(event.detail.forceVisible)
      setIsVisible(event.detail.forceVisible)
    }

    const handleDevReset = () => {
      setForceVisible(false)
      setIsVisible(true)
    }

    globalThis.addEventListener('dev-toggle-cookie-notice', handleDevToggle as EventListener)
    globalThis.addEventListener('dev-reset-cookies', handleDevReset)
    
    return () => {
      globalThis.removeEventListener('dev-toggle-cookie-notice', handleDevToggle as EventListener)
      globalThis.removeEventListener('dev-reset-cookies', handleDevReset)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Detectar scroll para aceptar automáticamente
    const handleScroll = () => {
      if (globalThis.scrollY > 100) { // Después de 100px de scroll
        handleAccept()
      }
    }

    // Detectar navegación entre páginas
    const handleNavigation = () => {
      handleAccept()
    }

    globalThis.addEventListener('scroll', handleScroll, { passive: true })
    globalThis.addEventListener('popstate', handleNavigation)
    
    // También escuchar clicks en enlaces
    const links = document.querySelectorAll('a[href]')
    links.forEach(link => {
      link.addEventListener('click', handleNavigation)
    })

    return () => {
      globalThis.removeEventListener('scroll', handleScroll)
      globalThis.removeEventListener('popstate', handleNavigation)
      links.forEach(link => {
        link.removeEventListener('click', handleNavigation)
      })
    }
  }, [isVisible, handleAccept])

  // Si no está visible y no se está forzando, no mostrar nada
  if (!isVisible && !forceVisible) {
    return null
  }

  return (
    <>
      {/* Overlay semi-transparente */}
      <div className="cookie-notice-overlay" />
      
      {/* Componente principal */}
      <dialog className="cookie-notice" aria-live="polite" aria-labelledby="cookie-notice-title" open>
        <div className="cookie-notice-content">
          <div className="cookie-notice-icon">
            🍪
          </div>
          
          <div className="cookie-notice-text">
            <h3 id="cookie-notice-title" className="cookie-notice-title">
              {t('cookies.notice.title')}
            </h3>
            
            <p className="cookie-notice-description">
              {t('cookies.notice.description')}
            </p>
            
            {/* Enlace a política de cookies */}
            <div className="cookie-notice-policy-link">
              <a href="/cookies" className="cookie-policy-link">
                {t('cookies.buttons.cookiePolicy')}
              </a>
            </div>
            
            <div className="cookie-notice-legal">
              <p>
                {t('cookies.notice.legal')}
              </p>
            </div>
          </div>
          
          <div className="cookie-notice-actions">
            <button 
              className="cookie-btn cookie-btn-accept" 
              onClick={handleAccept}
              aria-label={t('cookies.buttons.accept')}
            >
              {t('cookies.buttons.accept')}
            </button>
            
            <button 
              className="cookie-btn cookie-btn-reject" 
              onClick={handleReject}
              aria-label={t('cookies.buttons.reject')}
            >
              {t('cookies.buttons.reject')}
            </button>
            
            <button 
              className="cookie-btn btn-cancel" 
              onClick={handleReject}
              aria-label="Rechazar todas las cookies"
            >
              Rechazar todas
            </button>
          </div>
        </div>
        
        {/* Indicador de auto-aceptación */}
        <div className="cookie-notice-auto-accept">
          <small>{t('cookies.notice.autoAccept')}</small>
        </div>
      </dialog>
    </>
  )
}