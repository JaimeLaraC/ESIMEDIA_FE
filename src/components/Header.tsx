import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import HeaderLanguageSelector from '../customcomponents/LanguageSelector'
import Textbox from '../customcomponents/Textbox'
import logotipo from '../assets/logotipo.png'
import '../styles/components/Header.css'

interface HeaderProps {
    navigationItems?: ReactNode
    rightContent?: ReactNode
    mobileNavigationItems?: ReactNode
    showSearch?: boolean
}

export default function Header({ 
    navigationItems,
    rightContent,
    mobileNavigationItems,
    showSearch = true
}: Readonly<HeaderProps>) {
    const [q, setQ] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { t } = useI18n()
    const navigate = useNavigate()
    const { user } = useApp()

    // Determinar la ruta del home basada en el tipo de usuario
    const getHomeRoute = () => {
        if (!user) return '/'
        
        switch (user.type) {
            case 'administrator':
                return '/admin'
            case 'content-creator':
                return '/creator'
            default:
                return '/'
        }
    }

    const homeRoute = getHomeRoute()

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        // Si está vacío, buscar todo con q=*
        const searchQuery = q.trim() || '*'
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        setIsMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <header className="header">
            <div className="header-inner">
                <div className="left-group">
                    <div className="brand-container">
                        <div className="brand-wrapper">
                            <div className="brand desktop-brand">
                                <img src={logotipo} alt={t('common.mockup')} className="logo-img" />
                            </div>
                            <button 
                                className="brand mobile-brand-btn"
                                onClick={toggleMobileMenu}
                                aria-label={t('header.menu.toggle')}
                                aria-expanded={isMobileMenuOpen}
                            >
                                <img src={logotipo} alt={t('common.mockup')} className="logo-img" />
                            </button>
                        </div>
                        
                        <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                            {showSearch && (
                                <div className="mobile-search-container">
                                    <form className="mobile-search" onSubmit={submit} role="search">
                                        <Textbox
                                            type="text"
                                            value={q}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
                                            placeholder={t('header.search.placeholder')}
                                            aria-label={t('header.search.ariaLabel')}
                                        />
                                        <button 
                                            type="submit" 
                                            className="mobile-search-btn"
                                            aria-label={t('header.search.ariaLabel')}
                                        >
                                            <span className="material-symbols-outlined">search</span>
                                        </button>
                                    </form>
                                </div>
                            )}
                            
                            <nav className="mobile-nav" aria-label={t('header.menu.mobileNavLabel')}>
                                {mobileNavigationItems || (
                                    <Link to={homeRoute} onClick={() => setIsMobileMenuOpen(false)}>
                                        {t('header.nav.home')}
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>

                    <nav className="nav desktop-nav" aria-label={t('header.menu.mainNavLabel')}>
                        {navigationItems || (
                            <Link to={homeRoute}>{t('header.nav.home')}</Link>
                        )}
                    </nav>

                    {showSearch && (
                        <form className="search desktop-search" onSubmit={submit} role="search">
                            <Textbox
                                type="text"
                                value={q}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
                                placeholder={t('header.search.placeholder')}
                                aria-label={t('header.search.ariaLabel')}
                            />
                            <button 
                                type="submit" 
                                className="search-btn"
                                aria-label={t('header.search.ariaLabel')}
                            >
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </form>
                    )}
                </div>

                <div className="right-group">
                    <HeaderLanguageSelector />
                    {rightContent}
                </div>
            </div>

            {isMobileMenuOpen && (
                <button 
                    className="mobile-menu-overlay" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
                    aria-label={t('header.menu.close')}
                />
            )}
        </header>
    )
}