import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { usePlaylistContext } from '../hooks/usePlaylistContext'
import { usePlaylistNavigation } from '../hooks/usePlaylistNavigation'
import RatingStars from '../customcomponents/RatingStars'
import PlaylistControls from '../components/PlaylistControls'
import FavoriteButton from '../components/FavoriteButton'
import AddToListButton from '../components/AddToListButton'
import { AddToListModal } from '../components/AddToListModal'
import Combobox, { type ComboboxOption } from '../customcomponents/Combobox'
import PremiumAd from '../customcomponents/PremiumAd'
import { log } from '../config/logConfig'
import { getContentById, registerView, getContentPlayUrl } from '../services/contentPlayService'
import { detectVideoProvider, getYouTubeEmbedUrl, getVimeoEmbedUrl } from '../utils/videoPlayerUtils'
import { formatViews, formatDateLong, getQualityOptions } from '../utils/formatUtils'
import ListReproducer from '../components/ListReproducer'
import '../styles/pages/PlayPage.css'

interface ContentItem {
  id: string
  title: string
  description: string
  contentUrl: string
  contentType: 'video' | 'audio'
  thumbnail: string
  duration: number
  maxQuality: string
  creator: {
    id: string
    name: string
    avatar: string
  }
  publishedAt: string
  views: number
  rating: number
  totalRatings: number
  isPremium: boolean
  tags: string[]
}

