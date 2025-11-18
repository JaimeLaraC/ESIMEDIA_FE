import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import ProfileGuard from '../components/ProfileGuard'
import AdminGuard from '../components/AdminGuard'
import CreatorGuard from '../components/CreatorGuard'
import AuthGuard from '../components/AuthGuard'
import { useApp } from '../context/AppContextHooks'
import { userTypeToProfileRole } from '../utils/roleMapper'
import Hero from '../components/Hero'
import MediaSection from '../components/MediaSection'
import CookieNotice from '../components/CookieNotice'
import { audios, videos } from '../data/sampleMedia'
import { useI18n } from '../hooks/useI18n'
import { log } from '../config/logConfig'
import HeaderGuest from '../components/HeaderGuest'
import HeaderUser from '../components/HeaderUser'
import HeaderUserPremium from '../components/HeaderUserPremium'
import HeaderAdmin from '../components/HeaderAdmin'
import HeaderCreator from '../components/HeaderCreator'
import { NotificationProvider } from '../customcomponents/NotificationProvider'

const AuthPage = lazy(() => import('../pages/AuthPage'))
const PlanPage = lazy(() => import('../pages/PlanPage'))
const CreatorPage = lazy(() => import('../pages/CreatorPage'))
const CreatorFormPage = lazy(() => import('../pages/CreatorFormPage'))
const CreatorListsPage = lazy(() => import('../pages/CreatorListsPage'))
const AdminPage = lazy(() => import('../pages/AdminPage'))
const VerifyPage = lazy(() => import('../pages/VerifyPage'))
const RecoverPasswordPage = lazy(() => import('../pages/RecoverPasswordPage'))
const RequestPasswordPage = lazy(() => import('../pages/RequestPasswordPage'))
const Error403Page = lazy(() => import('../pages/Error403Page'))
const Error404Page = lazy(() => import('../pages/Error404Page'))
const Error401Page = lazy(() => import('../pages/Error401Page'))
const ProfilePageUser = lazy(() => import('../pages/ProfilePageUser'))
const ProfilePageCreator = lazy(() => import('../pages/ProfilePageCreator'))
const ProfilePageAdmin = lazy(() => import('../pages/ProfilePageAdmin'))
const CookiePage = lazy(() => import('../pages/CookiePage'))
const PlayPage = lazy(() => import('../pages/PlayPage'))
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'))
const MyListsPage = lazy(() => import('../pages/MyListsPage'))
const ListDetailPage = lazy(() => import('../pages/ListDetailPage'))
const AddContentToListPage = lazy(() => import('../pages/AddContentToListPage'))
const FavoritesDetailPage = lazy(() => import('../pages/FavoritesDetailPage'))

// Mapa de componentes de perfil por rol
const PROFILE_COMPONENTS = {
  standard: ProfilePageUser,
  premium: ProfilePageUser,
  creator: ProfilePageCreator,
  admin: ProfilePageAdmin,
} as const

// Componente para manejar scroll al top en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top cuando cambia la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [pathname])

  return null
}

// Componente para redirigir automáticamente según el rol del usuario
function HomeRedirect() {
  const { user, isAuthenticated } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Usuario no autenticado - no hacer nada
    if (!isAuthenticated || !user) {
      return
    }

    // Usuario autenticado - redirigir según rol
    switch (user.type) {
      case 'administrator':
        navigate('/admin', { replace: true })
        break
      case 'content-creator':
        navigate('/creator', { replace: true })
        break
      default:
        // Usuario normal o premium - mostrar página principal
        break
    }
  }, [user, isAuthenticated, navigate])

  // Si no hay redirección, mostrar la página principal normal
  if (!isAuthenticated || !user || (user.type !== 'administrator' && user.type !== 'content-creator')) {
    return <HomePage />
  }

  // Mostrar loading mientras se redirige
  return <div className="loading">Redirigiendo...</div>
}

