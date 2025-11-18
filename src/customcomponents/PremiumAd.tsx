import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'
import '../styles/customcomponents/PremiumAd.css'

/**
 * Props para el componente PremiumAd.
 */
interface PremiumAdProps {
  /** Clases CSS adicionales para personalización */
  readonly className?: string
}

/**
 * Componente de publicidad para promocionar la suscripción Premium.
 *
 * Solo se muestra para usuarios no premium y destaca los beneficios
 * de actualizar a Premium. Incluye navegación al perfil para upgrade.
 *
 * Características:
 * - Renderizado condicional basado en estado premium del usuario
 * - Lista de beneficios con iconos
 * - Botón de acción para upgrade
 * - Texto de disclaimer
 * - Soporte completo para internacionalización
 *
 * @component
 * @param {PremiumAdProps} props - Props del componente
 * @example
 * ```tsx
 * <PremiumAd className="my-custom-class" />
 * ```
 *
 * @example
 * ```tsx
 * <PremiumAd /> // Sin clases adicionales
 * ```
 */
export default function PremiumAd({ className = '' }: PremiumAdProps) {
  const { t } = useI18n()
  const { user, subscription } = useApp()
  const navigate = useNavigate()

  // Solo mostrar para usuarios no premium
  if (!user || subscription.isPremium) {
    return null
  }

  /**
   * Maneja el click en el botón de upgrade.
   * Actualmente navega al perfil del usuario.
   * En el futuro podría abrir un modal de upgrade.
   *
   * @private
   */
  const handleUpgradeClick = () => {
    // Por ahora solo navega al perfil, luego se implementará el modal
    navigate(`/profile/${user.id}`)
  }

  return (
    <div className={`premium-ad ${className}`}>
      <div className="premium-ad__content">
        <div className="premium-ad__header">
          <div className="premium-ad__icon">⭐</div>
          <h3 className="premium-ad__title">
            {t('header.premium.ad.title') || '¡Actualiza a Premium!'}
          </h3>
        </div>

        <div className="premium-ad__body">
          <ul className="premium-ad__benefits">
            <li className="premium-ad__benefit">
              <span className="premium-ad__benefit-icon">🎥</span>
              <span>{t('header.premium.ad.benefit1') || 'Calidad 4K Ultra HD'}</span>
            </li>
            <li className="premium-ad__benefit">
              <span className="premium-ad__benefit-icon">📱</span>
              <span>{t('header.premium.ad.benefit2') || 'Sin anuncios'}</span>
            </li>
            <li className="premium-ad__benefit">
              <span className="premium-ad__benefit-icon">⬇️</span>
              <span>{t('header.premium.ad.benefit3') || 'Descargas ilimitadas'}</span>
            </li>
            <li className="premium-ad__benefit">
              <span className="premium-ad__benefit-icon">🎵</span>
              <span>{t('header.premium.ad.benefit4') || 'Contenido exclusivo'}</span>
            </li>
          </ul>
        </div>

        <div className="premium-ad__footer">
          <button
            className="premium-ad__upgrade-btn"
            onClick={handleUpgradeClick}
            aria-label={t('header.premium.ad.upgradeButton') || 'Actualizar a Premium'}
          >
            {t('header.premium.ad.upgradeButton') || '¡Hazte Premium Ahora!'}
          </button>
          <p className="premium-ad__disclaimer">
            {t('header.premium.ad.disclaimer') || 'Cancela cuando quieras'}
          </p>
        </div>
      </div>
    </div>
  )
}