export default function PlayPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { id: contentId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const listId = searchParams.get('list')
  const indexParam = searchParams.get('index')
  const currentIndex = indexParam ? Number.parseInt(indexParam, 10) : 0
  
  // Nuevos parámetros para playlist desde favoritos
  const playlistType = searchParams.get('playlistType')
  const startIndexParam = searchParams.get('startIndex')
  const startIndex = startIndexParam ? Number.parseInt(startIndexParam, 10) : 0
  const playlistName = searchParams.get('playlistName')
  
  // Usar el índice correcto dependiendo del parámetro usado
  const activeIndex = currentIndex

  const [content, setContent] = useState<ContentItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedQuality, setSelectedQuality] = useState<string>('')

  // Estado del modal para añadir a lista
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)

  const [qualityOptions, setQualityOptions] = useState<ComboboxOption[]>([])

  // Cargar contexto del playlist con el hook personalizado
  const { playlistData } = usePlaylistContext(listId, playlistType, currentIndex, t)

  useEffect(() => {
    const loadContent = async () => {
      if (!contentId) {
        setError('ID de contenido no válido')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Cargar contenido
        const contentData = await getContentById(contentId)
        
        // Convertir a formato de la interfaz local
        const mappedContent: ContentItem = {
          id: contentData.id,
          title: contentData.title,
          description: contentData.description,
          contentUrl: contentData.contentUrl,
          contentType: contentData.contentType.toLowerCase() as 'video' | 'audio',
          thumbnail: contentData.thumbnailUrl || '',
          duration: contentData.durationMinutes,
          maxQuality: contentData.maxQuality,
          creator: {
            id: contentData.creatorId,
            name: contentData.creatorName,
            avatar: contentData.creatorAvatar || ''
          },
          publishedAt: contentData.publishedAt,
          views: contentData.viewCount,
          rating: 0, // Por ahora sin rating
          totalRatings: 0, // Por ahora sin rating
          isPremium: contentData.vipOnly,
          tags: contentData.tags
        }
        
        setContent(mappedContent)
        
        // Configurar opciones de calidad para videos
        if (mappedContent.contentType === 'video') {
          const maxQuality = mappedContent.maxQuality
          const options = getQualityOptions(maxQuality)
          
          setQualityOptions(options)
          
          // Si el usuario NO es premium y el video es 4K, seleccionar 1080p
          if (!mappedContent.isPremium && maxQuality.toLowerCase() === '4k') {
            setSelectedQuality('1080p')
          } else {
            setSelectedQuality(maxQuality.toLowerCase())
          }
        }
        
        // Registrar visualización
        try {
          await registerView(contentId)
          log('info', 'Vista registrada para contenido:', contentId)
        } catch (error_) {
          log('warn', 'No se pudo registrar la vista:', error_)
          // No bloqueamos la reproducción si falla el registro de vista
        }

        log('info', 'Content loaded:', { contentId, listId })
      } catch (err: any) {
        log('error', 'Failed to load content:', err)
        const errorMsg = t('error.contentLoadFailed')
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [contentId, listId, playlistType])


  // Usar el hook de navegación de playlist
  const { handleNext, handlePrevious, handleContentEnd, hasPrevious, hasNext } = usePlaylistNavigation({
    playlistData,
    activeIndex,
    playlistType,
    listId,
    playlistName
  })

  // Listener para auto-play al terminar el contenido
  useEffect(() => {
    if (!content || !playlistData) return

    // Para video HTML5
    const videoElement = document.querySelector('video')
    if (videoElement) {
      videoElement.addEventListener('ended', handleContentEnd)
      return () => videoElement.removeEventListener('ended', handleContentEnd)
    }

    // Para audio
    const audioElement = document.querySelector('audio')
    if (audioElement) {
      audioElement.addEventListener('ended', handleContentEnd)
      return () => audioElement.removeEventListener('ended', handleContentEnd)
    }
  }, [content, playlistData, activeIndex, handleContentEnd])

  const renderPlayer = (content: ContentItem) => {
    if (content.contentType === 'video') {
      const provider = detectVideoProvider(content.contentUrl)

      if (provider.type === 'youtube' && provider.id) {
        return (
          <div className="player-container">
            <iframe
              src={getYouTubeEmbedUrl(provider.id)}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-player"
            />
          </div>
        )
      }

      if (provider.type === 'vimeo' && provider.id) {
        return (
          <div className="player-container">
            <iframe
              src={getVimeoEmbedUrl(provider.id)}
              title={content.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="video-player"
            />
          </div>
        )
      }

      return (
        <div className="player-container">
          <video controls className="video-player" aria-label="Video player">
            <source src={content.contentUrl} type="video/mp4" />
            <track kind="captions" srcLang="en" label="No captions available" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      )
    }

    // Audio player
    return (
      <div className="player-container audio-player">
        <audio controls className="audio-element" aria-label="Audio player">
          <source src={getContentPlayUrl(content.contentUrl)} type="audio/mpeg" />
          <track kind="captions" srcLang="en" label="No captions available" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="play-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="play-page">
        <div className="error-container">
          <h2>{t('error.title')}</h2>
          <p>{error || t('error.contentNotFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="play-page">
      <div className="play-container">
        {/* Controles de playlist (si estamos en modo playlist) */}
        {playlistData && (
          <PlaylistControls
            listId={playlistData.listId}
            listName={playlistData.listName}
            currentIndex={playlistData.currentIndex}
            totalItems={playlistData.contentIds.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        )}

        <div className="main-player">
          <div className="player-section">
            {renderPlayer(content)}
            <PremiumAd />
          </div>

          <div className="content-info">
            <div className="content-title-container">
              <h1 className="content-title">{content.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {content.contentType === 'video' && (
                  <Combobox
                    value={selectedQuality}
                    options={qualityOptions}
                    onChange={setSelectedQuality}
                    className="small-combobox"
                  />
                )}
                <span className={`content-type-badge badge badge-md ${content.isPremium ? 'badge-premium' : 'badge-standard'}`}>
                  {content.isPremium ? t('common.premium') : t('creator.upload.standard')}
                </span>
                <AddToListButton contentId={content.id} size="large" onClick={() => setIsAddToListModalOpen(true)} />
                <FavoriteButton contentId={content.id} size="large" />
              </div>
            </div>

            {content.totalRatings > 0 && (
              <div className="average-rating">
                <RatingStars value={content.rating} />
                <span className="rating-text">
                  {content.rating.toFixed(1)} ({content.totalRatings} {t('play.ratings')})
                </span>
              </div>
            )}

            <div className="content-meta">
              <div className="meta-left">
                <span className="views">{formatViews(content.views)} {t('play.views')}</span>
                <span className="separator">•</span>
                <span className="published-date">{formatDateLong(content.publishedAt)}</span>
              </div>
            </div>

            <hr />

            {/* User Rating - comentado por ahora
            <div className="user-rating">
              <h3>{t('play.yourRating')}</h3>
              <div className="rating-input">
                <RatingStars
                  value={0}
                  interactive={true}
                  userRating={userRating}
                  onRatingChange={handleRatingSubmit}
                />
                {userRating > 0 && (
                  <span className="user-rating-text">
                    {t('play.youRated')} {userRating} {t('play.stars')}
                  </span>
                )}
              </div>
            </div>
            */}

            <div className="creator-info">
              {content.creator.avatar && (
                <img
                  src={content.creator.avatar}
                  className="creator-avatar"
                />
              )}
              <div className="creator-details">
                <h3 className="creator-name">{content.creator.name}</h3>
                <p className="content-description">{content.description}</p>
              </div>
            </div>

            {content.tags.length > 0 && (
              <div className="content-tags">
                {content.tags.map((tag) => (
                  <button
                    key={tag}
                    className="tag-button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    aria-label={`Buscar contenido con el tag ${tag}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para añadir a lista personalizada */}
      {content && (
        <AddToListModal
          isOpen={isAddToListModalOpen}
          onClose={() => setIsAddToListModalOpen(false)}
          contentId={content.id}
          contentTitle={content.title}
          onSuccess={() => {
            // Opcional: mostrar mensaje de éxito o recargar datos
            log('info', 'Content added to list successfully')
          }}
        />
      )}
    </div>
  )
}