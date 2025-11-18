import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useErrorHandler } from '../hooks/useErrorHandler'
import Login from '../components/Login'
import Registration from '../components/Registration'
import LanguageSelector from '../customcomponents/LanguageSelector'
import '../styles/pages/AuthPage.css'
import logotipo from '../assets/logotipo.png'
import { log } from '../config/logConfig'
import { LoginService, AuthError } from '../services/loginService'
import { UserService } from '../services/userService'
import { useApp } from '../context/AppContextHooks'
import { mapUserSummaryToUser } from '../utils/userUtils'

type AuthMode = 'login' | 'register'

export default function AuthPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const { handleAuthError } = useErrorHandler()
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | ''>('')
  const { setUser, user, isAuthenticated, isLoading: authLoading } = useApp()

  // Verificar si ya hay una sesión activa y redirigir automáticamente
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      log('info', 'User already authenticated, redirecting from AuthPage', { userType: user.type })
      
      // Determinar ruta de redirección según el tipo de usuario
      let redirectPath = '/'
      if (user.type === 'administrator') {
        redirectPath = '/admin'
      } else if (user.type === 'content-creator') {
        redirectPath = '/creator'
      }
      
      log('info', 'Redirecting authenticated user to:', { userType: user.type, path: redirectPath })
      navigate(redirectPath, { replace: true })
    }
  }, [authLoading, isAuthenticated, user, navigate])

  // Determinar el modo inicial basado en si viene de PlanPage
  useEffect(() => {
    const planFromStorage = localStorage.getItem('selectedPlan')
    const planFromState = location.state?.selectedPlan
    const selectedPlanValue = planFromState || planFromStorage || ''
    
    const fromPlanPage = location.state?.from === 'plan' || planFromStorage
    
    if (fromPlanPage) {
      setAuthMode('register')
      setSelectedPlan(selectedPlanValue as 'standard' | 'premium' | '')
      log('info', 'AuthPage opened in register mode from PlanPage', { selectedPlan: selectedPlanValue })
      
      // Limpiar localStorage después de usarlo
      localStorage.removeItem('selectedPlan')
    }
  }, [location.state])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    
    try {
      log('info', 'Login attempt:', { email })
      
      await LoginService.login(email, password)
      
      // Pausa de 200ms para permitir que el navegador adjunte la cookie session_token
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Login exitoso - obtener datos del usuario para mostrar mensaje
      const userData = await UserService.getCurrentUser()
      setSuccessMessage(`${t('auth.success.login')}`)
      
      // Actualizar el contexto de usuario
      const user = mapUserSummaryToUser(userData)
      setUser(user)
      
      // Determinar ruta de redirección según el tipo de usuario
      let redirectPath = '/'
      if (user.type === 'administrator') {
        redirectPath = '/admin'
      } else if (user.type === 'content-creator') {
        redirectPath = '/creator'
      }
      
      log('info', 'Redirecting user to:', { userType: user.type, path: redirectPath })
      
      // Redirigir después del login exitoso
      setTimeout(() => navigate(redirectPath), 2000) // Redirigir después de 2 segundos para mostrar el mensaje
      
      
    } catch (error) {
      log('error', 'Login error:', error)
      
      // handleAuthError maneja navegación y retorna mensaje apropiado
      const errorMsg = error instanceof AuthError 
        ? handleAuthError(error.code, error.message)
        : t('auth.errors.loginFailed')
      
      // Solo establecer mensaje si handleAuthError no navegó (retornó un mensaje)
      if (errorMsg) {
        setErrorMessage(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToRegister = () => {
    setAuthMode('register')
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/* Panel Izquierdo - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <img src={logotipo} alt="ESIMedia" className="brand-logo-img" />
              <span className="brand-tagline">{t('auth.branding.tagline')}</span>
            </div>
            
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">🎥</span>
                <div className="feature-text">
                  <h3>{t('auth.branding.features.exclusive.title')}</h3>
                  <p>{t('auth.branding.features.exclusive.desc')}</p>
                </div>
              </div>
              
              <div className="feature">
                <span className="feature-icon">🌍</span>
                <div className="feature-text">
                  <h3>{t('auth.branding.features.multiplatform.title')}</h3>
                  <p>{t('auth.branding.features.multiplatform.desc')}</p>
                </div>
              </div>
              
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <div className="feature-text">
                  <h3>{t('auth.branding.features.streaming.title')}</h3>
                  <p>{t('auth.branding.features.streaming.desc')}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas llamativas */}
            <div className="brand-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">{t('auth.branding.stats.creators')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">{t('auth.branding.stats.users')}</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">{t('auth.branding.stats.content')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formularios */}
        <div className="auth-forms">
          {/* Botón de regreso - flotando sobre auth-forms */}
          <button 
            className="back-to-home"
            onClick={() => navigate('/')}
            aria-label={t('auth.backToHome')}
          >
            ← {t('auth.backToHome')}
          </button>
          
          {authMode === 'login' ? (
            <div className="auth-form-container">
              <Login 
                onLogin={handleLogin}
                onSwitchToRegister={handleSwitchToRegister}
                isLoading={isLoading}
                errorMessage={errorMessage}
                successMessage={successMessage}
              />
            </div>
          ) : (
            <div className="auth-form-container">
              <div className="registration-content">
                <Registration selectedPlan={selectedPlan} />
              </div>
              
              {/* Botón para cambiar a login - Parte del contenido */}
              <div className="mode-switch">
                <p>{t('auth.switch.haveAccount')}</p>
                <button 
                  onClick={handleSwitchToLogin}
                  className="btn-mode-switch secondary"
                >
                  ← {t('auth.switch.signIn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Selector de idioma flotante para AuthPage */}
      <div className="language-selector-float">
        <LanguageSelector />
      </div>
    </div>
  )
}