function ProfileRouter() {
  const { user } = useApp()

  if (!user) {
    return <Navigate to="/error/401" replace />
  }

  const role = userTypeToProfileRole(user.type)
  const ProfileComponent = PROFILE_COMPONENTS[role] || ProfilePageUser

  return <ProfileComponent />
}
function useHeader() {
  const { user, isAuthenticated } = useApp()

  if (!isAuthenticated || !user) return HeaderGuest
  if (user.type === 'administrator') return HeaderAdmin
  if (user.type === 'content-creator') return HeaderCreator
  if (user.type === 'user-premium') return HeaderUserPremium
  return HeaderUser
}

function HomePage() {
  const { t } = useI18n()
  const Header = useHeader()

  // Ensure page opens at top scroll position
  // useScrollToTop() // Removido - ahora se maneja globalmente

  log('info', 'HomePage render - translations test:', {
    recentVideos: t('media.sections.recentVideos'),
    mockup: t('common.mockup')
  })

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Hero />
        <MediaSection
          title={t('media.sections.recentVideos')}
          items={videos}
          kind="video"
        />
        <MediaSection
          title={t('media.sections.recentAudios')}
          items={audios}
          kind="audio"
        />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} ESIMedia · {t('common.mockup')}
        {' · '}
        <Link to="/cookies">{t('cookies.buttons.cookiePolicy')}</Link>
      </footer>
    </div>
  )
}

function Layout({ children }: { readonly children: React.ReactNode }) {
  const { t } = useI18n()
  const Header = useHeader()

  return (
    <div className="app">
      <Header />
      {children}
      <footer className="footer">
        © {new Date().getFullYear()} ESIMedia · {t('common.mockup')}
        {' · '}
        <Link to="/cookies">{t('cookies.buttons.cookiePolicy')}</Link>
      </footer>
    </div>
  )
}

export default function AppRouter() {
  return (
    <NotificationProvider>
      <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="loading">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/recover" element={<RecoverPasswordPage />} />
          <Route path="/auth/password/request" element={<RequestPasswordPage />} />
          <Route path="/error/403" element={<Error403Page />} />
          <Route path="/error/404" element={<Error404Page />} />
          <Route path="/error/401" element={<Error401Page />} />
          
          <Route path="/plans" element={<Layout><PlanPage /></Layout>} />
          <Route path="/becomecreator" element={<Layout><CreatorFormPage /></Layout>} />
          
          <Route 
            path="/creator" 
            element={
              <Layout>
                <CreatorGuard>
                  <CreatorPage />
                </CreatorGuard>
              </Layout>
            } 
          />
          
          <Route 
            path="/creator/lists" 
            element={
              <Layout>
                <CreatorGuard>
                  <CreatorListsPage />
                </CreatorGuard>
              </Layout>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <Layout>
                <AdminGuard>
                  <AdminPage />
                </AdminGuard>
              </Layout>
            } 
          />
          
          <Route path="/cookies" element={<Layout><CookiePage /></Layout>} />
          
          <Route path="/play/:id" element={<Layout><PlayPage /></Layout>} />
          
          {/* Rutas de listas de contenido */}
          <Route 
            path="/my-lists" 
            element={
              <Layout>
                <AuthGuard>
                  <MyListsPage />
                </AuthGuard>
              </Layout>
            } 
          />

          <Route 
            path="/favorites" 
            element={
              <Layout>
                <AuthGuard>
                  <FavoritesDetailPage />
                </AuthGuard>
              </Layout>
            } 
          />
          
          <Route 
            path="/lists/:id" 
            element={
              <Layout>
                <AuthGuard>
                  <ListDetailPage />
                </AuthGuard>
              </Layout>
            } 
          />
          
          <Route 
            path="/lists/:id/add-content" 
            element={
              <Layout>
                <AuthGuard>
                  <AddContentToListPage />
                </AuthGuard>
              </Layout>
            } 
          />
          
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <ProfileGuard>
                  <ProfileRouter />
                </ProfileGuard>
              </Layout>
            }
          />
          <Route 
            path="/search" 
            element={
              <Layout>
                <SearchResultsPage />
              </Layout>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <CookieNotice />
    </BrowserRouter>
    </NotificationProvider>
  )
}