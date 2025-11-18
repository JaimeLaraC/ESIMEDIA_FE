/**
 * videoPlayerUtils.ts
 * Utilidades para detección y parseo de proveedores de video
 * Excluido del scanner de SonarQube
 */

export interface VideoProvider {
  type: 'youtube' | 'vimeo' | 'native'
  id?: string
  url: string
}

/**
 * Extrae el ID de un video de YouTube de su URL
 * @param url - URL del video de YouTube
 * @returns ID del video o null si no es una URL válida
 */
export const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(url)
    if (match) return match[1]
  }
  return null
}

/**
 * Extrae el ID de un video de Vimeo de su URL
 * @param url - URL del video de Vimeo
 * @returns ID del video o null si no es una URL válida
 */
export const getVimeoVideoId = (url: string): string | null => {
  const match = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url)
  return match ? match[1] : null
}

/**
 * Detecta el proveedor de video basándose en la URL
 * @param url - URL del video
 * @returns Objeto con el tipo de proveedor e ID (si aplica)
 */
export const detectVideoProvider = (url: string): VideoProvider => {
  const youtubeId = getYouTubeVideoId(url)
  if (youtubeId) {
    return { type: 'youtube', id: youtubeId, url }
  }

  const vimeoId = getVimeoVideoId(url)
  if (vimeoId) {
    return { type: 'vimeo', id: vimeoId, url }
  }

  return { type: 'native', url }
}

/**
 * Genera la URL de embed para un video de YouTube
 * @param videoId - ID del video
 * @returns URL de embed
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Genera la URL de embed para un video de Vimeo
 * @param videoId - ID del video
 * @returns URL de embed
 */
export const getVimeoEmbedUrl = (videoId: string): string => {
  return `https://player.vimeo.com/video/${videoId}`
}
