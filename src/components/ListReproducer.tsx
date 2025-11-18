import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { FavoriteService } from '../services/favoriteService'
import { ContentListService } from '../services/contentListService'
import { log } from '../config/logConfig'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'
import '../styles/ListReproducer.css'

interface ListReproducerProps {
  /** ID de la lista que se está reproduciendo */
  readonly listId: string
  /** IDs de los contenidos en la lista */
  readonly contentIds: readonly string[]
  /** Índice del contenido actualmente reproduciéndose */
  readonly currentIndex: number
  /** Tipo de lista: 'favorites', 'private', 'public' */
  readonly listType: 'favorites' | 'private' | 'public'
}

/**
 * Componente para reproducir listas de contenido.
 * Muestra todos los elementos de la lista actual y permite navegar entre ellos.
 */
export default function ListReproducer({ listId, contentIds, currentIndex, listType }: ListReproducerProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [contentDetails, setContentDetails] = useState<Map<string, any>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [listName, setListName] = useState<string>('')

  // Cargar detalles de contenidos cuando cambian los IDs
  useEffect(() => {
    const loadContentDetails = async () => {
      if (contentIds.length === 0) return

      try {
        setIsLoading(true)
        let detailsMap: Map<string, any>

        if (listType === 'favorites') {
          // Para favoritos, usar el servicio de favoritos que ya tiene batch loading
          detailsMap = await FavoriteService.getContentDetailsBatch([...contentIds])
        } else {
          // Para listas normales, podríamos implementar batch loading similar
          // Por ahora, cargamos uno por uno (no óptimo pero funcional)
          detailsMap = new Map()
          for (const contentId of contentIds) {
            try {
              // Aquí podríamos implementar un batch endpoint, pero por ahora usamos individual
              // Como no tenemos endpoint batch para listas normales, mostramos placeholders
              detailsMap.set(contentId, {
                id: contentId,
                title: `Content ${contentId.slice(0, 8)}...`,
                thumbnailFileId: null,
                creatorName: 'Unknown',
                contentType: 'video'
              })
            } catch (error) {
              log('error', 'Error loading content detail:', contentId, error)
            }
          }
        }

        setContentDetails(detailsMap)
        log('info', `Loaded ${detailsMap.size} content details for list reproduction`)
      } catch (error) {
        log('error', 'Error loading content details for list:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContentDetails()
  }, [contentIds, listType])

  // Cargar el nombre de la lista cuando cambia el listId
  useEffect(() => {
    const loadListName = async () => {
      if (!listId || listType === 'favorites') return

      try {
        const listData = await ContentListService.getContentListById(listId)
        setListName(listData.nombre)
        log('info', `Loaded list name: ${listData.nombre}`)
      } catch (error) {
        log('error', 'Error loading list name:', error)
        // En caso de error, mantener el nombre vacío para usar el fallback
      }
    }

    loadListName()
  }, [listId, listType])

  /**
   * Maneja el clic en un elemento de la lista para reproducirlo
   */
  const handleItemClick = (index: number) => {
    const contentId = contentIds[index]
    if (contentId) {
      let url = `/play/${contentId}?list=${listId}&index=${index}&playlistType=${listType}`
      if (listName) {
        url += `&playlistName=${encodeURIComponent(listName)}`
      }
      log('info', 'Navigating to content in list:', { listId, contentId, index })
      navigate(url)
    }
  }

  /**
   * Obtiene la URL del thumbnail para un contenido
   */
  const getThumbnailUrl = (contentId: string): string => {
    const detail = contentDetails.get(contentId)
    if (detail?.thumbnailFileId) {
      return `${import.meta.env.VITE_USERS_API_URL}/api/content/thumbnail/${detail.thumbnailFileId}`
    }
    // Usar imagen por defecto según el tipo de contenido
    return detail?.contentType === 'AUDIO' ? defaultAudioImage : defaultVideoImage
  }

  /**
   * Obtiene el título de la lista según su tipo
   */
  const getListTitle = (): string => {
    // Para listas de favoritos, usar traducción
    if (listType === 'favorites') {
      return t('favoritesPage.listTitle')
    }

    // Para otras listas, usar el nombre real si está disponible
    if (listName) {
      return listName
    }

    // Fallback a traducciones genéricas
    if (listType === 'private') {
      return t('lists.privateList')
    }

    return t('lists.publicList')
  }

  if (contentIds.length === 0) {
    return null // No mostrar si no hay lista
  }

  return (
    <div className="list-reproducer">
      <div className="list-reproducer-header">
        <h4 className="list-reproducer-title">
          {getListTitle()}
        </h4>
        <span className="list-reproducer-count">
          {currentIndex + 1} / {contentIds.length}
        </span>
      </div>

      <div className="list-reproducer-items">
        {contentIds.map((contentId, index) => {
          const detail = contentDetails.get(contentId)
          const isCurrent = index === currentIndex

          return (
            <button
              key={contentId}
              className={`list-reproducer-item ${isCurrent ? 'current' : ''}`}
              onClick={() => handleItemClick(index)}
              type="button"
              aria-label={`${t('play.playlistItems')} ${detail?.title || (t('common.content') + ' ' + (index + 1))}`}
            >
              <div className="item-thumbnail">
                {isLoading ? (
                  <div className="thumbnail-placeholder">
                    <div className="loading-spinner small"></div>
                  </div>
                ) : (
                  <img
                    src={getThumbnailUrl(contentId)}
                    alt={detail?.title || `${t('common.content')} ${index + 1}`}
                    onError={(e) => {
                      // Fallback a imagen por defecto según el tipo de contenido
                      const img = e.target as HTMLImageElement
                      img.src = detail?.contentType === 'AUDIO' ? defaultAudioImage : defaultVideoImage
                    }}
                  />
                )}
                {isCurrent && (
                  <div className="playing-indicator">
                    <span className="material-symbols-outlined">play_arrow</span>
                  </div>
                )}
              </div>

              <div className="item-info">
                <h5 className="item-title">
                  {detail?.title || `${t('common.content')} ${index + 1}`}
                </h5>
                {detail?.creatorName && (
                  <span className="item-creator">{detail.creatorName}</span>
                )}
              </div>

              <div className="item-number">
                {index + 1}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}