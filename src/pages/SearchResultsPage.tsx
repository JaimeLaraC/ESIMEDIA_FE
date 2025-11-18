// src/pages/SearchResultsPage.tsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { searchContent } from '../services/searchService'
import { filtersToUrlParams, initializeFiltersFromUrl, createPageUpdateHandler } from '../utils/searchFiltersUtils'
import type { SearchFilters as SearchFiltersType, SearchResult } from '../services/searchService'
import SearchFilters from '../components/SearchFilters'
import SearchResultsGrid from '../components/SearchResultsGrid'
import EmptySearchState from '../components/EmptySearchState'
import SearchPagination from '../customcomponents/SearchPagination'
import '../styles/pages/SearchPage.css'

export default function SearchResultsPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [filters, setFilters] = useState<SearchFiltersType>(() =>
    initializeFiltersFromUrl(searchParams)
  )

  // Realizar búsqueda cuando cambien query o filtros
  useEffect(() => {
    const performSearch = async () => {
      // Si no hay query, limpiar resultados
      if (!query.trim()) {
        setResults([])
        setTotalResults(0)
        setTotalPages(0)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await searchContent(query, filters)
        
        setResults(response.results)
        setTotalResults(response.total)
        setTotalPages(response.totalPages)
      } catch (err: any) {
        // Camuflar errores técnicos con mensajes más amigables
        let friendlyError = t('search.error.generic')
        
        if (err.message?.toLowerCase().includes('failed to fetch') || 
            err.message?.toLowerCase().includes('network') ||
            err.message?.toLowerCase().includes('connection')) {
          friendlyError = t('search.error.network') || 'Ups, ha habido un error en tu búsqueda. Inténtalo de nuevo.'
        }
        
        setError(friendlyError)
        setResults([])
        setTotalResults(0)
        setTotalPages(0)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query, filters, t])

  // Resetear página a 1 cuando cambie el query de búsqueda
  useEffect(() => {
    if (query.trim() && filters.page && filters.page > 1) {
      setFilters(prev => ({ ...prev, page: 1 }))
    }
  }, [query])

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = filtersToUrlParams(filters, query)
    setSearchParams(params, { replace: true })
  }, [filters, query, setSearchParams])

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
  }

  const handlePageChange = createPageUpdateHandler(setFilters)

  // Si no hay query, mostrar estado inicial
  if (!query.trim()) {
    return (
      <div className="search-results-page">
        <div className="search-empty-query">
          <h1>{t('search.noQuery.title')}</h1>
          <p>{t('search.noQuery.description')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results-page">
      {/* Header de búsqueda */}
      <div className="search-header">
        <h1>
          {query === '*'
            ? t('search.allContent.title') || 'Todo el contenido'
            : <>{t('search.resultsFor')}: <span className="query-highlight">"{query}"</span></>
          }
        </h1>
        {!isLoading && totalResults > 0 && (
          <p className="results-count">
            {totalResults} {totalResults === 1 
              ? t('search.resultSingular')
              : t('search.resultPlural')
            }
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="search-error">
          <p>{error}</p>
        </div>
      )}

      {/* Layout principal */}
      <div className="search-layout">
        {/* Filtros laterales */}
        <SearchFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Contenido principal */}
        <main className="search-content">
          {/* Grid de resultados */}
          <SearchResultsGrid 
            results={results}
            isLoading={isLoading}
          />

          {/* Paginación */}
          {results.length > 0 && (
            <div className="search-pagination-container">
              <SearchPagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Estado vacío */}
          {!isLoading && results.length === 0 && !error && (
            <EmptySearchState query={query} />
          )}
        </main>
      </div>
    </div>
  )
}