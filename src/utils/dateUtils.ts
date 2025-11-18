/**
 * dateUtils.ts
 * Utilidades para formateo y cálculo de fechas
 * Excluido del scanner de SonarQube
 */

/**
 * Formatea una fecha a formato corto (DD/MM/YYYY)
 * @param dateString - Cadena de fecha ISO
 * @param fallback - Valor por defecto si la fecha es inválida
 * @returns Fecha formateada
 */
export const formatDate = (
  dateString: string | null | undefined,
  fallback: string = 'N/A'
): string => {
  if (!dateString) return fallback

  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return fallback
    return date.toLocaleDateString()
  } catch {
    return fallback
  }
}

/**
 * Formatea una fecha con hora completa
 * @param dateString - Cadena de fecha ISO
 * @returns Fecha y hora formateadas
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
}

/**
 * Calcula el tiempo relativo desde una fecha hasta ahora
 * @param dateString - Cadena de fecha ISO
 * @param t - Función de traducción
 * @param translationPrefix - Prefijo opcional para las claves de traducción
 * @returns Tiempo relativo formateado (ej: "hace 2 días")
 */
export const getTimeAgo = (
  dateString: string,
  t: (key: string) => string,
  translationPrefix: string = ''
): string => {
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'N/A'

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const prefix = translationPrefix ? `${translationPrefix}.timeAgo` : 'timeAgo'

    if (diffDays === 0) return t(`${prefix}.today`)
    if (diffDays === 1) return t(`${prefix}.yesterday`)
    if (diffDays < 7) {
      return t(`${prefix}.daysAgo`).replace('{count}', diffDays.toString())
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return t(`${prefix}.weeksAgo`).replace('{count}', weeks.toString())
    }

    const months = Math.floor(diffDays / 30)
    return t(`${prefix}.monthsAgo`).replace('{count}', months.toString())
  } catch {
    return 'N/A'
  }
}
