import { useState } from 'react'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../hooks/useI18n'
import '../styles/components/AddToListButton.css'

interface AddToListButtonProps {
  readonly contentId: string
  readonly size?: 'small' | 'medium' | 'large'
  readonly showLabel?: boolean
  readonly onClick?: () => void
}

export default function AddToListButton({ 
  contentId: _contentId,
  size = 'medium',
  showLabel = false,
  onClick
}: AddToListButtonProps) {
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)

  const handleAddToList = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    try {
      setLoading(true)
      
      // TODO: Implementar lógica para añadir a lista personalizada
      // Por ahora, solo mostrar un toast
      toast.info(t('list.addToList') || 'Add to list functionality coming soon')
      
      onClick?.()
    } catch (error) {
      log('error', 'Error adding to list:', error)
      toast.error(t('list.error') || 'Error adding to list')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`add-to-list-btn add-to-list-btn-${size} ${loading ? 'is-loading' : ''}`}
      onClick={handleAddToList}
      disabled={loading}
      title={t('list.addTitle') || 'Add to personal list'}
    >
      <span 
        className="material-symbols-outlined"
        style={{ 
          fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
        }}
      >
        add
      </span>
      {showLabel && (
        <span className="add-to-list-btn-label">
          {t('list.label') || 'Add to List'}
        </span>
      )}
    </button>
  )
}