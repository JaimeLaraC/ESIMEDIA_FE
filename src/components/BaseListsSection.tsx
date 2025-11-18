import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { toast } from 'react-toastify'
import { log } from '../config/logConfig'
import { useI18n } from '../context/I18nContextHooks'
import ConfirmationModal from '../components/ConfirmationModal'
import '../styles/components/BaseListsSection.css'

/**
 * Configuración de acciones disponibles para una sección de listas.
 */
export interface ListsSectionActions {
  /** Si se puede hacer click en la fila para reproducir/ver */
  readonly canPlay?: boolean
  /** Si se puede ver detalles de la lista */
  readonly canView?: boolean
  /** Si se puede editar la lista */
  readonly canEdit?: boolean
  /** Si se puede eliminar la lista */
  readonly canDelete?: boolean
  /** Callback para cuando se edita una lista */
  readonly onEdit?: (listId: string) => void
  /** Callback para cuando se elimina una lista */
  readonly onDelete?: () => void
}

/**
 * Props para el componente BaseListsSection.
 */
export interface BaseListsSectionProps {
  /** Array de listas disponibles */
  readonly lists: ContentListResponse[]
  /** Indica si las listas están cargando */
  readonly loading: boolean
  /** Configuración de acciones disponibles */
  readonly actions: ListsSectionActions
  /** Título de la sección */
  readonly title: string
  /** Subtítulo de la sección */
  readonly subtitle?: string
  /** Prefijo para las claves de traducción */
  readonly translationPrefix: string
  /** Clase CSS base para el componente */
  readonly baseClassName: string
}

/**
 * Componente base que muestra secciones de listas con funcionalidad configurable.
 *
 * Este componente proporciona la estructura común para mostrar listas en formato tabla,
 * incluyendo estados de carga, vacío, formateo de tiempo, y acciones configurables.
 *
 * @component
 * @param {BaseListsSectionProps} props - Props del componente
 * @example
 * ```tsx
 * <BaseListsSection
 *   lists={lists}
 *   loading={false}
 *   actions={{
 *     canPlay: true,
 *     canView: true,
 *     onEdit: handleEdit
 *   }}
 *   title="Mis Listas"
 *   subtitle="Gestiona tus listas personales"
 *   translationPrefix="myLists"
 *   baseClassName="my-lists"
 * />
 * ```
 */
