import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import { useLogout } from '../hooks/useLogout'
import Header from './Header'
import ProfileButton from './ProfileButton'
import UserDropdown from './UserDropdown'
import UserMenuItems from './UserMenuItems'
import NotificationsDropdown from './NotificationsDropdown'
import { useDropdown } from '../hooks/useDropdown'
import '../styles/components/HeaderCreator.css'

export default function HeaderCreator() {
    const { t } = useI18n()
    const { user } = useApp()
    const userMenu = useDropdown()
    const notificationsMenu = useDropdown()
    const handleLogout = useLogout()

    // Elementos de navegación desktop para content creators
    const navigationItems = (
        <>
            <Link to="/creator">{t('header.nav.home')}</Link>
            <Link to="/creator/lists">{t('playlist.title')}</Link>
            <button onClick={() => alert('Ir a Analytics')}>{t('header.nav.analytics')}</button>
        </>
    )

    // Elementos de navegación móvil para content creators
    const mobileNavigationItems = (
        <>
            <Link to="/creator">
                {t('header.nav.home')}
            </Link>
            <Link to="/creator/lists">
                {t('playlist.title')}
            </Link>
            <button onClick={() => alert('Ir a Analytics')}>
                {t('header.nav.analytics')}
            </button>
        </>
    )

    // Notificaciones para creators
    const creatorNotifications = [
        { id: '1', title: 'Nuevo comentario en tu video', time: 'Hace 2 horas' },
        { id: '2', title: 'Tu contenido fue aprobado', time: 'Hace 5 horas' },
        { id: '3', title: 'Nuevo seguidor', time: 'Hace 1 día' }
    ]

    // Elementos del menú de usuario para creators
    const creatorExtraItems = (
        <button onClick={() => { alert('Ir a Analytics'); userMenu.close() }}>
            {t('header.nav.analytics')}
        </button>
    )
    
    const userMenuItems = (
        <UserMenuItems 
            onLogout={() => handleLogout(userMenu.close)}
            onCloseMenu={userMenu.close}
            extraItems={creatorExtraItems}
        />
    )

    // Contenido del lado derecho para content creators
    const rightContent = (
        <div className="creator-menu-container">
            {/* Botón de notificaciones */}
            <button
                className="btn btn-notifications"
                onClick={notificationsMenu.toggle}
                aria-label={t('header.notifications.ariaLabel')}
                aria-expanded={notificationsMenu.isOpen}
            >🔔<span className="notification-badge">3</span>
            </button>

            {/* Panel de notificaciones */}
            <NotificationsDropdown
                notifications={creatorNotifications}
                isOpen={notificationsMenu.isOpen}
                dropdownRef={notificationsMenu.dropdownRef}
            />

            {/* Avatar/Perfil */}
            <ProfileButton
                avatarSrc={user?.avatar}
                userType="creator"
                onClick={userMenu.toggle}
                ariaLabel={t('header.tooltips.profileMenu')}
                isExpanded={userMenu.isOpen}
            />

            {/* Menú desplegable de creator */}
            <UserDropdown
                userType="creator"
                username={user?.username || t('header.userTypes.creator')}
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