import BaseListsSection from '../components/BaseListsSection'
import type { ContentListResponse } from '../services/contentListService'
import { useI18n } from '../context/I18nContextHooks'
import '../styles/components/PublicListsSection.css'

/**
 * Props para el componente PublicListsSection.
 */
interface PublicListsSectionProps {
  /** Array de listas públicas disponibles */
  readonly lists: ContentListResponse[]
  /** Indica si las listas están cargando */
  readonly loading: boolean
}

/**
 * Componente que muestra la sección de listas públicas creadas por otros usuarios.
 *
 * Incluye funcionalidad para:
 * - Ver listas públicas en formato de tabla
 * - Click-to-play en filas completas
 * - Ver detalles de listas públicas
 * - Estados de carga y vacío
 * - Scroll limitado a 5 elementos visibles
 *
 * @component
 * @param {PublicListsSectionProps} props - Props del componente
 * @example
 * ```tsx
 * <PublicListsSection
 *   lists={publicLists}
 *   loading={false}
 * />
 * ```
 */
export default function PublicListsSection({ lists, loading }: PublicListsSectionProps) {
  const { t } = useI18n()

  return (
    <BaseListsSection
      lists={lists}
      loading={loading}
      actions={{
        canPlay: true,
        canView: true
      }}
      title={t('publicLists.title')}
      translationPrefix="publicLists"
      baseClassName="public-lists"
    />
  )
}