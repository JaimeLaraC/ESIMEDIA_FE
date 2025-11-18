/**
 * Servicio para gestión de listas de contenido.
 *
 * Proporciona métodos para crear, leer, actualizar y eliminar listas de contenido,
 * así como gestionar el contenido dentro de las listas. Todas las operaciones
 * requieren autenticación y se comunican con la API REST del backend.
 *
 * @author ESIMedia Team
 * @version 1.0.0
 */

import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

/** URL base de la API de contenido */
export const CONTENT_API_URL = import.meta.env.VITE_USERS_API_URL

/**
 * Tipos de visibilidad disponibles para las listas de contenido.
 * Define quién puede acceder a la lista.
 */
export type VisibilityType = 'PRIVADA' | 'RESTRINGIDA' | 'NO_LISTADA' | 'PUBLICA'

/**
 * Datos requeridos para crear una nueva lista de contenido.
 */
export interface CreateListRequest {
  /** Nombre de la lista (requerido) */
  nombre: string
  /** Descripción opcional de la lista */
  descripcion?: string
  /** Nivel de visibilidad de la lista */
  visibilidad: VisibilityType
  /** IDs de los contenidos que formarán la lista */
  contenidoIds: string[]
}

/**
 * Datos para actualizar una lista existente.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 */
export interface UpdateListRequest {
  /** Nuevo nombre para la lista */
  nombre?: string
  /** Nueva descripción para la lista */
  descripcion?: string
  /** Nuevo nivel de visibilidad */
  visibilidad?: VisibilityType
}

/**
 * Respuesta completa de una lista de contenido desde la API.
 * Incluye todos los metadatos y contenido de la lista.
 */
export interface ContentListResponse {
  /** ID único de la lista */
  id: string
  /** Nombre de la lista */
  nombre: string
  /** Descripción opcional de la lista */
  descripcion?: string
  /** Nivel de visibilidad actual de la lista */
  visibilidad: string
  /** ID del usuario creador de la lista */
  creadorId: string
  /** Fecha de creación en formato ISO string */
  createdAt: string
  /** Fecha de última actualización en formato ISO string */
  updatedAt: string
  /** Array de IDs de contenidos en la lista */
  contenidoIds: string[]
  /** Número total de elementos en la lista */
  size: number
}

/**
 * Servicio de listas de contenido.
 *
 * Objeto singleton que proporciona métodos para interactuar con la API
 * de listas de contenido. Todas las operaciones incluyen logging detallado
 * y manejo de errores consistente.
 */
