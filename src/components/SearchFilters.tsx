import { useI18n } from '../hooks/useI18n'
import { useSearchFilters } from '../hooks/useSearchFilters'
import type { SearchFilters as Filters } from '../services/searchService'
import '../styles/components/Combobox.css'

interface SearchFiltersProps {
  readonly filters: Filters
  readonly onFilterChange: (filters: Filters) => void
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const { t } = useI18n()
  const {
    sortOpen,
    toggleSortOpen,
    sortContainerRef,
    handleTypeChange,
    handleVipToggle,
    handleDurationChange,
    handleSortChange,
    handleReset
  } = useSearchFilters(filters, onFilterChange)

  return (
    <aside className="search-filters">
      <div className="filters-header">
        <h3>{t('search.filters.title') || 'Filtros'}</h3>
        <button 
          className="btn-text-small" 
          onClick={handleReset}
          type="button"
        >
          {t('search.filters.reset') || 'Limpiar'}
        </button>
      </div>

      {/* Tipo de contenido */}
      <div className="filter-group">
        <h4 className="filter-label">{t('search.filters.type') || 'Tipo de contenido'}</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="all"
              checked={filters.type === 'all' || !filters.type}
              onChange={() => handleTypeChange('all')}
            />
            <span>{t('search.filters.all') || 'Todos'}</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="audio"
              checked={filters.type === 'audio'}
              onChange={() => handleTypeChange('audio')}
            />
            <span>{t('search.filters.audio') || 'Audio'}</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="type"
              value="video"
              checked={filters.type === 'video'}
              onChange={() => handleTypeChange('video')}
            />
            <span>{t('search.filters.video') || 'Video'}</span>
          </label>
        </div>
      </div>

      {/* Premium/VIP */}
      <div className="filter-group">
        <h4 className="filter-label">{t('search.filters.premium') || 'Tipo de acceso'}</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={filters.vipOnly || false}
              onChange={handleVipToggle}
            />
            <span>{t('search.filters.vipOnly') || 'Solo Premium'}</span>
          </label>
        </div>
      </div>

      {/* Ordenar por */}
      <div className="filter-group">
        <h4 className="filter-label">{t('search.filters.sortBy') || 'Ordenar por'}</h4>
        <div className="combobox-container combobox-container-full" ref={sortContainerRef}>
          <button
            type="button"
            className="combobox-button"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            onClick={toggleSortOpen}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSortOpen(true)
              }
            }}
          >
            <span className="combobox-text">
              {filters.sortBy === 'relevance' && (t('search.sort.relevance') || 'Relevancia')}
              {filters.sortBy === 'date' && (t('search.sort.date') || 'Fecha')}
              {filters.sortBy === 'rating' && (t('search.sort.rating') || 'Valoración')}
              {filters.sortBy === 'views' && (t('search.sort.views') || 'Vistas')}
            </span>
            <svg className="combobox-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {sortOpen && (
            <div
              className="combobox-menu"
              role="menu"
              tabIndex={0}
            >
              <button
                type="button"
                role="menuitemradio"
                aria-checked={filters.sortBy === 'relevance'}
                className={`combobox-item ${filters.sortBy === 'relevance' ? 'selected' : ''}`}
                onClick={() => handleSortChange('relevance')}
              >
                <span className="combobox-item-label">{t('search.sort.relevance') || 'Relevancia'}</span>
                {filters.sortBy === 'relevance' && <span className="combobox-check">✓</span>}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={filters.sortBy === 'date'}
                className={`combobox-item ${filters.sortBy === 'date' ? 'selected' : ''}`}
                onClick={() => handleSortChange('date')}
              >
                <span className="combobox-item-label">{t('search.sort.date') || 'Fecha'}</span>
                {filters.sortBy === 'date' && <span className="combobox-check">✓</span>}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={filters.sortBy === 'rating'}
                className={`combobox-item ${filters.sortBy === 'rating' ? 'selected' : ''}`}
                onClick={() => handleSortChange('rating')}
              >
                <span className="combobox-item-label">{t('search.sort.rating') || 'Valoración'}</span>
                {filters.sortBy === 'rating' && <span className="combobox-check">✓</span>}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={filters.sortBy === 'views'}
                className={`combobox-item ${filters.sortBy === 'views' ? 'selected' : ''}`}
                onClick={() => handleSortChange('views')}
              >
                <span className="combobox-item-label">{t('search.sort.views') || 'Vistas'}</span>
                {filters.sortBy === 'views' && <span className="combobox-check">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Duración */}
      <div className="filter-group">
        <h4 className="filter-label">{t('search.filters.duration') || 'Duración'}</h4>
        <div className="duration-options">
          <button
            type="button"
            className={`duration-btn ${filters.maxDuration === 5 ? 'active' : ''}`}
            onClick={() => handleDurationChange(0, 5)}
          >
            {'< 5 min'}
          </button>
          <button
            type="button"
            className={`duration-btn ${filters.minDuration === 5 && filters.maxDuration === 20 ? 'active' : ''}`}
            onClick={() => handleDurationChange(5, 20)}
          >
            {'5-20 min'}
          </button>
          <button
            type="button"
            className={`duration-btn ${filters.minDuration === 20 ? 'active' : ''}`}
            onClick={() => handleDurationChange(20, 999)}
          >
            {'> 20 min'}
          </button>
        </div>
      </div>
    </aside>
  )
}