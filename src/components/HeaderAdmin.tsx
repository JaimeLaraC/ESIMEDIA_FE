import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import { useLogout } from '../hooks/useLogout'
import Header from './Header'
import ProfileButton from './ProfileButton'
import UserDropdown from './UserDropdown'
import UserMenuItems from './UserMenuItems'
import NotificationsDropdown from './NotificationsDropdown'
import { useDropdown } from '../hooks/useDropdown'
import '../styles/components/HeaderAdmin.css'

export default function HeaderAdmin() {
    const { t } = useI18n()
    const { user } = useApp()
    const userMenu = useDropdown()
    const notificationsMenu = useDropdown()
    const handleLogout = useLogout()
    const navigate = useNavigate()

    // Elementos de navegación desktop para administradores
    const navigationItems = (
        <>
            <Link to="/admin">{t('header.nav.home')}</Link>
            <button onClick={() => alert('Ir a Analytics Global')}>{t('header.nav.analytics')}</button>
        </>
    )

    // Elementos de navegación móvil para administradores
    const mobileNavigationItems = (
        <>
            <Link to="/admin">
                {t('header.nav.home')}
            </Link>
            <button onClick={() => alert('Ir a Analytics')}>
                {t('header.nav.analytics')}
            </button>
        </>
    )

    // Notificaciones para administradores
    const adminNotifications = [
        { id: '1', title: 'Nuevo reporte de contenido', time: 'Hace 15 minutos' },
        { id: '2', title: 'Usuario reportado múltiples veces', time: 'Hace 1 hora' },
        { id: '3', title: 'Contenido pendiente de moderación', time: 'Hace 2 horas' },
        { id: '4', title: 'Sistema actualizado correctamente', time: 'Hace 3 horas' }
    ]

    // Elementos del menú de usuario para administradores
    const adminExtraItems = (
        <>
            <button onClick={() => { navigate('/admin'); userMenu.close() }}>
                {t('header.userMenu.controlPanel')}
            </button>
            <button onClick={() => { navigate('/admin/metrics'); userMenu.close() }}>
                {t('header.userMenu.metrics')}
            </button>
        </>
    )
    
    const userMenuItems = (
        <UserMenuItems 
            onLogout={() => handleLogout(userMenu.close)}
            onCloseMenu={userMenu.close}
            extraItems={adminExtraItems}
        />
    )

    // Contenido del lado derecho para administradores
    const rightContent = (
        <div className="admin-menu-container">
            {/* Botón de notificaciones */}
            <button
                className="btn btn-notifications"
                onClick={notificationsMenu.toggle}
                aria-label={t('header.notifications.adminAriaLabel')}
                aria-expanded={notificationsMenu.isOpen}
            >🔔<span className="notification-badge">5</span>
            </button>

            {/* Panel de notificaciones administrativas */}
            <NotificationsDropdown
                notifications={adminNotifications}
                isOpen={notificationsMenu.isOpen}
                dropdownRef={notificationsMenu.dropdownRef}
            />

            {/* Avatar/Perfil de Admin */}
            <ProfileButton
                avatarSrc={user?.avatar}
                userType="admin"
                onClick={userMenu.toggle}
                ariaLabel={t('header.tooltips.profileMenu')}
                isExpanded={userMenu.isOpen}
            />

            {/* Menú desplegable de admin */}
            <UserDropdown
                userType="admin"
                username={user?.username || t('header.userTypes.admin')}
                avatarSrc={user?.avatar}
                menuItems={userMenuItems}
                isOpen={userMenu.isOpen}
                dropdownRef={userMenu.dropdownRef}
            />

            {/* Overlay para cerrar menús */}
            {(userMenu.isOpen || notificationsMenu.isOpen) && (
                <button
                    className="user-menu-overlay"
                    onClick={() => {
                        userMenu.close()
                        notificationsMenu.close()
                    }}
                    aria-label={t('header.menu.close')}
                />
            )}
        </div>
    )

    return (
        <Header
            navigationItems={navigationItems}
            mobileNavigationItems={mobileNavigationItems}
            rightContent={rightContent}
            showSearch={false}
        />
    )
}