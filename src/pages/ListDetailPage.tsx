import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { useI18n } from '../context/I18nContextHooks'
import '../styles/pages/ListDetailPage.css'

interface ContentDetails {
  id: string
  title: string
  contentType: string
}

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [list, setList] = useState<ContentListResponse | null>(null)
  const [contentDetails, setContentDetails] = useState<Map<string, ContentDetails>>(new Map())
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    if (id) {
      loadList()
    }
  }, [id])

  const loadList = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await ContentListService.getContentListById(id)
      setList(data)
      setEditName(data.nombre)
      setEditDescription(data.descripcion || '')
      log('info', 'List loaded:', data.nombre)
      
      // Cargar detalles de los contenidos
      await loadContentDetails(data.contenidoIds)
    } catch (error) {
      log('error', 'Error loading list:', error)
      toast.error(t('playlist.error.load'))
      navigate('/my-lists')
    } finally {
      setLoading(false)
    }
  }

  const loadContentDetails = async (contentIds: string[]) => {
    try {
      // Cargar todos los contenidos visibles
      const response = await fetchWithAuth(`${import.meta.env.VITE_USERS_API_URL}/api/content/getAll`, {
        method: 'GET'
      })

      if (!response.ok) return

      const allContents = await response.json()
      
      // Crear mapa de detalles solo para los IDs que están en la lista
      const detailsMap = new Map<string, ContentDetails>()
      for (const content of allContents) {
        const contentId = typeof content.id === 'object' 
          ? content.id.$oid || content.id.toString?.() || JSON.stringify(content.id)
          : content.id
          
        if (contentIds.includes(contentId)) {
          detailsMap.set(contentId, {
            id: contentId,
            title: content.title,
            contentType: content.contentType
          })
        }
      }
      
      setContentDetails(detailsMap)
    } catch (error) {
      log('error', 'Error loading content details:', error)
    }
  }

  const handleUpdate = async () => {
    if (!id) return

    try {
      await ContentListService.updateContentList(id, {
        nombre: editName.trim(),
        descripcion: editDescription.trim() || undefined
      })
      
      toast.success(t('playlist.success.updated'))
      setEditing(false)
      loadList()
    } catch (error) {
      log('error', 'Error updating list:', error)
      toast.error(t('playlist.error.update'))
    }
  }

  const handleDelete = async () => {
    if (!id || !list) return

    if (!confirm(t('playlist.confirmDelete').replace('{name}', list.nombre))) {
      return
    }

    try {
      await ContentListService.deleteContentList(id)
      toast.success(t('playlist.success.deleted'))
      navigate('/my-lists')
    } catch (error) {
      log('error', 'Error deleting list:', error)
      toast.error(t('playlist.error.delete'))
    }
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContentIcon = (contentType?: string) => {
    switch (contentType) {
      case 'VIDEO': return 'movie'
      case 'AUDIO': return 'music_note'
      default: return 'movie'
    }
  }

  const getContentTypeLabel = (contentType?: string) => {
    switch (contentType) {
      case 'VIDEO': return t('playlist.contentTypes.video')
      case 'AUDIO': return t('playlist.contentTypes.audio')
      default: return t('playlist.contentTypes.content')
    }
  }

  // Reproducir toda la lista desde el inicio
  const handlePlayList = () => {
    if (!list || list.contenidoIds.length === 0) {
      toast.warning(t('playlist.emptyList.title'))
      return
    }
    
    const firstContentId = list.contenidoIds[0]
    const playlistType = list.visibilidad === 'PUBLICA' ? 'public' : 'private'
    log('info', 'Playing list from start:', list.nombre)
    navigate(`/play/${firstContentId}?list=${list.id}&index=0&playlistType=${playlistType}&playlistName=${encodeURIComponent(list.nombre)}`)
  }

  // Reproducir un contenido específico de la lista
  const handlePlayContent = (contentId: string, index: number) => {
    if (!list) return
    const playlistType = list.visibilidad === 'PUBLICA' ? 'public' : 'private'
    log('info', 'Playing content from list:', { contentId, index })
    navigate(`/play/${contentId}?list=${list.id}&index=${index}&playlistType=${playlistType}&playlistName=${encodeURIComponent(list.nombre)}`)
  }

  if (loading) {
    return (
      <div className="list-detail-container">
        <div className="list-loading">
          <div className="list-spinner"></div>
          <p className="list-loading-text">{t('playlist.loadingDetail')}</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="list-detail-container">
        <div className="list-empty-state">
          <div className="list-empty-icon">⚠️</div>
          <h3 className="list-empty-title">{t('playlist.notFound.title')}</h3>
          <p className="list-empty-subtitle" style={{ textAlign: 'center' }}>{t('playlist.notFound.subtitle')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="list-detail-container">
      {/* Breadcrumb */}
      <nav className="list-breadcrumb">
        <button 
          type="button"
          className="list-breadcrumb-link"
          onClick={() => navigate('/my-lists')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t('playlist.myLists')}
        </button>
        <span className="list-breadcrumb-separator">/</span>
        <span className="list-breadcrumb-current">{list.nombre}</span>
      </nav>

      {/* Header */}
      <div className="list-header-card">
        {editing ? (
          <div className="list-edit-form">
            {/* Modo edición */}
            <div className="list-form-group">
              <label htmlFor="editName" className="list-form-label">Nombre de la Lista</label>
              <input
                type="text"
                className="list-form-input"
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={100}
                placeholder="Nombre de la lista"
              />
            </div>
            <div className="list-form-group">
              <label htmlFor="editDescription" className="list-form-label">Descripción</label>
              <textarea
                className="list-form-textarea"
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Descripción de la lista..."
              />
            </div>
            <div className="list-actions">
              <button className="list-btn list-btn-save" onClick={handleUpdate}>
                Guardar Cambios
              </button>
              <button className="list-btn list-btn-cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="list-header-content">
            {/* Modo visualización */}
            <div className="list-header-info">
              <h1 className="list-title">{list.nombre}</h1>
              {list.descripcion && (
                <p className="list-description">{list.descripcion}</p>
              )}
              <div className="list-meta">
                <div className="list-meta-item">
                  <span className="material-symbols-outlined">visibility</span>
                  <span>{(() => {
                    const visibilityMap: Record<string, string> = {
                      'PRIVADA': t('playlist.visibility.private'),
                      'RESTRINGIDA': t('playlist.visibility.restricted'),
                      'NO_LISTADA': t('playlist.visibility.unlisted'),
                      'PUBLICA': t('playlist.visibility.public')
                    }
                    return visibilityMap[list.visibilidad] || list.visibilidad
                  })()}</span>
                </div>
                <div className="list-meta-item">
                  <span className="material-symbols-outlined">list</span>
                  <span>{list.size} {list.size === 1 ? 'Elemento' : 'Elementos'}</span>
                </div>
                <div className="list-meta-item">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <span>{formatDate(list.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="list-actions">
              <button
                className="list-btn list-btn-play-all"
                onClick={handlePlayList}
                disabled={list.size === 0}
                title="Reproducir lista completa desde el inicio"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                {t('playlist.playList')}
              </button>
              <button
                className="list-btn list-btn-edit"
                onClick={() => setEditing(true)}
              >
                <span className="material-symbols-outlined">edit</span>
                {t('playlist.edit')}
              </button>
              <button
                className="list-btn list-btn-delete"
                onClick={handleDelete}
              >
                <span className="material-symbols-outlined">delete</span>
                {t('playlist.delete')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido de la lista */}
      <div className="list-content-card">
        <div className="list-content-header">
          <h2 className="list-content-title">
            <span>{t('playlist.content')}</span>
            <span className="list-content-count">({list.size})</span>
          </h2>
          <button 
            className="list-btn-add"
            onClick={() => navigate(`/lists/${list.id}/add-content`)}
          >
            <span className="material-symbols-outlined">add</span>
            {t('playlist.add')}
          </button>
        </div>
        <div className="list-content-body">
          {list.contenidoIds.length === 0 ? (
            <div className="list-empty-state">
              <h3 className="list-empty-title">{t('playlist.emptyList.title')}</h3>
              <p className="list-empty-subtitle" style={{ textAlign: 'center' }}>{t('playlist.emptyList.subtitle')}</p>
            </div>
          ) : (
            <div className="list-items">
              {list.contenidoIds.map((contentId, index) => {
                const details = contentDetails.get(contentId)
                const contentType = details?.contentType
                const iconName = getContentIcon(contentType)
                const title = details?.title || t('playlist.contentTypes.content')
                const typeLabel = getContentTypeLabel(contentType)
                
                return (
                  <div key={contentId} className="list-item">
                    <div className="list-item-info">
                      <span className="list-item-index">{index + 1}.</span>
                      <div className="list-item-icon-wrapper">
                        <span className="material-symbols-outlined list-item-icon">{iconName}</span>
                      </div>
                      <div className="list-item-details">
                        <span className="list-item-title">{title}</span>
                        <span className="list-item-type">{typeLabel}</span>
                      </div>
                    </div>
                    <div className="list-item-actions">
                      <button
                        className="list-btn-play-item"
                        onClick={() => handlePlayContent(contentId, index)}
                        title="Reproducir este contenido"
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                      </button>
                      <button
                        className="list-btn-remove"
                        onClick={async () => {
                          try {
                            await ContentListService.removeContentFromList(list.id, contentId)
                            toast.success(t('playlist.success.removed'))
                            loadList()
                          } catch (error) {
                            toast.error(t('playlist.error.remove'))
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
