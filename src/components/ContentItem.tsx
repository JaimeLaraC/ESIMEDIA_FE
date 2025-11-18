// src/components/ContentItem.tsx
import { useI18n } from '../hooks/useI18n'
import { formatNumber, formatDate } from '../utils/creatorUtils'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'

interface Content {
  id: string
  title: string
  thumbnail: string
  views: number
  duration: string
  publishedAt: string
  rating: number
  isVisible: boolean
  isPremium: boolean
}

interface ContentItemProps {
  readonly content: Content
  readonly showVisibilityToggle?: boolean
}

export default function ContentItem({ 
  content, 
  showVisibilityToggle = false 
}: ContentItemProps) {
  const { t } = useI18n()

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultVideoImage
  }

  return (
    <div className="content-list-item">
      <div className="content-thumbnail-small">
        <img 
          src={content.thumbnail} 
          alt={content.title} 
          onError={handleImageError}
        />
        <span className="content-duration-small">{content.duration}</span>
      </div>

      <div className="content-info">
        <h4 className="content-title">{content.title}</h4>
        <div className="content-metadata">
          <span className="content-views">{formatNumber(content.views)} {t('creator.content.views')}</span>
          <span className="content-date">{formatDate(content.publishedAt)}</span>
          <span className="content-rating">⭐ {content.rating}</span>
        </div>
      </div>

      <div className="content-actions" style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        alignItems: 'center',
        flexWrap: 'wrap' 
      }}>
        {/* Badge de visibilidad (solo informativo para creadores) */}
        {showVisibilityToggle && (
          <div
            className={`premium-badge ${content.isVisible ? 'visible' : 'hidden'}`}
            title={content.isVisible 
              ? 'Contenido visible para todos los usuarios' 
              : 'Contenido oculto, solo visible para ti'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              {content.isVisible ? (
                // Icono de ojo abierto (visible)
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
              ) : (
                // Icono de ojo cerrado (oculto)
                <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
              )}
            </svg>
            <span>{content.isVisible ? 'Visible' : 'Oculto'}</span>
          </div>
        )}

        {/* Badge Premium/Gratis */}
        <div
          className={`premium-badge ${content.isPremium ? 'premium' : 'free'}`}
          title={content.isPremium ? t('creator.content.premium') : t('creator.content.free')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
          </svg>
          <span>{content.isPremium ? 'Premium' : 'Gratis'}</span>
        </div>
      </div>
    </div>
  )
}