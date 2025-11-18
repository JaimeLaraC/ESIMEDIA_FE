// src/utils/creatorUtils.ts
export const formatNumber = (num: number): string => num.toLocaleString()

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}