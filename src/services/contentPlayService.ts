// services/contentPlayService.ts

import { fetchWithAuth } from '../utils/fetchWithAuth'

export interface ContentDetail {
  id: string
  title: string
  description: string
  contentUrl: string
  contentType: 'AUDIO' | 'VIDEO'
  thumbnailUrl: string
  maxQuality: string
  durationMinutes: number
  creatorId: string
  creatorName: string
  creatorAvatar: string
  publishedAt: string
  viewCount: number
  averageRating: number
  totalRatings: number
  vipOnly: boolean
  tags: string[]
  state: 'VISIBLE' | 'OCULTO'
}
const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

// Obtener contenido por ID
export const getContentById = async (contentId: string): Promise<ContentDetail> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/content/${contentId}`, {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error('Error al obtener el contenido')
  }

  return response.json()
}

// Registrar visualización
export const registerView = async (contentId: string): Promise<void> => {
  await fetchWithAuth(`${API_BASE_URL}/api/content/${contentId}/view`, {
    method: 'POST'
  })
}

// Enviar valoración
export const submitRating = async (contentId: string, rating: number): Promise<void> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/content/${contentId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating })
  })

  if (!response.ok) {
    throw new Error('Error al enviar la valoración')
  }
}

// Obtener valoración del usuario
export const getUserRating = async (contentId: string): Promise<number | null> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/content/${contentId}/my-rating`, {
    method: 'GET'
  })

  if (response.status === 404) {
    return null // Usuario no ha valorado
  }

  if (!response.ok) {
    throw new Error('Error al obtener la valoración')
  }

  const data = await response.json()
  return data.rating
}

// Construir URL completa para contenido
export const getContentPlayUrl = (contentUrl: string): string => {
  // Si ya es una URL completa (YouTube, Vimeo, etc), devolverla tal cual
  if (contentUrl.startsWith('http://') || contentUrl.startsWith('https://')) {
    return contentUrl
  }

  // Si es una ruta relativa del servidor, construir URL completa
  // El backend devuelve /content/audio/... o /content/video/...
  // Necesitamos transformar a /api/content/audio/... para el API Gateway
  if (contentUrl.startsWith('/content/')) {
    return `${API_BASE_URL}/api${contentUrl}`
  }

  // Fallback para rutas que no empiezan con /content/
  return `${API_BASE_URL}${contentUrl}`
}