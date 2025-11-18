// src/utils/searchFiltersUtils.ts
import type { SearchFilters } from '../services/searchService'

/**
 * Convierte un objeto de filtros de búsqueda a parámetros URL
 * Solo incluye parámetros que no sean valores por defecto
 */
export function filtersToUrlParams(filters: SearchFilters, query?: string): URLSearchParams {
  const params = new URLSearchParams()

  if (query) {
    params.set('q', query)
  }

  if (filters.type && filters.type !== 'all') {
    params.set('type', filters.type)
  }

  if (filters.vipOnly) {
    params.set('vipOnly', 'true')
  }

  if (filters.sortBy && filters.sortBy !== 'relevance') {
    params.set('sortBy', filters.sortBy)
  }

  if (filters.page && filters.page > 1) {
    params.set('page', String(filters.page))
  }

  return params
}

/**
 * Inicializa filtros de búsqueda desde parámetros URL
 * Usa valores por defecto si no hay parámetros
 */
export function initializeFiltersFromUrl(searchParams: URLSearchParams): SearchFilters {
  return {
    type: (searchParams.get('type') as SearchFilters['type']) || 'all',
    vipOnly: searchParams.get('vipOnly') === 'true',
    minDuration: 0,
    maxDuration: 999,
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance',
    page: Number.parseInt(searchParams.get('page') || '1', 10),
    pageSize: 20
  }
}

/**
 * Crea una función para actualizar la página en los filtros
 * Útil para handlers de paginación
 */
export function createPageUpdateHandler(
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>
) {
  return (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }
}