import { useState, useEffect } from 'react'
import { ContentListService } from '../services/contentListService'
import { searchContent, type SearchResult } from '../services/searchService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../context/I18nContextHooks'
import '../styles/components/CreatePublicListForm.css'

/**
 * Props para el componente CreatePublicListForm.
 */
interface CreatePublicListFormProps {
  /** Callback que se ejecuta cuando se crea una lista exitosamente */
  readonly onListCreated: () => void
  /** Callback que se ejecuta cuando se cancela la creación */
  readonly onCancel: () => void
}

/**
 * Componente de formulario para crear nuevas listas públicas.
 *
 * Incluye funcionalidad para:
 * - Ingresar nombre y descripción de la lista
 * - Buscar contenidos por nombre, creador o tags
 * - Seleccionar/deseleccionar contenidos de la lista
 * - Crear la lista con los contenidos seleccionados
 * - Cancelar la creación
 *
 * @component
 * @param {CreatePublicListFormProps} props - Props del componente
 * @example
 * ```tsx
 * <CreatePublicListForm
 *   onListCreated={() => handleListCreated()}
 *   onCancel={() => handleCancel()}
 * />
 * ```
 */
export default function CreatePublicListForm({ onListCreated, onCancel }: CreatePublicListFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [availableContent, setAvailableContent] = useState<SearchResult[]>([])
  const [filteredContent, setFilteredContent] = useState<SearchResult[]>([])
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set())
  const [loadingContent, setLoadingContent] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadAvailableContent()
  }, [])

  useEffect(() => {
    filterContent()
  }, [searchQuery, availableContent])

  /**
   * Carga todos los contenidos disponibles desde la API.
   * Usa búsqueda sin query para obtener todos los contenidos.
   *
   * @async
   * @private
   */
  const loadAvailableContent = async () => {
    try {
      setLoadingContent(true)
      // Obtener todos los contenidos usando búsqueda sin filtros
      const response = await searchContent('', {
        sortBy: 'date',
        pageSize: 1000 // Obtener muchos contenidos para scroll
      })
      setAvailableContent(response.results)
      log('info', `Loaded ${response.results.length} available content items`)
    } catch (error) {
      log('error', 'Error loading available content:', error)
      // No mostrar notificación de error para carga de contenidos
    } finally {
      setLoadingContent(false)
    }
  }

  /**
   * Filtra los contenidos disponibles basado en la búsqueda.
   * Busca en título y creador.
   *
   * @private
   */
  const filterContent = () => {
    if (!searchQuery.trim()) {
      setFilteredContent(availableContent)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = availableContent.filter(content =>
      content.title.toLowerCase().includes(query) ||
      content.creator.toLowerCase().includes(query)
    )
    setFilteredContent(filtered)
  }

  /**
   * Maneja cambios en los campos del formulario.
   *
   * @private
   * @param {string} field - Campo que cambió
   * @param {string} value - Nuevo valor
   */
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Alterna la selección de un contenido.
   *
   * @private
   * @param {string} contentId - ID del contenido a seleccionar/deseleccionar
   */
  const toggleContentSelection = (contentId: string) => {
    setSelectedContentIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(contentId)) {
        newSet.delete(contentId)
      } else {
        newSet.add(contentId)
      }
      return newSet
    })
  }

  /**
   * Valida que el formulario tenga los datos requeridos.
   *
   * @private
   * @returns {boolean} True si el formulario es válido
   */
  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      toast.error(t('creatorLists.form.nameRequired') || 'El nombre es obligatorio')
      return false
    }
    if (selectedContentIds.size === 0) {
      toast.error(t('creatorLists.form.contentRequired') || 'Debe seleccionar al menos un contenido')
      return false
    }
    return true
  }

  /**
   * Crea la nueva lista pública con los contenidos seleccionados.
   *
   * @async
   * @private
   */
  const handleCreate = async () => {
    if (!validateForm()) return

    try {
      setCreating(true)

      // Crear la lista
      await ContentListService.createContentList({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        visibilidad: 'PUBLICA',
        contenidoIds: Array.from(selectedContentIds)
      })

      toast.success(t('creatorLists.form.createSuccess') || 'Lista creada correctamente')
      log('info', `Created public list "${formData.nombre}" with ${selectedContentIds.size} items`)
      onListCreated()
    } catch (error) {
      log('error', 'Error creating public list:', error)
      
      // Manejo específico para nombres duplicados
      if (error instanceof Error && error.message.includes('Ya existe una lista')) {
        toast.error('Ya existe una lista pública con este nombre. Por favor, elige un nombre diferente.')
      } else {
        toast.error(t('creatorLists.form.createError') || 'Error al crear la lista')
      }
    } finally {
      setCreating(false)
    }
  }

  /**
   * Formatea la duración de un contenido en formato legible.
   *
   * @private
   * @param {string} duration - Duración en formato HH:MM:SS o MM:SS
   * @returns {string} Duración formateada
   */
  const formatDuration = (duration: string): string => {
    if (!duration) return ''
    const parts = duration.split(':')
    if (parts.length === 3) {
      return `${parts[0]}:${parts[1]}:${parts[2]}`
    }
    return duration
  }

  return (
    <div className="create-public-list-form">
      <div className="create-public-list-form-header">
        <h3 className="create-public-list-form-title">{t('creatorLists.form.title')}</h3>
        <p className="create-public-list-form-subtitle">{t('creatorLists.form.subtitle')}</p>
      </div>

      <div className="create-public-list-form-content">
        {/* Campos del formulario */}
        <div className="create-public-list-form-fields">
          <div className="form-field">
            <label htmlFor="list-name" className="form-label">
              {t('creatorLists.form.nameLabel')} *
            </label>
            <input
              id="list-name"
              type="text"
              className="form-input"
              value={formData.nombre}
              onChange={(e) => handleFormChange('nombre', e.target.value)}
              placeholder={t('creatorLists.form.namePlaceholder')}
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="list-description" className="form-label">
              {t('creatorLists.form.descriptionLabel')}
            </label>
            <textarea
              id="list-description"
              className="form-textarea"
              value={formData.descripcion}
              onChange={(e) => handleFormChange('descripcion', e.target.value)}
              placeholder={t('creatorLists.form.descriptionPlaceholder')}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        {/* Buscador de contenidos */}
        <div className="create-public-list-search-section">
          <div className="create-public-list-search-header">
            <h4 className="create-public-list-search-title">{t('creatorLists.form.searchTitle')}</h4>
            <div className="search-input-container">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('creatorLists.form.searchPlaceholder')}
              />
            </div>
          </div>

          {/* Lista de contenidos */}
          <div className="create-public-list-content-list">
            {(() => {
              if (loadingContent) {
                return (
                  <div className="content-loading">
                    <div className="content-spinner"></div>
                    <p>{t('creatorLists.form.loadingContent')}</p>
                  </div>
                )
              }

              if (filteredContent.length === 0) {
                return (
                  <div className="content-empty">
                    <span className="material-symbols-outlined">search_off</span>
                    <p>{t('creatorLists.form.noContentFound')}</p>
                  </div>
                )
              }

              return (
                <div className="content-items">
                  {filteredContent.map(content => (
                    <button
                      key={content.id}
                      type="button"
                      className={`content-item ${selectedContentIds.has(content.id) ? 'selected' : ''}`}
                      onClick={() => toggleContentSelection(content.id)}
                      aria-pressed={selectedContentIds.has(content.id)}
                    >
                      <div className="content-item-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedContentIds.has(content.id)}
                          onChange={() => {}} // Manejado por el onClick del contenedor
                          className="content-checkbox"
                          readOnly
                        />
                      </div>
                      <div className="content-item-info">
                        <div className="content-item-title">{content.title}</div>
                        <div className="content-item-meta">
                          <span className="content-item-creator">{content.creator}</span>
                          <span className="content-item-type">
                            {content.type === 'audio' ? t('creatorLists.form.audio') : t('creatorLists.form.video')}
                          </span>
                          <span className="content-item-duration">{formatDuration(content.duration)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })()}
          </div>

          <div className="selected-count">
            {t('creatorLists.form.selectedCount').replace('{count}', selectedContentIds.size.toString())}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="create-public-list-form-actions">
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={creating}
          >
            {t('creatorLists.form.cancel')}
          </button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={creating || !formData.nombre.trim() || selectedContentIds.size === 0}
          >
            {creating ? (
              <>
                <span className="btn-spinner"></span>
                {t('creatorLists.form.creating')}
              </>
            ) : (
              t('creatorLists.form.create')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}