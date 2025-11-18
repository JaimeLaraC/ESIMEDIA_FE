// src/components/SortableFavoriteItem.tsx

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type ContentDetails } from '../services/favoriteService'
import RatingStars from '../customcomponents/RatingStars'

interface SortableItemProps {
  id: string
  index: number
  isEditing: boolean // Nuevo prop para mostrar el mango de arrastre
  details: ContentDetails | undefined
  thumbnailUrl: string | null
  iconName: string
  title: string
  typeLabel: string
  handlePlayContent: (id: string) => void
  handleRemoveFavorite: (id: string) => void
}

export default function SortableFavoriteItem({
  id,
  index,
  isEditing,
  details,
  thumbnailUrl,
  iconName,
  title,
  typeLabel,
  handlePlayContent,
  handleRemoveFavorite,
}: SortableItemProps) {
  
  // Hook clave de dnd-kit
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
    // CLAVE: Asegura que el elemento sea arrastrable incluso si es un botón
    touchAction: 'none' as const
  }
  
  // Renderizado del elemento:
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="list-item favorites-list-item sortable-item"
      data-editing={isEditing}
    >
      <span className="list-item-index favorites-item-index">{index + 1}.</span>
      
      {/* Mango de arrastre (Visible solo en modo edición) */}
      {isEditing && (
        <div 
          className="favorites-drag-handle" 
          {...listeners} // Escuchadores para el arrastre
          {...attributes} // Atributos para accesibilidad
          title="Arrastrar para reordenar"
        >
          <span className="material-symbols-outlined">drag_handle</span>
        </div>
      )}
      
      {/* Contenido principal (Botón de Reproducción/Clic) */}
      <button 
        className="favorites-main-button" 
        type="button"
        // El clic solo funciona si NO estamos editando
        onClick={() => !isEditing && handlePlayContent(id)}
      >
        {/* Tu código para el thumbnail */}
        <div className="favorites-thumbnail">
          {thumbnailUrl ? (
            <>
              <img 
                src={thumbnailUrl} 
                alt={title} 
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.closest('.favorites-thumbnail')?.querySelector('.favorites-thumbnail-placeholder');
                  if (placeholder) {
                    (placeholder as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              {/* El placeholder oculto, listo para el onError */}
              <div className="favorites-thumbnail-placeholder" style={{ display: 'none' }}>
                <span className="material-symbols-outlined">{iconName}</span>
              </div>
            </>
          ) : (
            // Si NO hay URL, muestra solo el placeholder
            <div className="favorites-thumbnail-placeholder">
              <span className="material-symbols-outlined">{iconName}</span>
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="list-item-details favorites-item-details">
            <div className="favorites-col">
                <span className="list-item-title favorites-item-title">{title}</span>
                <span className="list-item-type favorites-item-type">{typeLabel}</span>
            </div>
            <div className="favorites-col">
                {details?.creatorName && (
                    <span className="favorites-creator-name">{details.creatorName}</span>
                )}
                <div className="favorites-rating">
                    <RatingStars value={details?.averageRating || 0} />
                    <span>({details?.ratingCount || 0})</span>
                </div>
                <span className="favorites-duration">{details?.duration || '0:00'}</span>
            </div>
        </div>
      </button>

      {/* Acciones (Solo visible si NO estamos editando, o si solo es el botón de eliminar) */}
      <div className="list-item-actions favorites-item-actions">
          {!isEditing && ( // Mostrar el botón de eliminar solo fuera del modo edición
             <button
                className="list-btn-remove favorites-btn-remove"
                onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFavorite(id)
                }}
                title="Quitar de favoritos"
             >
                <span className="material-symbols-outlined">favorite</span>
             </button>
          )}
      </div>
    </div>
  )
}