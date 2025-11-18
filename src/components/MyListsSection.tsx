import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../context/I18nContextHooks'
import ConfirmationModal from '../components/ConfirmationModal'
import '../styles/components/MyListsSection.css'

/**
 * Props para el componente MyListsSection.
 */
interface MyListsSectionProps {
  /** Array de listas personales del usuario */
  readonly lists: ContentListResponse[]
  /** Callback que se ejecuta cuando se elimina una lista */
  readonly onListDeleted: () => void
  /** Indica si las listas están cargando */
  readonly loading: boolean
}

/**
 * Componente que muestra la sección de listas personales del usuario.
 *
 * Incluye funcionalidad para:
 * - Ver listas en formato de tabla
 * - Click-to-play en filas completas
 * - Editar listas (navegación a detalle)
 * - Eliminar listas con confirmación modal
 * - Estados de carga y vacío
 * - Scroll limitado a 5 elementos visibles
 *
 * @component
 * @param {MyListsSectionProps} props - Props del componente
 * @example
 * ```tsx
 * <MyListsSection
 *   lists={myLists}
 *   onListDeleted={() => loadLists()}
 *   loading={false}
 * />
 * ```
 */
export default function MyListsSection({ lists, onListDeleted, loading }: MyListsSectionProps) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [deletingListId, setDeletingListId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /**
   * Calcula el tiempo transcurrido desde una fecha en formato legible.
   *
   * @private
   * @param {string} dateString - Fecha en formato ISO string
   * @returns {string} Tiempo transcurrido formateado (hoy, ayer, X días, etc.)
   */
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t('myLists.timeAgo.today')
    if (diffDays === 1) return t('myLists.timeAgo.yesterday')
    if (diffDays < 7) return t('myLists.timeAgo.daysAgo').replace('{count}', diffDays.toString())
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return t('myLists.timeAgo.weeksAgo').replace('{count}', weeks.toString())
    }
    const months = Math.floor(diffDays / 30)
    return t('myLists.timeAgo.monthsAgo').replace('{count}', months.toString())
  }

  /**
   * Maneja la navegación para editar una lista.
   * Actualmente navega a la página de detalle de la lista.
   *
   * @private
   * @param {string} listId - ID de la lista a editar
   */
  const handleEditList = (listId: string) => {
    console.log('🔧 handleEditList called with ID:', listId)
    // Por ahora navegar a la página de detalle de la lista
    // En el futuro podría abrir un modal de edición
    navigate(`/lists/${listId}`)
    console.log('✅ Navigation triggered to:', `/lists/${listId}`)
  }

  /**
   * Maneja la reproducción de una lista.
   * Navega a la página de reproducción de la lista.
   *
   * @private
   * @param {string} listId - ID de la lista a reproducir
   */
  const handlePlayList = (listId: string) => {
    navigate(`/lists/${listId}`)
  }

  /**
   * Elimina una lista después de confirmación del usuario.
   *
   * @private
   * @async
   * @param {string} listId - ID de la lista a eliminar
   */
  const handleDeleteList = async (listId: string) => {
    try {
      setDeletingListId(listId)
      await ContentListService.deleteContentList(listId)
      toast.success(t('myLists.deleteSuccess') || 'Lista eliminada correctamente')
      onListDeleted()
      log('info', `List ${listId} deleted successfully`)
    } catch (error) {
      log('error', 'Error deleting list:', error)
      toast.error(t('myLists.deleteError') || 'Error al eliminar la lista')
    } finally {
      setDeletingListId(null)
      setShowDeleteModal(false)
    }
  }

  /**
   * Abre el modal de confirmación para eliminar una lista.
   *
   * @private
   * @param {string} listId - ID de la lista a eliminar
   */
  const openDeleteModal = (listId: string) => {
    setDeletingListId(listId)
    setShowDeleteModal(true)
  }

  /**
   * Cierra el modal de confirmación sin eliminar la lista.
   *
   * @private
   */
  const closeDeleteModal = () => {
    setDeletingListId(null)
    setShowDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="my-lists-section">
        <div className="my-lists-section-loading">
          <div className="my-lists-spinner"></div>
          <p className="my-lists-loading-text">{t('myLists.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-lists-section">
      <div className="my-lists-section-header">
        <h2 className="my-lists-section-title">{t('myLists.title')}</h2>
        <p className="my-lists-section-subtitle">{t('myLists.subtitle')}</p>
      </div>

      {lists.length === 0 ? (
        <div className="my-lists-empty">
          <div className="my-lists-empty-icon">
            <span className="material-symbols-outlined">list_alt</span>
          </div>
          <div className="my-lists-empty-content">
            <h2 className="my-lists-empty-title">{t('myLists.empty.title')}</h2>
            <p className="my-lists-empty-subtitle">
              {t('myLists.empty.subtitle')}
            </p>
          </div>
        </div>
      ) : (
        <div className="my-lists-table-container">
          <table className="my-lists-table">
            <thead>
              <tr>
                <th className="my-lists-table-header">{t('myLists.table.name')}</th>
                <th className="my-lists-table-header">{t('myLists.table.items')}</th>
                <th className="my-lists-table-header">{t('myLists.table.lastUpdate')}</th>
                <th className="my-lists-table-header">{t('myLists.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(list => {
                console.log('📋 Rendering list:', { id: list.id, nombre: list.nombre })
                return (
                <tr 
                  key={list.id} 
                  className="my-lists-table-row"
                  onClick={() => handlePlayList(list.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="my-lists-table-cell">
                    <div className="my-lists-item-info">
                      <div className="my-lists-item-icon">
                        <span className="material-symbols-outlined">list</span>
                      </div>
                      <div className="my-lists-item-details">
                        <span className="my-lists-item-name">{list.nombre}</span>
                        {list.descripcion && (
                          <span className="my-lists-item-description">{list.descripcion}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="my-lists-table-cell">
                    <span className="my-lists-item-count">
                      {list.size} {list.size === 1 ? t('myLists.item') : t('myLists.items')}
                    </span>
                  </td>
                  <td className="my-lists-table-cell">
                    <span className="my-lists-item-updated">
                      {getTimeAgo(list.updatedAt || list.createdAt)}
                    </span>
                  </td>
                  <td className="my-lists-table-cell">
                    <div className="my-lists-actions">
                      <button
                        type="button"
                        className="my-lists-action-btn my-lists-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          console.log('🖱️ Edit button clicked for list:', list.id)
                          handleEditList(list.id)
                        }}
                        title={t('myLists.actions.edit')}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="my-lists-action-btn my-lists-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteModal(list.id)
                        }}
                        disabled={deletingListId === list.id}
                        title={t('myLists.actions.delete')}
                      >
                        {deletingListId === list.id ? (
                          <span className="my-lists-spinner-small"></span>
                        ) : (
                          <span className="material-symbols-outlined">delete</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )})
              }}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          if (deletingListId) {
            handleDeleteList(deletingListId)
          }
        }}
        title={t('myLists.deleteModal.title')}
        message={t('myLists.deleteModal.message')}
        confirmText={t('myLists.deleteModal.confirm')}
        cancelText={t('myLists.deleteModal.cancel')}
        confirmButtonClass="btn-danger"
      />
    </div>
  )
}