export default function BaseListsSection({
  lists,
  loading,
  actions,
  title,
  subtitle,
  translationPrefix,
  baseClassName
}: BaseListsSectionProps) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [deletingListId, setDeletingListId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /**
   * Obtiene texto de tiempo transcurrido (ej: "hace 2 días")
   */
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return t(`${translationPrefix}.timeAgo.today`)
    } else if (diffDays === 1) {
      return t(`${translationPrefix}.timeAgo.yesterday`)
    } else if (diffDays < 7) {
      return t(`${translationPrefix}.timeAgo.daysAgo`).replace('{count}', diffDays.toString())
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return t(`${translationPrefix}.timeAgo.weeksAgo`).replace('{count}', weeks.toString())
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return t(`${translationPrefix}.timeAgo.monthsAgo`).replace('{count}', months.toString())
    } else {
      const years = Math.floor(diffDays / 365)
      return t(`${translationPrefix}.timeAgo.yearsAgo`).replace('{count}', years.toString())
    }
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
      toast.success(t(`${translationPrefix}.deleteSuccess`) || 'Lista eliminada correctamente')
      actions.onDelete?.()
      log('info', `List ${listId} deleted successfully`)
    } catch (error) {
      log('error', 'Error deleting list:', error)
      toast.error(t(`${translationPrefix}.deleteError`) || 'Error al eliminar la lista')
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

  /**
   * Maneja la visualización de detalles de una lista.
   * Navega a la página de detalle de la lista.
   *
   * @private
   * @param {string} listId - ID de la lista a ver
   */
  const handleViewList = (listId: string) => {
    navigate(`/lists/${listId}`)
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
   * Maneja el click en una fila de la tabla.
   * Dependiendo de la configuración, puede reproducir o no hacer nada.
   *
   * @private
   * @param {string} listId - ID de la lista clickeada
   */
  const handleRowClick = (listId: string) => {
    if (actions.canPlay) {
      handlePlayList(listId)
    }
  }

  if (loading) {
    return (
      <div className={`${baseClassName}-section`}>
        <div className={`${baseClassName}-section-loading`}>
          <div className={`${baseClassName}-spinner`}></div>
          <p className={`${baseClassName}-loading-text`}>{t(`${translationPrefix}.loading`)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${baseClassName}-section`}>
      <div className={`${baseClassName}-section-header`}>
        <h2 className={`${baseClassName}-section-title`}>{title}</h2>
        {subtitle && <p className={`${baseClassName}-section-subtitle`} style={{ textAlign: 'center' }}>{subtitle}</p>}
      </div>

      {lists.length === 0 ? (
        <div className={`${baseClassName}-empty`}>
          <div className={`${baseClassName}-empty-icon`}>
            <span className="material-symbols-outlined">
              {translationPrefix.includes('public') ? 'public' : 'list'}
            </span>
          </div>
          <div className={`${baseClassName}-empty-content`}>
            <h2 className={`${baseClassName}-empty-title`}>{t(`${translationPrefix}.empty.title`)}</h2>
            <p className={`${baseClassName}-empty-subtitle`} style={{ textAlign: 'center' }}>
              {t(`${translationPrefix}.empty.subtitle`)}
            </p>
          </div>
        </div>
      ) : (
        <div className={`${baseClassName}-table-container`}>
          <table className={`${baseClassName}-table`}>
            <thead>
              <tr>
                <th className={`${baseClassName}-table-header`}>{t(`${translationPrefix}.table.name`)}</th>
                <th className={`${baseClassName}-table-header`}>{t(`${translationPrefix}.table.creator`)}</th>
                <th className={`${baseClassName}-table-header`}>{t(`${translationPrefix}.table.items`)}</th>
                <th className={`${baseClassName}-table-header`}>{t(`${translationPrefix}.table.lastUpdate`)}</th>
                <th className={`${baseClassName}-table-header`}>{t(`${translationPrefix}.table.actions`)}</th>
              </tr>
            </thead>
            <tbody>
              {lists.map(list => (
                <tr
                  key={list.id}
                  className={`${baseClassName}-table-row`}
                  onClick={() => handleRowClick(list.id)}
                  style={{ cursor: actions.canPlay ? 'pointer' : 'default' }}
                >
                  <td className={`${baseClassName}-table-cell`}>
                    <div className={`${baseClassName}-item-info`}>
                      <div className={`${baseClassName}-item-icon`}>
                        <span className="material-symbols-outlined">
                          {list.visibilidad === 'PUBLICA' ? 'public' : 'lock'}
                        </span>
                      </div>
                      <div className={`${baseClassName}-item-details`}>
                        <span className={`${baseClassName}-item-name`}>{list.nombre}</span>
                        {list.descripcion && (
                          <span className={`${baseClassName}-item-description`}>{list.descripcion}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`${baseClassName}-table-cell`}>
                    <span className={`${baseClassName}-item-creator`}>
                      {list.visibilidad === 'PUBLICA'
                        ? t(`${translationPrefix}.creator`)
                        : t(`${translationPrefix}.owner`)}
                    </span>
                  </td>
                  <td className={`${baseClassName}-table-cell`}>
                    <span className={`${baseClassName}-item-count`}>
                      {list.size} {list.size === 1 ? t(`${translationPrefix}.item`) : t(`${translationPrefix}.items`)}
                    </span>
                  </td>
                  <td className={`${baseClassName}-table-cell`}>
                    <span className={`${baseClassName}-item-updated`}>
                      {getTimeAgo(list.updatedAt || list.createdAt)}
                    </span>
                  </td>
                  <td className={`${baseClassName}-table-cell`}>
                    <div className={`${baseClassName}-actions`}>
                      {actions.canView && (
                        <button
                          className={`${baseClassName}-action-btn ${baseClassName}-view-btn`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewList(list.id)
                          }}
                          title={t(`${translationPrefix}.actions.view`)}
                        >
                          <span className="material-symbols-outlined">visibility</span>
                          <span>{t(`${translationPrefix}.actions.view`)}</span>
                        </button>
                      )}
                      {actions.canEdit && actions.onEdit && (
                        <button
                          className={`${baseClassName}-action-btn ${baseClassName}-edit-btn`}
                          onClick={(e) => {
                            e.stopPropagation()
                            actions.onEdit!(list.id)
                          }}
                          title={t(`${translationPrefix}.actions.edit`)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      )}
                      {actions.canDelete && (
                        <button
                          className={`${baseClassName}-action-btn ${baseClassName}-delete-btn`}
                          onClick={(e) => {
                            e.stopPropagation()
                            openDeleteModal(list.id)
                          }}
                          disabled={deletingListId === list.id}
                          title={t(`${translationPrefix}.actions.delete`)}
                        >
                          {deletingListId === list.id ? (
                            <span className={`${baseClassName}-spinner-small`}></span>
                          ) : (
                            <span className="material-symbols-outlined">delete</span>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
        title={t(`${translationPrefix}.deleteModal.title`)}
        message={t(`${translationPrefix}.deleteModal.message`)}
        confirmText={t(`${translationPrefix}.deleteModal.confirm`)}
        cancelText={t(`${translationPrefix}.deleteModal.cancel`)}
        confirmButtonClass="btn-danger"
      />
    </div>
  )
}