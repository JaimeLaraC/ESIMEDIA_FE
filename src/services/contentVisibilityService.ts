// src/services/contentVisibilityService.ts
import { log } from '../config/logConfig'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

/**
 * Respuesta del endpoint de cambio de visibilidad
 */
export interface VisibilityResponse {
  success: boolean
  contentId: string
  newState: 'VISIBLE' | 'OCULTO'
  message: string
  error?: string
}

/**
 * Servicio para gestionar la visibilidad de contenidos.
 * Permite a los creadores activar/desactivar la visibilidad de su contenido.
 */
export const contentVisibilityService = {
  /**
   * Cambia la visibilidad de un contenido (VISIBLE <-> OCULTO).
   * Solo el creador del contenido puede modificar su visibilidad.
   * 
   * @param contentId - ID del contenido
   * @param newState - Nuevo estado de visibilidad ('VISIBLE' o 'OCULTO')
   * @returns Promise con la respuesta del servidor
   * @throws Error si la petición falla
   */
  async toggleVisibility(
    contentId: string,
    newState: 'VISIBLE' | 'OCULTO'
  ): Promise<VisibilityResponse> {
    try {
      log('info', `🔄 Cambiando visibilidad del contenido ${contentId} a ${newState}`)

      const response = await fetch(`${API_BASE_URL}/api/content/${contentId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Envía cookies HttpOnly automáticamente
        body: JSON.stringify({ state: newState }),
      })

      const data = await response.json()

      if (!response.ok) {
        log('error', `❌ Error al cambiar visibilidad: ${data.error || response.statusText}`)
        throw new Error(data.error || 'Error al cambiar la visibilidad')
      }

      log('info', `✅ Visibilidad actualizada: ${contentId} -> ${data.newState}`)
      return data
    } catch (error) {
      log('error', '❌ Error en toggleVisibility:', error)
      throw error
    }
  },

  /**
   * Cambia un contenido a VISIBLE
   * 
   * @param contentId - ID del contenido
   * @returns Promise con la respuesta del servidor
   */
  async makeVisible(contentId: string): Promise<VisibilityResponse> {
    return this.toggleVisibility(contentId, 'VISIBLE')
  },

  /**
   * Cambia un contenido a OCULTO
   * 
   * @param contentId - ID del contenido
   * @returns Promise con la respuesta del servidor
   */
  async makeHidden(contentId: string): Promise<VisibilityResponse> {
    return this.toggleVisibility(contentId, 'OCULTO')
  },
}
