import { useState, useEffect } from 'react'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { log } from '../config/logConfig'
import { useI18n } from '../context/I18nContextHooks'
import BaseListsSection from '../components/BaseListsSection'
import CreatePublicListForm from '../components/CreatePublicListForm'
import '../styles/pages/CreatorListsPage.css'
import '../styles/components/PublicListsSection.css'

/**
 * Página de gestión de listas públicas para creadores de contenido.
 *
 * Esta página permite a los creadores:
 * - Ver todas las listas públicas existentes
 * - Editar y eliminar listas públicas
 * - Crear nuevas listas públicas con contenido seleccionado
 *
 * Los creadores no ven publicidad, listas privadas ni pueden reproducir listas.
 *
 * @component
 * @example
 * ```tsx
 * <CreatorListsPage />
 * ```
 */
export default function CreatorListsPage() {
  const { t } = useI18n()
  const [publicLists, setPublicLists] = useState<ContentListResponse[]>([])
  const [loadingPublicLists, setLoadingPublicLists] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadPublicLists()
  }, [])

  /**
   * Carga las listas públicas desde la API.
   * Maneja errores silenciosamente para mantener la UX fluida.
   *
   * @async
   * @private
   */
  const loadPublicLists = async () => {
    try {
      setLoadingPublicLists(true)
      const data = await ContentListService.getPublicContentLists()
      setPublicLists(data)
      log('info', `Loaded ${data.length} public lists for creator`)
    } catch (error) {
      log('error', 'Error loading public lists for creator:', error)
      // No mostrar notificación de error para listas públicas
    } finally {
      setLoadingPublicLists(false)
    }
  }

  /**
   * Maneja la eliminación de una lista pública.
   * Recarga las listas públicas para reflejar los cambios.
   *
   * @private
   */
  const handleListDeleted = () => {
    loadPublicLists() // Recargar listas públicas
  }

  /**
   * Maneja la creación exitosa de una nueva lista pública.
   * Oculta el formulario y recarga las listas.
   *
   * @private
   */
  const handleListCreated = () => {
    setShowCreateForm(false)
    loadPublicLists() // Recargar listas públicas
  }

  /**
   * Maneja la edición de una lista pública.
   * Actualmente navega a la página de detalle (futuro: modal de edición).
   *
   * @private
   * @param {string} listId - ID de la lista a editar
   */
  const handleListEdited = (listId: string) => {
    // Por ahora navegar a la página de detalle
    // En el futuro podría abrir un modal de edición
    log('info', `Editing public list: ${listId}`)
    // TODO: Implementar navegación o modal de edición
  }

  /**
   * Muestra el formulario para crear una nueva lista pública.
   *
   * @private
   */
  const handleShowCreateForm = () => {
    setShowCreateForm(true)
  }

  /**
   * Oculta el formulario de creación sin guardar.
   *
   * @private
   */
  const handleCancelCreate = () => {
    setShowCreateForm(false)
  }

  return (
    <div className="creator-lists-page">
      <div className="creator-lists-page-content">
        {/* Encabezado */}
        <div className="creator-lists-header">
          <h1 className="creator-lists-title">{t('creatorLists.title')}</h1>
          <p className="creator-lists-subtitle">{t('creatorLists.subtitle')}</p>
        </div>

        {/* Sección de listas públicas */}
        <BaseListsSection
          lists={publicLists}
          loading={loadingPublicLists}
          actions={{
            canEdit: true,
            canDelete: true,
            onEdit: handleListEdited,
            onDelete: handleListDeleted
          }}
          title={t('creatorLists.publicListsTitle')}
          translationPrefix="publicLists"
          baseClassName="public-lists"
        />

        {/* Botón para añadir nueva lista */}
        {!showCreateForm && (
          <div className="creator-lists-add-section">
            <button
              className="btn-primary creator-lists-add-btn"
              onClick={handleShowCreateForm}
            >
              <span className="material-symbols-outlined">add</span>
              {t('creatorLists.addNewList')}
            </button>
          </div>
        )}

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="creator-lists-form-section">
            <CreatePublicListForm
              onListCreated={handleListCreated}
              onCancel={handleCancelCreate}
            />
          </div>
        )}
      </div>
    </div>
  )
}