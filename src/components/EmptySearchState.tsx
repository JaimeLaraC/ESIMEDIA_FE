import { useI18n } from '../hooks/useI18n'

interface EmptySearchStateProps {
  readonly query: string
}

export default function EmptySearchState({ query }: EmptySearchStateProps) {
  const { t } = useI18n()

  return (
    <div className="empty-search-state">
      <div className="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
      </div>
      <h2 className="empty-title">
        {t('search.empty.title') || 'No se encontraron resultados'}
      </h2>
      <p className="empty-description">
        {t('search.empty.description') || `No encontramos ningún contenido para "${query}"`}
      </p>
      <div className="empty-suggestions">
        <p>{t('search.empty.suggestions') || 'Intenta:'}</p>
        <ul>
          <li>{t('search.empty.tip1') || 'Usar palabras diferentes'}</li>
          <li>{t('search.empty.tip2') || 'Verificar la ortografía'}</li>
          <li>{t('search.empty.tip3') || 'Usar términos más generales'}</li>
        </ul>
      </div>
    </div>
  )
}