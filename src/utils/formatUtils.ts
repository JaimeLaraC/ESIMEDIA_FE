/**
 * formatUtils.ts
 * Utilidades para formateo de datos para visualización
 * Excluido del scanner de SonarQube
 */

import type { ComboboxOption } from '../customcomponents/Combobox'

/**
 * Formatea un número de visualizaciones a formato legible
 * @param views - Número de visualizaciones
 * @returns Visualizaciones formateadas (ej: "1.5M", "234K", "500")
 */
export const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

/**
 * Formatea una fecha en formato legible largo
 * @param dateString - Cadena de fecha ISO
 * @returns Fecha formateada
 */
export const formatDateLong = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

/**
 * Genera opciones de calidad disponibles para un video
 * @param maxQuality - Calidad máxima disponible (ej: "1080p", "4k")
 * @returns Array de opciones para el selector de calidad
 */
export const getQualityOptions = (maxQuality: string): ComboboxOption[] => {
  const qualities = ['144p', '360p', '480p', '720p', '1080p', '4k']

  const normalizedMaxQuality = maxQuality.toLowerCase()
  const maxIndex = qualities.indexOf(normalizedMaxQuality)

  if (maxIndex === -1) {
    console.warn('⚠️ Calidad no reconocida:', maxQuality)
    return [{ value: '144p', label: '144P', disabled: false }]
  }

  const availableQualities = qualities.slice(0, maxIndex + 1)

  return availableQualities.map(q => ({
    value: q,
    label: q === '4k' ? '4K' : q.toUpperCase(),
    disabled: false
  }))
}
