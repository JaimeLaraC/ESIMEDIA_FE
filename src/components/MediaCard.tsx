// src/components/MediaCard.tsx
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import RatingStars from '../customcomponents/RatingStars'
import type { MediaItem } from './MediaSection'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'
import '../styles/components/MediaCard.css'

export default function MediaCard({ item, kind, isPremium = false, creator, rating, ratingCount, duration }: Readonly<{ item: MediaItem, kind: 'video' | 'audio', isPremium?: boolean, creator: string, rating: number, ratingCount: number, duration?: string }>) {
    const navigate = useNavigate()
    const { t } = useI18n()
    const d = new Date(item.addedAt)
    const dateStr = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })

    const handleClick = () => {
        navigate(`/play/${item.id}`)
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        // Usar imágenes de fallback locales en lugar de SVG generado dinámicamente
        e.currentTarget.src = kind === 'audio' ? defaultAudioImage : defaultVideoImage
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <button 
            className="card card-media" 
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0, width: '100%' }}
            aria-label={`Ver ${kind} ${item.title}`}
        >
            {/* Contenedor de imagen con badge */}
            <div className="card-image-container">
                {/* Badge Premium */}
                {isPremium && (
                    <div className="badge badge-premium card-premium-badge">
                        {t('header.userTypes.premium')}
                    </div>
                )}
                
                {/* Badge Duración */}
                <div className="badge badge-duration card-duration-badge">
                    {duration || '0:00'}
                </div>
                
                <img 
                    className="thumb" 
                    src={item.thumbnail} 
                    alt={`${kind} ${item.title}`}
                    onError={handleImageError}
                />
            </div>
            <div className="card-body">
                <h3 className="card-title" title={item.title}>{item.title}</h3>
                
                {/* Creador */}
                <div className="card-creator">
                    {t('search.creator')}: {creator || 'Desconocido'} {/* Campo 'creator' debe venir del backend - actualmente no implementado */}
                </div>
                
                {/* Rating y meta info */}
                <div className="card-rating-meta">
                    <div className="card-rating">
                        <RatingStars value={rating} interactive={false} />
                        <span className="rating-count">({ratingCount || 0})</span>
                    </div>
                    <div className="meta">
                        <span>{dateStr}</span>
                    </div>
                </div>
            </div>
        </button>
    )
}