/**
 * contentFormUtils.ts
 * Utilidades para formularios de contenido
 * Excluido del scanner de SonarQube
 */

import type { ComboboxOption } from '../customcomponents/Combobox'
import type { ContentFormData } from './fieldValidator'

/**
 * Crea un objeto de datos de formulario vacío con opcionalmente datos iniciales
 * @param initialData - Datos iniciales opcionales
 * @returns Objeto ContentFormData completamente inicializado
 */
export const createEmptyFormData = (initialData?: Partial<ContentFormData>): ContentFormData => {
  return {
    title: '',
    description: '',
    maxQuality: '',
    minimumAge: undefined,
    thumbnailImage: undefined,
    isPremium: false,
    isVisible: true,
    availableUntil: '',
    tags: '',
    ...initialData
  }
}

/**
 * Crea un objeto de errores de validación vacío
 * @returns Objeto vacío para errores
 */
export const createEmptyErrors = (): Partial<Record<keyof ContentFormData, string>> => {
  return {}
}

/**
 * Verifica si hay errores de validación
 * @param errors - Objeto con errores de validación
 * @returns true si hay al menos un error
 */
export const hasValidationErrors = (
  errors: Partial<Record<keyof ContentFormData, string>>
): boolean => {
  return Object.keys(errors).length > 0
}

/**
 * Parsea un valor de input numérico a número o undefined
 * @param value - Valor del input
 * @returns Número parseado o undefined si está vacío
 */
export const parseNumberInput = (value: string): number | undefined => {
  if (value === '') return undefined
  return Number.parseInt(value, 10)
}

/**
 * Obtiene el primer archivo de una lista de archivos
 * @param files - FileList del input
 * @returns Primer archivo o undefined
 */
export const getFirstFile = (files: FileList | null): File | undefined => {
  if (!files) return undefined
  return files[0] || undefined
}

/**
 * Obtiene la etiqueta para la fuente de contenido basada en el tipo
 * @param contentType - Tipo de contenido (audio o video)
 * @returns Etiqueta de la fuente de contenido
 */
export const getContentSourceLabel = (contentType: 'audio' | 'video'): string => {
  if (contentType === 'video') return 'URL del Video: '
  return 'Archivo de Audio: '
}

/**
 * Determina si el campo "Disponible Hasta" debe estar deshabilitado
 * @param isVisible - Si el contenido es visible
 * @returns true si debe estar deshabilitado
 */
export const shouldDisableAvailableUntil = (isVisible: boolean): boolean => {
  return !isVisible
}

/**
 * Obtiene el texto del botón de envío basado en el estado de carga
 * @param isLoading - Si está cargando
 * @param loadingText - Texto a mostrar mientras carga
 * @param publishText - Texto a mostrar cuando no está cargando
 * @returns Texto apropiado para el botón
 */
export const getSubmitButtonText = (
  isLoading: boolean,
  loadingText: string,
  publishText: string
): string => {
  if (isLoading) return loadingText
  return publishText
}

/**
 * Obtiene las opciones de calidad disponibles para videos
 * @returns Array de opciones para el combobox de calidad
 */
export const getQualityOptions = (): ComboboxOption[] => {
  return [
    { value: '144p', label: '144p' },
    { value: '360p', label: '360p' },
    { value: '480p', label: '480p' },
    { value: '720p', label: '720p' },
    { value: '1080p', label: '1080p' },
    { value: '4k', label: '4K' }
  ]
}
