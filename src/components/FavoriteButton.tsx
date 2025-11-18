import { useState, useEffect } from 'react'
import { FavoriteService } from '../services/favoriteService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../hooks/useI18n'
import '../styles/components/FavoriteButton.css'

interface FavoriteButtonProps {
  contentId: string
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  onToggle?: (isFavorite: boolean) => void
}

export default function FavoriteButton({ 
  contentId, 
  size = 'medium',
  showLabel = false,
  onToggle
}: FavoriteButtonProps) {
  const { t } = useI18n()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkFavoriteStatus()
  }, [contentId])

  const checkFavoriteStatus = async () => {
    try {
      const status = await FavoriteService.isFavorite(contentId)
      setIsFavorite(status)
    } catch (error) {
      log('error', 'Error checking favorite status:', error)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    try {
      setLoading(true)
      
      if (isFavorite) {
        await FavoriteService.removeFavorite(contentId)
        setIsFavorite(false)
        toast.success(t('favorite.removed') || 'Removed from favorites')
        onToggle?.(false)
      } else {
        await FavoriteService.addFavorite(contentId)
        setIsFavorite(true)
        toast.success(t('favorite.added') || 'Added to favorites')
        onToggle?.(true)
      }
    } catch (error) {
      log('error', 'Error toggling favorite:', error)
      toast.error(t('favorite.error') || 'Error updating favorites')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`favorite-btn favorite-btn-${size} ${isFavorite ? 'is-favorite' : ''} ${loading ? 'is-loading' : ''}`}
      onClick={handleToggleFavorite}
      disabled={loading}
      title={isFavorite ? (t('favorite.removeTitle') || 'Remove from favorites') : (t('favorite.addTitle') || 'Add to favorites')}
    >
      <span 
        className="material-symbols-outlined"
        style={{ 
          fontVariationSettings: isFavorite ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        }}
      >
        favorite
      </span>
      {showLabel && (
        <span className="favorite-btn-label">
          {t('favorite.label') || 'Favorite'}
        </span>
      )}
    </button>
  )
}