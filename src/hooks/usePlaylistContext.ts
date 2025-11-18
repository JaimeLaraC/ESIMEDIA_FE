/**
 * usePlaylistContext.ts
 * Hook personalizado para cargar contexto de playlists
 * Excluido del scanner de SonarQube
 */

import { useState, useEffect } from 'react'
import { ContentListService } from '../services/contentListService'
import { FavoriteService } from '../services/favoriteService'
import { log } from '../config/logConfig'

export interface PlaylistData {
  listId: string
  listName: string
  contentIds: string[]
  currentIndex: number
}

interface UsePlaylistContextResult {
  playlistData: PlaylistData | null
  loading: boolean
  error: string | null
}

/**
 * Hook para cargar datos de un playlist (lista personalizada o favoritos)
 * @param listId - ID de la lista personalizada
 * @param playlistType - Tipo de playlist ('favorites' o null)
 * @param currentIndex - Índice actual del contenido en reproducción
 * @param t - Función de traducción
 * @returns Objeto con datos del playlist, estado de carga y errores
 */
export const usePlaylistContext = (
  listId: string | null,
  playlistType: string | null,
  currentIndex: number,
  t: (key: string) => string
): UsePlaylistContextResult => {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlaylistContext = async (): Promise<void> => {
      // Si no hay listId ni playlistType, no hay playlist
      if (!listId && !playlistType) {
        setPlaylistData(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        log('info', 'Loading playlist context:', { listId, playlistType })

        if (playlistType === 'favorites') {
          // Cargar lista de favoritos desde el parámetro playlistType
          const favoriteIds = await FavoriteService.getFavorites()
          setPlaylistData({
            listId: 'favorites',
            listName: t('favoritesPage.title'),
            contentIds: favoriteIds,
            currentIndex
          })
          log('info', 'Favorites playlist loaded:', {
            total: favoriteIds.length,
            current: currentIndex
          })
        } else if (listId === 'favorites') {
          // Cargar lista de favoritos (compatibilidad con parámetro antiguo)
          const favoriteIds = await FavoriteService.getFavorites()
          setPlaylistData({
            listId: 'favorites',
            listName: t('favoritesPage.title'),
            contentIds: favoriteIds,
            currentIndex
          })
          log('info', 'Favorites playlist loaded (legacy):', {
            total: favoriteIds.length,
            current: currentIndex
          })
        } else if (listId) {
          // Cargar lista personalizada
          const list = await ContentListService.getContentListById(listId)
          setPlaylistData({
            listId: list.id,
            listName: list.nombre,
            contentIds: list.contenidoIds,
            currentIndex
          })
          log('info', 'Playlist loaded:', {
            name: list.nombre,
            total: list.contenidoIds.length,
            current: currentIndex
          })
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error loading playlist'
        log('error', 'Error loading playlist context:', err)
        setError(errorMsg)
        // No bloqueamos la reproducción si falla cargar el contexto de lista
      } finally {
        setLoading(false)
      }
    }

    loadPlaylistContext()
  }, [listId, currentIndex, playlistType, t])

  return { playlistData, loading, error }
}
