import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FavoriteService, type ContentDetails } from '../services/favoriteService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../context/I18nContextHooks'
import RatingStars from '../customcomponents/RatingStars'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'
import '../styles/pages/ListDetailPage.css'
import '../styles/pages/FavoritesDetailPage.css'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { 
  DndContext, 
  closestCenter, 
  useSensor, 
  useSensors, 
  PointerSensor,
  type DragEndEvent 
} from '@dnd-kit/core';
import SortableFavoriteItem from '../components/SortableFavoriteItem'
/**
 * Componente que muestra la página de detalles de favoritos del usuario.
 * Permite ver, reproducir y eliminar contenidos favoritos organizados en una lista.
 * Incluye información detallada como título, tipo, creador, valoración y duración.
 */
export default function FavoritesDetailPage() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [initialFavoriteIds, setInitialFavoriteIds] = useState<string[]>([])
  const [contentDetails, setContentDetails] = useState<Map<string, ContentDetails>>(new Map())
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)
  const [loading, setLoading] = useState(true)
  const sensors = useSensors(
      useSensor(PointerSensor, { 
        // Permite arrastrar solo si el ratón se mueve 5px
        activationConstraint: { distance: 5 } 
      })
    )
  useEffect(() => {
    loadFavorites()
  }, [])

  /**
   * Carga la lista de IDs de favoritos del usuario y obtiene los detalles de contenido.
   * Actualiza el estado de carga y maneja errores mostrando notificaciones.
   */
