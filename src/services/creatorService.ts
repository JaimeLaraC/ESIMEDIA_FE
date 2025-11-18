// src/services/creatorService.ts

import { fetchWithAuth } from '../utils/fetchWithAuth'
import defaultAvatar from '../assets/profile_images/default.svg'

const API_BASE_URL_USERS = import.meta.env.VITE_USERS_API_URL

export async function registerCreator(formData: {
  email: string
  firstName: string
  lastName: string
  alias: string
  channelDescription: string
  contentType: string
  specialty: string
  profileImage: string
}) {
  const response = await fetchWithAuth(`${API_BASE_URL_USERS}/auth/registerCreator`, {
    method: 'POST',
    body: JSON.stringify({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      alias: formData.alias,
      channelDescription: formData.channelDescription,
      contentType: formData.contentType,
      specialty: formData.specialty,
      fotoPerfilUrl: formData.profileImage || defaultAvatar,
    }),
  })

  let result: any
  try {
    result = await response.json()
  } catch {
    result = { success: false, message: 'No se pudo registrar el creador' }
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Error en el registro de creador')
  }
  
  return result
}

/**
 * Obtiene el contenido del creador autenticado
 */
export async function getMyContent() {
  console.log('🚀 [CreatorService] Iniciando petición a /content/creator/me')
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL_CONTENT}/content/creator/me`, {
      method: 'GET'
    })

    console.log('📥 [CreatorService] Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [CreatorService] Error en respuesta:', errorText)
      
      if (response.status === 401) {
        throw new Error('No autenticado - verifica que tengas una sesión activa')
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos de creador')
      }
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }
      
      throw new Error(errorData.error || `Error ${response.status}: ${errorText}`)
    }

    const contents = await response.json()
    console.log('✅ [CreatorService] Contenido recibido:', {
      cantidad: Array.isArray(contents) ? contents.length : 'No es array',
      primeros3: Array.isArray(contents) ? contents.slice(0, 3) : contents
    })
    
    return contents
  } catch (error) {
    console.error('💥 [CreatorService] Excepción capturada:', error)
    throw error
  }
}