/**
 * userTypeUtils.ts
 * Utilidades para tipos de usuario y mapeos de estilos
 * Excluido del scanner de SonarQube
 */

export type UserType = 'estandar' | 'premium' | 'creador' | 'administrador' | 'gestor'
export type RequestStatus = 'pending' | 'approved' | 'rejected'

/**
 * Obtiene la clase CSS para el color del tipo de usuario
 * @param userType - Tipo de usuario
 * @returns Clase CSS del color correspondiente
 */
export const getUserTypeColor = (userType: string): string => {
  const colorMap: Record<string, string> = {
    'estandar': 'user-type-standard',
    'premium': 'user-type-premium',
    'creador': 'user-type-creator',
    'administrador': 'user-type-admin',
    'gestor': 'user-type-gestor'
  }
  return colorMap[userType] || 'user-type-standard'
}

/**
 * Obtiene la clase CSS para el estado de solicitud
 * @param status - Estado de la solicitud
 * @returns Clase CSS del estado correspondiente
 */
export const getRequestStatusColor = (status?: RequestStatus | string): string => {
  if (!status) return ''

  const statusMap: Record<string, string> = {
    'approved': 'status-approved',
    'rejected': 'status-rejected',
    'pending': 'status-pending'
  }
  return statusMap[status] || 'status-pending'
}

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena capitalizada o undefined si la entrada es undefined
 */
export const capitalizeFirst = (str?: string): string | undefined => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
