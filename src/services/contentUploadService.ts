// src/services/contentService.ts
import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

export interface UploadAudioRequest {
  audioFile: File
  title: string
  description?: string
  tags: string[]  // Mínimo 1 tag obligatorio
  maxQuality: string     
  vipOnly: boolean
  state?: 'VISIBLE' | 'OCULTO'
  minAge?: number
  thumbnailFile?: File  
  availableUntil?: string
}

export interface UploadVideoRequest {
  videoUrl: string
  title: string
  description?: string
  tags: string[]  // Mínimo 1 tag obligatorio
  maxQuality: string
  vipOnly: boolean
  state?: 'VISIBLE' | 'OCULTO'
  minAge?: number
  thumbnailFile?: File
  availableUntil?: string
}

export interface ContentResponse {
  content: {
    id: string
    title: string
    description?: string
    creatorId: string
    contentType: 'AUDIO' | 'VIDEO'
    tags: string[]
    maxQuality: string
    vipOnly: boolean
    state: string
    createdAt: string
    views: number
    likes: number
  }
  creator: {
    id: string
    nombre: string
    email: string
  }
}

/**
 * Sube un archivo de audio al backend
 */
export async function uploadAudio(data: UploadAudioRequest): Promise<ContentResponse> {
  try {
    log('info', 'Subiendo audio al backend:', data.title)

    const formData = new FormData()
    
    // Archivo de audio (obligatorio)
    formData.append('audioFile', data.audioFile)
    
    // Título (obligatorio)
    formData.append('title', data.title)
    
    // Descripción (opcional)
    if (data.description) {
      formData.append('description', data.description)
    }
    
    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        formData.append('tags', tag)
      }
    }
    
    // Duración (obligatorio)
    formData.append('maxQuality', data.maxQuality)
    
    // VIP only (obligatorio)
    formData.append('vipOnly', data.vipOnly.toString())
    
    // Estado (opcional, backend usa VISIBLE por defecto)
    if (data.state) {
      formData.append('state', data.state)
    }
    
    // Edad mínima (opcional)
    if (data.minAge !== undefined && data.minAge !== null) {
      formData.append('minAge', data.minAge.toString())
    }
    
    if (data.thumbnailFile) {
      formData.append('thumbnailFile', data.thumbnailFile)
    }
    
    // Disponible hasta (opcional)
    if (data.availableUntil) {
      formData.append('availableUntil', data.availableUntil)
    }

    log('info', 'FormData a enviar:', {
      title: data.title,
      tags: data.tags,
      maxQuality: data.maxQuality,
      vipOnly: data.vipOnly,
      hasThumbnail: !!data.thumbnailFile
    })

    const response = await fetchWithAuth(`${API_BASE_URL}/api/content/upload/audio`, {
      method: 'POST',
      body: formData
    })

    log('info', 'Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      log('error', 'Error response:', errorText)
      
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`)
      } catch (parseError) {
        // Intencionalmente capturamos errores de parseo JSON para manejar respuestas no JSON
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`)
      }
    }

    const result: ContentResponse = await response.json()
    log('info', 'Audio subido exitosamente:', result.content.id)
    
    return result

  } catch (error) {
    log('error', 'Error al subir audio:', error)
    throw error
  }
}

/**
 * Sube un video (URL) al backend
 */
export async function uploadVideo(data: UploadVideoRequest): Promise<ContentResponse> {
  try {
    log('info', 'Subiendo video al backend:', data.title)
    log('info', '🔍 DEBUG - videoUrl recibido:', data.videoUrl)
    log('info', '🔍 DEBUG - videoUrl length:', data.videoUrl?.length || 0)
    log('info', '🔍 DEBUG - videoUrl vacío?', !data.videoUrl || data.videoUrl.trim() === '')

    const formData = new FormData()
    
    // URL del video (obligatorio)
    formData.append('videoUrl', data.videoUrl)
    log('info', '✅ FormData videoUrl agregado:', formData.get('videoUrl'))
    
    // Título (obligatorio)
    formData.append('title', data.title)
    
    // Descripción (opcional)
    if (data.description) {
      formData.append('description', data.description)
    }
    
    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        formData.append('tags', tag)
      }
    }
    
    // Calidad máxima (obligatorio)
    formData.append('maxQuality', data.maxQuality)
    
    // VIP only (obligatorio)
    formData.append('vipOnly', data.vipOnly.toString())
    
    // Estado (opcional)
    if (data.state) {
      formData.append('state', data.state)
    }
    
    // Edad mínima (opcional)
    if (data.minAge !== undefined && data.minAge !== null) {
      formData.append('minAge', data.minAge.toString())
    }
    
    if (data.thumbnailFile) {
      formData.append('thumbnailFile', data.thumbnailFile)
    }
    
    // Disponible hasta (opcional)
    if (data.availableUntil) {
      formData.append('availableUntil', data.availableUntil)
    }

    log('info', 'FormData a enviar:', {
      videoUrl: data.videoUrl,
      title: data.title,
      tags: data.tags,
      hasThumbnail: !!data.thumbnailFile
    })

    const response = await fetchWithAuth(`${API_BASE_URL}/api/content/upload/video`, {
      method: 'POST',
      body: formData
    })

    log('info', 'Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      log('error', 'Error response:', errorText)
      
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`)
      } catch (parseError) {
        // Si no es JSON válido, usar el texto de error directamente
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`)
      }
    }

    const result: ContentResponse = await response.json()
    log('info', 'Video subido exitosamente:', result.content.id)
    
    return result

  } catch (error) {
    log('error', 'Error al subir video:', error)
    throw error
  }
}