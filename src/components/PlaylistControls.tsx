import { useNavigate } from 'react-router-dom'
import '../styles/components/PlaylistControls.css'

interface PlaylistControlsProps {
  listId: string
  listName: string
  currentIndex: number
  totalItems: number
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export default function PlaylistControls({
  listId,
  listName,
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: PlaylistControlsProps) {
  const navigate = useNavigate()

  return (
    <div className="playlist-controls">
      {/* Left: Info */}
      <div className="playlist-info">
        <span className="playlist-label">Reproduciendo desde: </span>
        <span className="playlist-name">{listName}</span>
      </div>

      {/* Right: Navigation + Ver Lista */}
      <div className="playlist-actions">
        <button
          className="playlist-nav-btn"
          onClick={onPrevious}
          disabled={!hasPrevious}
          title="Anterior"
          aria-label="Anterior"
        >
          <span className="material-icons-outlined">skip_previous</span>
        </button>

        <span className="playlist-counter">
          {currentIndex + 1} / {totalItems}
        </span>

        <button
          className="playlist-nav-btn"
          onClick={onNext}
          disabled={!hasNext}
          title="Siguiente"
          aria-label="Siguiente"
        >
          <span className="material-icons-outlined">skip_next</span>
        </button>

        <div className="playlist-separator"></div>

        <button
          className="playlist-view-list"
          onClick={() => navigate(`/lists/${listId}`)}
          title="Volver a ver la lista completa"
        >
          Ver Lista Completa
        </button>
      </div>
    </div>
  )
}