export const ContentListService = {
  /**
   * Crea una nueva lista de contenido para el usuario autenticado.
   *
   * @async
   * @param {CreateListRequest} data - Datos de la lista a crear
   * @returns {Promise<ContentListResponse>} Lista creada con todos sus datos
   * @throws {Error} Si la creación falla o hay problemas de validación
   * @example
   * ```typescript
   * const newList = await ContentListService.createContentList({
   *   nombre: 'Mi Lista Favorita',
   *   descripcion: 'Mis canciones favoritas',
   *   visibilidad: 'PRIVADA',
   *   contenidoIds: ['content-1', 'content-2']
   * });
   * ```
   */
  async createContentList(data: CreateListRequest): Promise<ContentListResponse> {
    try {
      log('info', 'Creating content list:', data.nombre)
      log('info', 'Payload original:', data)
      log('info', 'JSON stringified:', JSON.stringify(data))

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists`, {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        log('error', 'Backend error response:', error)
        throw new Error(error.error || JSON.stringify(error) || 'Error al crear la lista')
      }

      const result = await response.json()
      log('info', 'List created successfully:', result.id)
      return result
    } catch (error) {
      log('error', 'Error creating content list:', error)
      throw error
    }
  },

  /**
   * Obtiene los detalles completos de una lista específica por su ID.
   *
   * @async
   * @param {string} id - ID único de la lista
   * @returns {Promise<ContentListResponse>} Datos completos de la lista
   * @throws {Error} Si la lista no existe o hay problemas de permisos
   * @example
   * ```typescript
   * const list = await ContentListService.getContentListById('list-123');
   * console.log(list.nombre); // "Mi Lista Favorita"
   * ```
   */
  async getContentListById(id: string): Promise<ContentListResponse> {
    try {
      log('info', 'Fetching content list:', id)

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/${id}`, {
        method: 'GET'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener la lista')
      }

      return await response.json()
    } catch (error) {
      log('error', 'Error fetching content list:', error)
      throw error
    }
  },

  /**
   * Obtiene todas las listas personales del usuario autenticado.
   *
   * @async
   * @returns {Promise<ContentListResponse[]>} Array de listas del usuario
   * @throws {Error} Si hay problemas de conexión o autenticación
   * @example
   * ```typescript
   * const myLists = await ContentListService.getMyContentLists();
   * console.log(`Tienes ${myLists.length} listas`);
   * ```
   */
  async getMyContentLists(): Promise<ContentListResponse[]> {
    try {
      log('info', 'Fetching my content lists')

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/user/me`, {
        method: 'GET'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener las listas')
      }

      const result = await response.json()
      log('info', `Found ${result.length} lists`)
      return result
    } catch (error) {
      log('error', 'Error fetching my content lists:', error)
      throw error
    }
  },

  /**
   * Actualiza los datos de una lista existente.
   *
   * @async
   * @param {string} id - ID de la lista a actualizar
   * @param {UpdateListRequest} data - Datos a actualizar (parciales)
   * @returns {Promise<ContentListResponse>} Lista actualizada
   * @throws {Error} Si la lista no existe o hay problemas de permisos
   * @example
   * ```typescript
   * const updatedList = await ContentListService.updateContentList('list-123', {
   *   nombre: 'Nuevo Nombre',
   *   visibilidad: 'PUBLICA'
   * });
   * ```
   */
  async updateContentList(id: string, data: UpdateListRequest): Promise<ContentListResponse> {
    try {
      log('info', 'Updating content list:', id)

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar la lista')
      }

      const result = await response.json()
      log('info', 'List updated successfully')
      return result
    } catch (error) {
      log('error', 'Error updating content list:', error)
      throw error
    }
  },

  /**
   * Elimina permanentemente una lista de contenido.
   *
   * @async
   * @param {string} id - ID de la lista a eliminar
   * @throws {Error} Si la lista no existe o hay problemas de permisos
   * @example
   * ```typescript
   * await ContentListService.deleteContentList('list-123');
   * console.log('Lista eliminada exitosamente');
   * ```
   */
  async deleteContentList(id: string): Promise<void> {
    try {
      log('info', 'Deleting content list:', id)

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar la lista')
      }

      log('info', 'List deleted successfully')
    } catch (error) {
      log('error', 'Error deleting content list:', error)
      throw error
    }
  },

  /**
   * Agrega un elemento de contenido a una lista existente.
   *
   * @async
   * @param {string} listId - ID de la lista destino
   * @param {string} contentId - ID del contenido a agregar
   * @returns {Promise<ContentListResponse>} Lista actualizada con el nuevo contenido
   * @throws {Error} Si la lista/contenido no existen o hay problemas de permisos
   * @example
   * ```typescript
   * const updatedList = await ContentListService.addContentToList('list-123', 'content-456');
   * console.log(`Lista ahora tiene ${updatedList.size} elementos`);
   * ```
   */
  async addContentToList(listId: string, contentId: string): Promise<ContentListResponse> {
    try {
      log('info', `Adding content ${contentId} to list ${listId}`)

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/${listId}/content/${contentId}`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al agregar contenido')
      }

      const result = await response.json()
      log('info', 'Content added successfully')
      return result
    } catch (error) {
      log('error', 'Error adding content to list:', error)
      throw error
    }
  },

  /**
   * Remueve un elemento de contenido de una lista.
   *
   * @async
   * @param {string} listId - ID de la lista origen
   * @param {string} contentId - ID del contenido a remover
   * @returns {Promise<ContentListResponse>} Lista actualizada sin el contenido removido
   * @throws {Error} Si la lista/contenido no existen o hay problemas de permisos
   * @example
   * ```typescript
   * const updatedList = await ContentListService.removeContentFromList('list-123', 'content-456');
   * console.log(`Lista ahora tiene ${updatedList.size} elementos`);
   * ```
   */
  async removeContentFromList(listId: string, contentId: string): Promise<ContentListResponse> {
    try {
      log('info', `Removing content ${contentId} from list ${listId}`)

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/${listId}/content/${contentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar contenido')
      }

      const result = await response.json()
      log('info', 'Content removed successfully')
      return result
    } catch (error) {
      log('error', 'Error removing content from list:', error)
      throw error
    }
  },

  /**
   * Obtiene todas las listas públicas disponibles para todos los usuarios.
   *
   * @async
   * @returns {Promise<ContentListResponse[]>} Array de listas públicas
   * @throws {Error} Si hay problemas de conexión
   * @example
   * ```typescript
   * const publicLists = await ContentListService.getPublicContentLists();
   * console.log(`${publicLists.length} listas públicas disponibles`);
   * ```
   */
  async getPublicContentLists(): Promise<ContentListResponse[]> {
    try {
      log('info', 'Fetching public content lists')

      const response = await fetchWithAuth(`${CONTENT_API_URL}/api/content/lists/public`, {
        method: 'GET'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener las listas públicas')
      }

      const result = await response.json()
      log('info', `Found ${result.length} public lists`)
      return result
    } catch (error) {
      log('error', 'Error fetching public content lists:', error)
      throw error
    }
  },
}
