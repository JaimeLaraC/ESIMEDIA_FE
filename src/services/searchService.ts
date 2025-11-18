// src/services/searchService.ts
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

export interface SearchFilters {
  type?: 'audio' | 'video' | 'all'
  vipOnly?: boolean
  minDuration?: number
  maxDuration?: number
  tags?: string[]
  sortBy?: 'relevance' | 'date' | 'rating' | 'views'
  page?: number
  pageSize?: number
}

export interface SearchResult {
  id: string
  title: string
  thumbnail: string
  addedAt: string
  rating: number
  type: 'audio' | 'video'
  duration: string
  views: number
  creator: string // Campo 'creator' debe venir del backend - actualmente no implementado en /content/search
  isPremium: boolean
  ratingCount: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Busca contenido en el backend
 */
export async function searchContent(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResponse> {
  try {
    const params = new URLSearchParams()
    params.append('q', query)

    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type)
    }
    if (filters.vipOnly !== undefined) {
      params.append('vipOnly', String(filters.vipOnly))
    }
    if (filters.minDuration !== undefined) {
      params.append('minDuration', String(filters.minDuration))
    }
    if (filters.maxDuration !== undefined) {
      params.append('maxDuration', String(filters.maxDuration))
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','))
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    if (filters.page) {
      params.append('page', String(filters.page))
    }
    if (filters.pageSize) {
      params.append('pageSize', String(filters.pageSize))
    }

    const fullUrl = `${API_BASE_URL}/api/content/search?${params.toString()}`
    
    // Log de debug para ver la petición exacta
    console.log('[SEARCH DEBUG] Enviando petición:', {
      url: fullUrl,
      query: query,
      queryParam: params.get('q'),
      filters: filters,
      allParams: Object.fromEntries(params.entries())
    })

    const response = await fetchWithAuth(fullUrl, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al buscar contenido')
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error searching content:', error)
    throw new Error(error.message || 'Error al buscar contenido')
  }
}

/**
 * Obtiene todo el contenido disponible con filtros opcionales
 */
export async function getAllContent(
  filters: SearchFilters = {}
): Promise<SearchResponse> {
  try {
    const params = new URLSearchParams()

    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type)
    }
    if (filters.vipOnly !== undefined) {
      params.append('vipOnly', String(filters.vipOnly))
    }
    if (filters.minDuration !== undefined) {
      params.append('minDuration', String(filters.minDuration))
    }
    if (filters.maxDuration !== undefined) {
      params.append('maxDuration', String(filters.maxDuration))
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','))
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    if (filters.page) {
      params.append('page', String(filters.page))
    }
    if (filters.pageSize) {
      params.append('pageSize', String(filters.pageSize))
    }

    const url = params.toString() 
      ? `${API_BASE_URL}/api/content/getAll?${params.toString()}`
      : `${API_BASE_URL}/api/content/getAll`

    const response = await fetchWithAuth(url, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Error al obtener contenido')
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error getting all content:', error)
    throw new Error(error.message || 'Error al obtener contenido')
  }
}

/**
 * Obtiene sugerencias de búsqueda (para autocompletado futuro)
 */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/content/search/suggestions?q=${encodeURIComponent(query)}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error('Error getting search suggestions:', error)
    return []
  }
}