import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import Header from './Header'

export default function HeaderGuest() {
    const { t } = useI18n()

    // Elementos de navegación móvil para invitados
    const mobileNavigationItems = (
        <>
            <Link to="/">
                {t('header.nav.home')}
            </Link>
            <Link to="/becomecreator">
                {t('header.nav.becomeCreator')}
            </Link>
        </>
    )

    // Elementos de navegación desktop para invitados
    const navigationItems = (
        <>
            <Link to="/">{t('header.nav.home')}</Link>
            <Link to="/becomecreator">{t('header.nav.becomeCreator')}</Link>
        </>
    )

    // Contenido del lado derecho para invitados
    const rightContent = (
        <Link className="btn-link btn btn-primary btn-sm" to="/auth">
            {t('header.auth.button')}
        </Link>
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