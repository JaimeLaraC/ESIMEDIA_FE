/**
 * useSearchFilters.ts
 * Hook personalizado para gestión de filtros de búsqueda
 * Excluido del scanner de SonarQube
 */

import { useRef, useEffect, useState } from 'react'
import type { SearchFilters } from '../services/searchService'
import { useComboboxPositioning } from './useComboboxPositioning'

interface UseSearchFiltersResult {
  sortOpen: boolean
  toggleSortOpen: () => void
  sortContainerRef: React.RefObject<HTMLDivElement>
  handleTypeChange: (type: 'all' | 'audio' | 'video') => void
  handleVipToggle: () => void
  handleDurationChange: (min: number, max: number) => void
  handleSortChange: (sortBy: SearchFilters['sortBy']) => void
  handleReset: () => void
}

/**
 * Hook para gestionar los filtros de búsqueda
 * Incluye lógica de dropdown y click-outside
 * @param filters - Estado actual de los filtros
 * @param onFilterChange - Callback para cambios de filtro
 * @returns Objeto con handlers y estado del componente
 */
export const useSearchFilters = (
  filters: SearchFilters,
  onFilterChange: (filters: SearchFilters) => void
): UseSearchFiltersResult => {
  const [sortOpen, setSortOpen] = useState(false)
  const { containerRef: sortContainerRef, checkSpaceAndPosition: checkSortSpace } = useComboboxPositioning()

  /**
   * Configura listeners para cerrar dropdown al hacer click fuera o presionar Escape
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!sortContainerRef.current?.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSortOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [sortContainerRef])

  /**
   * Alterna el estado del dropdown de ordenamiento
   */
  const toggleSortOpen = (): void => {
    if (!sortOpen) {
      checkSortSpace()
    }
    setSortOpen((s) => !s)
  }

  /**
   * Cambia el tipo de contenido (todos, audio, video)
   */
  const handleTypeChange = (type: 'all' | 'audio' | 'video'): void => {
    onFilterChange({ ...filters, type, page: 1 })
  }

  /**
   * Alterna el filtro de solo contenido premium/VIP
   */
  const handleVipToggle = (): void => {
    onFilterChange({ ...filters, vipOnly: !filters.vipOnly, page: 1 })
  }

  /**
   * Cambia el rango de duración del contenido
   */
  const handleDurationChange = (min: number, max: number): void => {
    onFilterChange({
      ...filters,
      minDuration: min,
      maxDuration: max,
      page: 1
    })
  }

  /**
   * Cambia el ordenamiento de resultados
   */
  const handleSortChange = (sortBy: SearchFilters['sortBy']): void => {
    onFilterChange({ ...filters, sortBy, page: 1 })
    setSortOpen(false)
  }

  /**
   * Reinicia todos los filtros a sus valores por defecto
   */
  const handleReset = (): void => {
    onFilterChange({
      type: 'all',
      vipOnly: false,
      minDuration: 0,
      maxDuration: 999,
      sortBy: 'relevance',
      page: 1,
      pageSize: 20
    })
  }

  return {
    sortOpen,
    toggleSortOpen,
    sortContainerRef,
    handleTypeChange,
    handleVipToggle,
    handleDurationChange,
    handleSortChange,
    handleReset
  }
}
