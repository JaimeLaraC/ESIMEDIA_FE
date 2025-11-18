/**
 * contentTypeUtils.ts
 * Utilidades para tipos de contenido
 * Excluido del scanner de SonarQube
 */

export type ContentType = 'VIDEO' | 'AUDIO' | 'CONTENT'

/**
 * Obtiene el icono para un tipo de contenido
 * @param contentType - Tipo de contenido (VIDEO, AUDIO, etc.)
 * @returns Nombre del icono Material Symbols
 */
export const getContentIcon = (contentType?: string): string => {
  switch (contentType) {
    case 'VIDEO':
      return 'movie'
    case 'AUDIO':
      return 'music_note'
    default:
      return 'movie'
  }
}

/**
 * Obtiene la etiqueta traducida para un tipo de contenido
 * @param contentType - Tipo de contenido (VIDEO, AUDIO, etc.)
 * @param t - Función de traducción
 * @returns Etiqueta traducida del tipo de contenido
 */
export const getContentTypeLabel = (
  contentType: string | undefined,
  t: (key: string) => string
): string => {
  switch (contentType) {
    case 'VIDEO':
      return t('playlist.contentTypes.video')
    case 'AUDIO':
      return t('playlist.contentTypes.audio')
    default:
      return t('playlist.contentTypes.content')
  }
}
