import { Link } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import '../styles/components/Hero.css'

export default function Hero() {
    const { t } = useI18n()
    const { user, isAuthenticated } = useApp()

    return (
        <section className={`hero ${isAuthenticated ? 'hero-authenticated' : ''}`}>
            <div className="hero-left">
                {isAuthenticated && user ? (
                    // Contenido para usuarios autenticados
                    <>
                        <h1 className="hero-title">
                            <span>{t('hero.authenticated.welcomePrefix')}</span>
                            <span className="hero-title-accent">{user.username || user.email}</span>
                        </h1>
                        <p className="hero-sub">
                            {t('hero.authenticated.subtitle')}
                        </p>
                        <div className="hero-actions">
                            <Link className="btn btn-primary" to="/explore">
                                {t('hero.authenticated.buttons.explore')}
                            </Link>
                            <Link className="btn btn-secondary" to={`/profile/${user.id}`}>
                                {t('hero.authenticated.buttons.profile')}
                            </Link>
                        </div>
                    </>
                ) : (
                    // Contenido para usuarios no autenticados (invitados)
                    <>
                        <h1 className="hero-title">
                            <span>{t('hero.title.prefix')}</span>
                            <span className="hero-title-accent">{t('hero.title.accent')}</span>
                        </h1>
                        <p className="hero-sub">
                            {t('hero.subtitle')}
                        </p>
                        <div className="hero-actions">
                            <Link className="btn btn-primary" to="/auth">
                                {t('hero.buttons.start')}
                            </Link>
                            <Link className="btn btn-secondary" to="/plans">
                                {t('hero.buttons.plans')}
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <div className="hero-right">
                <div className="preview">
                    {/* TODO: Add video preview from backend */}
                    <video
                        width="100%"
                        height="100%"
                        controls
                        poster="https://picsum.photos/seed/esimedia-hero/960/540"
                    >
                        <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                        Tu navegador no soporta el elemento <code>video</code>.
                    </video>
                </div>
            </div>
        </section>
    )
}
