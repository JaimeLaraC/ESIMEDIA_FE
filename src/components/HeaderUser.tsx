import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import { useLogout } from '../hooks/useLogout'
import Header from './Header'
import ProfileButton from './ProfileButton'
import UserDropdown from './UserDropdown'
import UserMenuItems from './UserMenuItems'
import { useDropdown } from '../hooks/useDropdown'
import '../styles/components/Buttons.css'
import '../styles/components/HeaderUser.css'

export default function HeaderUser() {
    const { t } = useI18n()
    const { user } = useApp()
    const userMenu = useDropdown()
    const handleLogout = useLogout()
    const navigate = useNavigate()

    const handlePremiumClick = () => {
        if (user?.id) {
            navigate(`/profile/${user.id}`)
        }
    }

    // Elementos de navegación desktop para usuarios básicos
    const navigationItems = (
        <>
            <Link to="/">{t('header.nav.home')}</Link>
            <Link to="/my-lists">Mis Listas</Link>
            <button onClick={() => navigate('/favorites')}>{t('header.nav.favorites')}</button>
            <button onClick={() => navigate('/search?q=*')}>{t('header.nav.accessContent')}</button>
            <button className="btn btn-premium btn-sm" onClick={handlePremiumClick}>
                {t('header.premium.upgrade')}
            </button>
        </>
    )

    // Elementos de navegación móvil para usuarios básicos
    const mobileNavigationItems = (
        <>
            <Link to="/">
                {t('header.nav.home')}
            </Link>
            <Link to="/my-lists">
                {t('playlist.title')}
            </Link>
            <button onClick={() => navigate('/favorites')}>
                {t('header.nav.favorites')}
            </button>
            <button onClick={() => navigate('/search?q=*')}>
                {t('header.nav.accessContent')}
            </button>
            <button
                className="btn btn-premium btn-sm"
                onClick={handlePremiumClick}
            >
                {t('header.premium.upgrade')}
            </button>
        </>
    )

    // Elementos del menú de usuario para usuarios básicos
    const userMenuItems = (
        <UserMenuItems 
            onLogout={() => handleLogout(userMenu.close)}
            onCloseMenu={userMenu.close}
            showPremiumUpgrade={true}
        />
    )

    // Contenido del lado derecho para usuarios básicos
    const rightContent = (
        <div className="user-menu-container">
            {/* Avatar/Perfil */}
            <ProfileButton
                avatarSrc={user?.avatar}
                onClick={userMenu.toggle}
                userType="basic"
                ariaLabel={t('header.tooltips.profileMenu')}
                isExpanded={userMenu.isOpen}
                className="user-avatar-btn"
            />

            {/* Menú desplegable de usuario */}
            <UserDropdown
                userType="basic"
                username={user?.username || t('header.userTypes.user')}
                avatarSrc={user?.avatar}
                menuItems={userMenuItems}
                isOpen={userMenu.isOpen}
                dropdownRef={userMenu.dropdownRef}
            />

            {/* Overlay para cerrar menú de usuario */}
            {userMenu.isOpen && (
                <button
                    className="user-menu-overlay"
                    onClick={userMenu.close}
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
        />
    )
}