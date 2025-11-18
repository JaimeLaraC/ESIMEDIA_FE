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

export default function HeaderUserPremium() {
    const { t } = useI18n()
    const { user } = useApp()
    const userMenu = useDropdown()
    const handleLogout = useLogout()
    const navigate = useNavigate()

    // Elementos de navegación desktop para usuarios premium
    const navigationItems = (
        <>
            <Link to="/">{t('header.nav.home')}</Link>
            <Link to="/my-lists">{t('playlist.title')}</Link>
            <button onClick={() => navigate('/favorites')}>{t('header.nav.favorites')}</button>
            <button onClick={() => navigate('/search?q=*')}>{t('header.nav.accessContent')}</button>
        </>
    )

    // Elementos de navegación móvil para usuarios premium
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
        </>
    )

    // Elementos del menú de usuario para usuarios premium
    const userMenuItems = (
        <UserMenuItems 
            onLogout={() => handleLogout(userMenu.close)}
            onCloseMenu={userMenu.close}
            showPremiumUpgrade={false}
        />
    )

    // Contenido del lado derecho para usuarios premium
    const rightContent = (
        <>
            <span className="badge badge-md badge-premium header-premium-badge">{t('header.userTypes.premium')}</span>
            <div className="user-menu-container">
                <ProfileButton
                    avatarSrc={user?.avatar}
                    onClick={userMenu.toggle}
                    userType="premium"
                    ariaLabel={t('header.tooltips.profileMenu')}
                    isExpanded={userMenu.isOpen}
                    className="user-avatar-btn"
                />

                <UserDropdown
                    userType="premium"
                    username={user?.username || t('header.userTypes.premium')}
                    avatarSrc={user?.avatar}
                    menuItems={userMenuItems}
                    isOpen={userMenu.isOpen}
                    dropdownRef={userMenu.dropdownRef}
                />

                {userMenu.isOpen && (
                    <button
                        className="user-menu-overlay"
                        onClick={userMenu.close}
                        aria-label={t('header.menu.close')}
                    />
                )}
            </div>
        </>
    )

    return (
        <Header
            navigationItems={navigationItems}
            mobileNavigationItems={mobileNavigationItems}
            rightContent={rightContent}
        />
    )
}