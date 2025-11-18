/**
 * Servicio para gestión de favoritos de usuario.
 * 
 * @author ESIMedia Team
 */

import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const USERS_API_URL = import.meta.env.VITE_USERS_API_URL

/**
 * Respuesta de favoritos
 */
export interface FavoriteResponse {
  favoriteContentIds: string[]
}

/**
 * Detalles de contenido para favoritos
 */
export interface ContentDetails {
  /** ID único del contenido */
  id: string
  /** Título del contenido */
  title: string
  /** Tipo de contenido (VIDEO, AUDIO, etc.) */
  contentType: string
  /** URL del thumbnail (opcional) */
  thumbnailUrl?: string
  /** Nombre del creador del contenido (opcional) */
  creatorName?: string
  /** Valoración promedio del contenido (opcional) */
  averageRating?: number
  /** Número de valoraciones del contenido (opcional) */
  ratingCount?: number
  /** Duración del contenido en formato HH:MM:SS (opcional) */
  duration?: string
}

/**
 * Servicio de favoritos
 */
export const FavoriteService = {
  /**
   * Obtiene la lista de favoritos del usuario actual
   * @returns {Promise<string[]>} Array de IDs de contenido en favoritos
   */
  async getFavorites(): Promise<string[]> {
    try {
      log('info', 'Fetching user favorites')

      const response = await fetchWithAuth(`${USERS_API_URL}/users/me/favorites`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error('Error al obtener favoritos')
      }

      const result: FavoriteResponse = await response.json()
      log('info', `Found ${result.favoriteContentIds.length} favorites`)
      return result.favoriteContentIds
    } catch (error) {
      log('error', 'Error fetching favorites:', error)
      throw error
    }
  },

  /**
   * Añade un contenido a favoritos
   * @param {string} contentId - ID del contenido a añadir
   * @returns {Promise<string[]>} Array actualizado de IDs en favoritos
   */
  async addFavorite(contentId: string): Promise<string[]> {
    try {
      log('info', 'Adding content to favorites:', contentId)

      const response = await fetchWithAuth(`${USERS_API_URL}/users/me/favorites/${contentId}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Error al añadir a favoritos')
      }

      const result: FavoriteResponse = await response.json()
      log('info', 'Content added to favorites successfully')
      return result.favoriteContentIds
    } catch (error) {
      log('error', 'Error adding to favorites:', error)
      throw error
    }
  },

  /**
   * Elimina un contenido de favoritos
   * @param {string} contentId - ID del contenido a eliminar
   * @returns {Promise<string[]>} Array actualizado de IDs en favoritos
   */
  async removeFavorite(contentId: string): Promise<string[]> {
    try {
      log('info', 'Removing content from favorites:', contentId)

      const response = await fetchWithAuth(`${USERS_API_URL}/users/me/favorites/${contentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos')
      }

      const result: FavoriteResponse = await response.json()
      log('info', 'Content removed from favorites successfully')
      return result.favoriteContentIds
    } catch (error) {
      log('error', 'Error removing from favorites:', error)
      throw error
    }
  },

  /**
   * Verifica si un contenido está en favoritos
   * @param {string} contentId - ID del contenido a verificar
   * @returns {Promise<boolean>} True si está en favoritos, false en caso contrario
   */
  async isFavorite(contentId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites()
      return favorites.includes(contentId)
    } catch (error) {
      log('error', 'Error checking favorite status:', error)
      return false
    }
  },

  /**
   * Obtiene detalles de múltiples contenidos por lotes
   * @param {string[]} contentIds - Array de IDs de contenido
   * @returns {Promise<Map<string, ContentDetails>>} Mapa con detalles de contenido indexados por ID
   */
  async getContentDetailsBatch(contentIds: string[]): Promise<Map<string, ContentDetails>> {
    try {
      log('info', 'Fetching content details batch for favorites:', contentIds.length)

      const response = await fetch(`${import.meta.env.VITE_USERS_API_URL}/api/content/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ contentIds })
      })

      if (!response.ok) {
        throw new Error('Error al obtener detalles de contenidos')
      }

      const data = await response.json()
      const allContents = data.contents || []

      const detailsMap = new Map<string, ContentDetails>()
      allContents.forEach((content: any) => {
        const contentId = content.id

        detailsMap.set(contentId, {
          id: contentId,
          title: content.title,
          contentType: content.contentType,
          thumbnailUrl: content.thumbnailUrl,
          creatorName: content.creatorName,
          averageRating: content.averageRating,
          ratingCount: content.ratingCount,
          duration: content.duration
          
        })
      })

      log('info', `Loaded details for ${detailsMap.size} contents`)
      return detailsMap
    } catch (error) {
      log('error', 'Error fetching content details batch:', error)
      throw error
    }
  },

  /**
 * Reordena la lista de favoritos del usuario.
 * @param {string[]} orderedContentIds - Array de IDs de contenido en el nuevo orden
 * @returns {Promise<string[]>} Array actualizado de IDs en favoritos
 */
async reorderFavorites(orderedContentIds: string[]): Promise<string[]> {
  try {
    log('info', 'Reordering favorites');

    const response = await fetchWithAuth(`${USERS_API_URL}/users/me/favorites`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderedContentIds) // Enviamos el array como body
    });

    if (!response.ok) {
      throw new Error('Error al reordenar favoritos');
    }

    const result: FavoriteResponse = await response.json();
    log('info', 'Favorites reordered successfully');
    return result.favoriteContentIds;
  } catch (error) {
    log('error', 'Error reordering favorites:', error);
    throw error;
  }
},
}