const loadFavorites = useCallback(async () => {    try {
      setLoading(true)
      const ids = await FavoriteService.getFavorites()
      setFavoriteIds(ids)
      setInitialFavoriteIds(ids)
      log('info', 'Favorites loaded:', ids.length)
      
      if (ids.length > 0) {
        await loadContentDetails(ids)
      }
    } catch (error) {
      log('error', 'Error loading favorites:', error)
      toast.error(t('favoritesPage.toast.loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  // ----------------------------------------------------------------------
  // Lógica de Edición y Guardado
  // ----------------------------------------------------------------------

  const handleToggleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Restaurar el orden inicial y salir del modo edición
    setFavoriteIds(initialFavoriteIds) 
    setIsEditing(false)
  }
  
  const handleSaveOrder = async () => {
    // Si no hay cambios, simplemente salimos del modo edición
    if (favoriteIds.length === initialFavoriteIds.length && 
        favoriteIds.every((id, index) => id === initialFavoriteIds[index])) {
      setIsEditing(false)
      return
    }

    try {
      setIsUpdatingOrder(true)
      
      // Llamar al API con el orden actual
      const updatedIds = await FavoriteService.reorderFavorites(favoriteIds)
      
      // Actualizar el orden inicial para futuros cambios
      setInitialFavoriteIds(updatedIds)
      setIsEditing(false)
      toast.success(t('favoritesPage.toast.reordered'))
    } catch (error) {
      log('error', 'Error saving reorder:', error)
      toast.error(t('favoritesPage.toast.reorderError'))
      
      // Rollback: restaurar el orden inicial si falla
      setFavoriteIds(initialFavoriteIds)
      setIsEditing(false)
    } finally {
      setIsUpdatingOrder(false)
    }
  }

  // Lógica de Drag & Drop (Solo actualiza el estado local)
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = favoriteIds.indexOf(active.id as string)
      const newIndex = favoriteIds.indexOf(over.id as string)
      
      setFavoriteIds((ids) => arrayMove(ids, oldIndex, newIndex))
    }
  }, [favoriteIds])

  /**
   * Carga los detalles de contenido para una lista de IDs de contenido.
   * Actualiza el mapa de detalles de contenido en el estado.
   * @param {string[]} contentIds - Array de IDs de contenido a cargar.
   */
  const loadContentDetails = async (contentIds: string[]) => {
    try {
      const detailsMap = await FavoriteService.getContentDetailsBatch(contentIds)
      setContentDetails(detailsMap)
    } catch (error) {
      log('error', 'Error loading content details:', error)
    }
  }

  /**
   * Maneja la eliminación de un contenido de favoritos.
   * Muestra una notificación de éxito o error y recarga la lista.
   * @param {string} contentId - ID del contenido a eliminar de favoritos.
   */
  const handleRemoveFavorite = async (contentId: string) => {
    try {
      await FavoriteService.removeFavorite(contentId)
      toast.success(t('favoritesPage.toast.removed'))
      loadFavorites()
    } catch (error) {
      toast.error(t('favoritesPage.toast.removeError'))
    }
  }

  /**
   * Navega a la página de reproducción del contenido especificado.
   * @param {string} contentId - ID del contenido a reproducir.
   */
  const handlePlayContent = (contentId: string) => {
    navigate(`/play/${contentId}?playlistType=favorites&playlistName=${encodeURIComponent(t('favorites.listTitle'))}`)
  }

  /**
   * Genera la URL del thumbnail para un archivo dado.
   * @param {string | undefined} thumbnailPath - Ruta del thumbnail desde el backend.
   * @returns {string | null} URL del thumbnail o null si no existe (para usar fallback).
   */
  const getThumbnailUrl = (thumbnailPath: string | undefined) => {
    // Si no hay thumbnail o está vacío, devolver null para que use el fallback local
    if (!thumbnailPath || thumbnailPath.trim() === '') return null;

    // El backend devuelve "/content/thumbnail/ID"
    // Transformar a "/api/content/thumbnail/ID" para el API Gateway
    if (thumbnailPath.startsWith('/')) {
        const apiPath = thumbnailPath.startsWith('/content/') ? `/api${thumbnailPath}` : thumbnailPath
        return `${import.meta.env.VITE_USERS_API_URL}${apiPath}`;
    }
    
    return thumbnailPath; // Si ya es una URL completa
  }

  if (loading) {
    return (
      <div className="list-detail-container">
        <div className="list-loading">
          <div className="list-spinner"></div>
          <p className="list-loading-text">{t('favoritesPage.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-detail-container">

      {/* Header */}
      <div className="list-header-card">
        <div className="list-header-content">
          <div className="list-header-info">
            <h1 className="list-title">
              <span 
                className="material-symbols-outlined favorites-header-icon"
              >
              </span>
              {t('favoritesPage.title')}
            </h1>
            <p className="list-description">
              {t('favoritesPage.description')}
            </p>
            <div className="list-meta">
              <div className="list-meta-item">
                <span className="material-symbols-outlined">list</span>
                <span>{favoriteIds.length} {favoriteIds.length === 1 ? t('favoritesPage.meta.item') : t('favoritesPage.meta.items')}</span>
              </div>
              <div className="list-meta-item">
                <span className="material-symbols-outlined">star</span>
                <span>{t('favoritesPage.meta.special')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de favoritos */}
      <div className="list-content-card">
        <div className="list-content-header">
          <h2 className="list-content-title">
            <span>{t('favoritesPage.content.title')}</span>
            <span className="list-content-count">({favoriteIds.length})</span>
          </h2>
          {/* 🌟 GRUPO DE BOTONES DE EDICIÓN (REEMPLAZO) */}
          <div className="favorites-actions-group">
            
            {/* 1. Botón Editar (Si hay items y NO estamos editando) */}
            {favoriteIds.length > 0 && !isEditing && (
                <button
                    className="list-btn list-btn-secondary"
                    onClick={handleToggleEdit} // Activa el modo edición
                    title={t('favoritesPage.editOrder') || 'Editar orden'}
                >
                    <span className="material-symbols-outlined">edit</span>
                    {t('favoritesPage.editOrder') || 'Editar'}
                </button>
            )}

            {/* 2. Botones Guardar/Cancelar (SOLO en modo edición) */}
            {isEditing && (
                <>
                    <button
                        className="list-btn list-btn-secondary"
                        onClick={handleCancelEdit} // Cancela y restaura el orden
                        disabled={isUpdatingOrder}
                    >
                        <span className="material-symbols-outlined">close</span>
                        {t('favoritesPage.cancel') || 'Cancelar'}
                    </button>
                    <button
                        className="list-btn list-btn-primary"
                        onClick={handleSaveOrder} // Guarda el orden en el backend
                        disabled={isUpdatingOrder}
                    >
                        {isUpdatingOrder ? (
                            <span className="list-spinner small"></span>
                        ) : (
                            <span className="material-symbols-outlined">save</span>
                        )}
                        {t('favoritesPage.save') || 'Guardar'}
                    </button>
                </>
            )}

            {/* 3. Botón Reproducir Todo (Visible solo si hay items y NO estamos editando) */}
            {favoriteIds.length > 0 && !isEditing && (
              <button
                className="list-btn list-btn-secondary list-play-all-btn"
                onClick={() => navigate(`/play/${favoriteIds[0]}?playlistType=favorites&index=0&playlistName=${encodeURIComponent(t('favorites.listTitle'))}`)}
                title={t('favoritesPage.playAll')}
              >
                <span className="material-symbols-outlined">play_circle</span>
                {t('favoritesPage.playAll')}
              </button>
            )}
          </div>
        </div>
        <div className="list-content-body">
          {favoriteIds.length === 0 ? (
            <div className="list-empty-state">
              <div className="list-empty-icon">
                <span className="material-symbols-outlined">favorite_border</span>
              </div>
              <h3 className="list-empty-title">{t('favoritesPage.empty.title')}</h3>
              <p className="list-empty-subtitle">
                {t('favoritesPage.empty.subtitle')}
              </p>
              <button
                className="list-btn list-btn-primary"
                onClick={() => navigate('/search')}
              >
                {t('favoritesPage.empty.exploreButton')}
              </button>
            </div>
          ) : (
            // 🌟 CAMBIO 2: LISTA CON DRAG & DROP
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd} 
            >
              <SortableContext
                items={favoriteIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="list-items">
                  {favoriteIds.map((contentId, index) => {
                    // (Tu lógica de 'details', 'thumbnailUrl', 'iconName', etc.)
                    const details = contentDetails.get(contentId);
                    const thumbnailUrl = getThumbnailUrl(details?.thumbnailUrl);
                    let iconName = 'movie';
                    if (details?.contentType === 'AUDIO') { iconName = 'music_note'; }
                    const title = details?.title || 'Contenido';
                    let typeLabel = t('favoritesPage.contentTypes.content');
                    if (details?.contentType === 'VIDEO') { typeLabel = t('favoritesPage.contentTypes.video'); }
                    else if (details?.contentType === 'AUDIO') { typeLabel = t('favoritesPage.contentTypes.audio'); }

                    {/* RENDERIZADO CONDICIONAL DEL ITEM */}
                    if (isEditing) {
                      // Si estamos editando, renderiza el item arrastrable
                      return (
                        <SortableFavoriteItem
                          key={contentId}
                          id={contentId}
                          index={index}
                          isEditing={isEditing}
                          details={details}
                          thumbnailUrl={thumbnailUrl}
                          iconName={iconName}
                          title={title}
                          typeLabel={typeLabel}
                          handlePlayContent={handlePlayContent}
                          handleRemoveFavorite={handleRemoveFavorite}
                        />
                      )
                    } else {
                      // Si NO estamos editando, renderiza el botón simple original
                      return (
                        <button 
                          key={contentId} 
                          className="list-item favorites-list-item"
                          type="button"
                          onClick={() => handlePlayContent(contentId)}
                        >
                          {/* (Pega aquí el JSX de tu <button> original de la línea 226-278) */}
                          <span className="list-item-index favorites-item-index">{index + 1}.</span>
                          <div className="favorites-thumbnail">
                            {thumbnailUrl ? (
                              // ✅ CORREGIDO: Envuelto en un Fragmento (<> ... </>)
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
                          <div className="list-item-actions favorites-item-actions">
                            <button
                              className="list-btn-play-item favorites-btn-play-item"
                              onClick={(e) => { e.stopPropagation(); handlePlayContent(contentId); }}
                              title="Reproducir este contenido"
                            ><span className="material-symbols-outlined">play_circle</span></button>
                            <button
                              className="list-btn-remove favorites-btn-remove"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(contentId); }}
                              title="Quitar de favoritos"
                            ><span className="material-symbols-outlined">favorite</span></button>
                          </div>
                        </button>
                      )
                    }
                  })}
                </div>
              </SortableContext>
            </DndContext>
            // 🌟 FIN DE CAMBIO 2
            
          )}
        </div>
      </div>
    </div>
  )
}