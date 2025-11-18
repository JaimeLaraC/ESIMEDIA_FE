import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { useI18n } from '../context/I18nContextHooks'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'
import '../styles/pages/AddContentToListPage.css'

interface ContentItem {
  id: string
  title: string
  contentType: string
  thumbnailUrl: string
  tags: string[]
}

export default function AddContentToListPage() {
  const { id: listId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useI18n()
  
  const [list, setList] = useState<ContentListResponse | null>(null)
  const [allContent, setAllContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    if (listId) {
      loadListAndContent()
    }
  }, [listId])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, genreFilter, sortBy, allContent])

  const loadListAndContent = async () => {
    if (!listId) return

    try {
      setLoading(true)
      
      // Cargar la lista
      const listData = await ContentListService.getContentListById(listId)
      setList(listData)
      log('info', 'List loaded:', listData.nombre)

      // Cargar todo el contenido disponible
      const response = await fetchWithAuth(`${import.meta.env.VITE_USERS_API_URL}/api/content/getAll`, {
        method: 'GET'
      })

      if (!response.ok) throw new Error('Failed to load content')

      const contents = await response.json()
      
      // Mapear y filtrar contenido que no esté ya en la lista
      const mappedContent: ContentItem[] = contents
        .filter((c: any) => {
          const contentId = typeof c.id === 'object' 
            ? c.id.$oid || c.id.toString?.() || JSON.stringify(c.id)
            : c.id
          return !listData.contenidoIds.includes(contentId)
        })
        .map((c: any) => ({
          id: typeof c.id === 'object' 
            ? c.id.$oid || c.id.toString?.() || JSON.stringify(c.id)
            : c.id,
          title: c.title,
          contentType: c.contentType,
          thumbnailUrl: c.thumbnailUrl || '',
          tags: c.tags || []
        }))
      
      setAllContent(mappedContent)
      log('info', 'Available content loaded:', mappedContent.length)
    } catch (error) {
      log('error', 'Error loading content:', error)
      toast.error(t('addContentPage.errors.loadContent'))
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allContent]

    // Filtro de búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filtro de género (por tags)
    if (genreFilter !== 'all') {
      filtered = filtered.filter(c => 
        c.tags.some(tag => tag.toLowerCase() === genreFilter.toLowerCase())
      )
    }

    // Ordenamiento
    if (sortBy === 'views') {
      // Simulado - en producción usar viewCount
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'rating') {
      // Simulado - en producción usar rating
      filtered.sort((a, b) => b.title.localeCompare(a.title))
    } else {
      // Por defecto: recientes (orden original)
      // Ya viene ordenado del backend
    }

    setFilteredContent(filtered)
  }

  const toggleSelection = (contentId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId)
    } else {
      newSelected.add(contentId)
    }
    setSelectedIds(newSelected)
  }

  const handleAddToList = async () => {
    if (!listId || selectedIds.size === 0) return

    try {
      // Añadir cada contenido seleccionado a la lista
      for (const contentId of selectedIds) {
        await ContentListService.addContentToList(listId, contentId)
      }
      
      toast.success(`${selectedIds.size} ${t('addContentPage.success.addedToList')}`)
      navigate(`/lists/${listId}`)
    } catch (error) {
      log('error', 'Error adding content to list:', error)
      toast.error(t('addContentPage.errors.addToList'))
    }
  }

  const getContentTypeLabel = (type: string) => {
    return type === 'VIDEO' ? t('addContentPage.contentTypes.video') : type === 'AUDIO' ? t('addContentPage.contentTypes.audio') : t('addContentPage.contentTypes.content')
  }

  const getContentIcon = (type: string) => {
    return type === 'VIDEO' ? 'movie' : type === 'AUDIO' ? 'music_note' : 'movie'
  }

  if (loading) {
    return (
      <div className="add-content-container">
        <div className="add-content-loading">
          <div className="add-content-spinner"></div>
          <p>{t('addContentPage.loading')}</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="add-content-container">
        <div className="add-content-error">
          <h3>{t('addContentPage.listNotFound')}</h3>
          <button onClick={() => navigate('/my-lists')} className="btn-back">
            {t('addContentPage.backToMyLists')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="add-content-page">
      <div className="add-content-container">
        {/* Breadcrumb */}
        <div className="add-content-breadcrumb">
          <a 
            href="#" 
            className="breadcrumb-link"
            onClick={(e) => { e.preventDefault(); navigate(`/lists/${listId}`); }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {t('common.backTo')} '{list.nombre}'
          </a>
        </div>

        {/* Header */}
        <div className="add-content-header">
          <h1 className="add-content-title">{t('addContentPage.title')}</h1>
          <p className="add-content-subtitle">
            {t('addContentPage.subtitle')}
          </p>
        </div>

        {/* Filters Card */}
        <div className="add-content-filters-card">
          <div className="filters-grid">
            {/* Search Bar */}
            <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                className="search-input"
                placeholder={t('addContentPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Selects */}
            <div className="filter-selects">
              <select
                className="filter-select"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="all">{t('addContentPage.allGenres')}</option>
                <option value="musica">{t('addContentPage.genres.music')}</option>
                <option value="accion">{t('addContentPage.genres.action')}</option>
                <option value="comedia">{t('addContentPage.genres.comedy')}</option>
                <option value="drama">{t('addContentPage.genres.drama')}</option>
                <option value="documental">{t('addContentPage.genres.documentary')}</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">{t('addContentPage.sortBy.recent')}</option>
                <option value="views">{t('addContentPage.sortBy.mostViewed')}</option>
                <option value="rating">{t('addContentPage.sortBy.bestRated')}</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {filteredContent.length === 0 ? (
              <div className="no-content">
                <span className="material-symbols-outlined">search_off</span>
                <p>{t('addContentPage.noContentFound')}</p>
              </div>
            ) : (
              filteredContent.map((content) => {
                const isSelected = selectedIds.has(content.id)
                
                const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
                  const fallbackImage = content.contentType === 'AUDIO' ? defaultAudioImage : defaultVideoImage
                  e.currentTarget.src = fallbackImage
                }

                return (
                  <div
                    key={content.id}
                    className={`content-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelection(content.id)}
                  >
                    {/* Thumbnail */}
                    <div className="content-thumbnail">
                      {content.thumbnailUrl ? (
                        <img 
                          src={content.thumbnailUrl} 
                          alt={content.title}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="thumbnail-placeholder">
                          <span className="material-symbols-outlined">
                            {getContentIcon(content.contentType)}
                          </span>
                        </div>
                      )}
                      <div className="thumbnail-overlay"></div>
                    </div>

                    {/* Info */}
                    <div className="content-info">
                      <h3 className="content-name">{content.title}</h3>
                      <p className="content-type">{getContentTypeLabel(content.contentType)}</p>
                    </div>

                    {/* Selection Badge */}
                    <div className={`selection-badge ${isSelected ? 'selected' : ''}`}>
                      <span className="material-symbols-outlined">
                        {isSelected ? 'check' : 'add'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer con selección */}
      {selectedIds.size > 0 && (
        <footer className="add-content-footer">
          <div className="footer-content">
            <p className="selection-count">
              <span className="count-number">{selectedIds.size}</span> {selectedIds.size === 1 ? t('addContentPage.selection.item') : t('addContentPage.selection.items')} {selectedIds.size === 1 ? t('addContentPage.selection.selected') : t('addContentPage.selection.selectedPlural')}
            </p>
            <button className="btn-add-to-list" onClick={handleAddToList}>
              {t('addContentPage.addToList')}
            </button>
            <button className="btn-clear" onClick={() => setSelectedIds(new Set())}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
