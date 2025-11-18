/**
 * usePlaylistNavigation.ts
 * Hook personalizado para navegación en playlists
 * Excluido del scanner de SonarQube
 */

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { log } from '../config/logConfig'

interface PlaylistData {
  listId: string
  listName: string
  contentIds: string[]
  currentIndex: number
}

interface UsePlaylistNavigationParams {
  playlistData: PlaylistData | null
  activeIndex: number
  playlistType?: string | null
  listId?: string | null
  playlistName?: string | null
}

interface PlaylistNavigationResult {
  handlePrevious: () => void
  handleNext: () => void
  handleContentEnd: () => void
  hasPrevious: boolean
  hasNext: boolean
}

/**
 * Hook para gestionar la navegación en playlists
 * Incluye soporte para navegación por teclado (flechas izquierda/derecha)
 * @returns Objeto con manejadores de navegación y estado de disponibilidad
 */
export const usePlaylistNavigation = ({
  playlistData,
  activeIndex,
  playlistType,
  listId,
  playlistName
}: UsePlaylistNavigationParams): PlaylistNavigationResult => {
  const navigate = useNavigate()

  /**
   * Construye la URL para navegar a un contenido específico del playlist
   */
  const buildPlaylistUrl = (contentId: string, index: number): string => {
    const paramName = playlistType ? 'playlistType' : 'list'
    const paramValue = playlistType || listId
    let url = `/play/${contentId}?${paramName}=${paramValue}&index=${index}`

    if (playlistName) {
      url += `&playlistName=${encodeURIComponent(playlistName)}`
    }

    return url
  }

  /**
   * Navega al contenido anterior en el playlist
   */
  const handlePrevious = (): void => {
    if (!playlistData || activeIndex === 0) return

    const prevIndex = activeIndex - 1
    const prevContentId = playlistData.contentIds[prevIndex]
    log('info', 'Navigating to previous:', { prevIndex, prevContentId })

    navigate(buildPlaylistUrl(prevContentId, prevIndex))
  }

  /**
   * Navega al siguiente contenido en el playlist
   */
  const handleNext = (): void => {
    if (!playlistData || activeIndex >= playlistData.contentIds.length - 1) return

    const nextIndex = activeIndex + 1
    const nextContentId = playlistData.contentIds[nextIndex]
    log('info', 'Navigating to next:', { nextIndex, nextContentId })

    navigate(buildPlaylistUrl(nextContentId, nextIndex))
  }

  /**
   * Reproduce automáticamente el siguiente contenido cuando termina el actual
   */
  const handleContentEnd = (): void => {
    if (playlistData && activeIndex < playlistData.contentIds.length - 1) {
      log('info', 'Content ended, auto-playing next')
      handleNext()
    }
  }

  /**
   * Configura los atajos de teclado para navegación (flechas izquierda/derecha)
   */
  useEffect(() => {
    if (!playlistData) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // No activar si estamos escribiendo en un input o textarea
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        return
      }

      // Flecha izquierda: anterior
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        e.preventDefault()
        handlePrevious()
        log('info', 'Keyboard shortcut: Previous')
      }
      // Flecha derecha: siguiente
      else if (
        e.key === 'ArrowRight' &&
        activeIndex < playlistData.contentIds.length - 1
      ) {
        e.preventDefault()
        handleNext()
        log('info', 'Keyboard shortcut: Next')
      }
    }

    globalThis.addEventListener('keydown', handleKeyPress)
    return () => globalThis.removeEventListener('keydown', handleKeyPress)
  }, [playlistData, activeIndex])

  return {
    handlePrevious,
    handleNext,
    handleContentEnd,
    hasPrevious: playlistData ? activeIndex > 0 : false,
    hasNext: playlistData ? activeIndex < playlistData.contentIds.length - 1 : false
  }
}
