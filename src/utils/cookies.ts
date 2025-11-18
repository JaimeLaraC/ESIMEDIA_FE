/**
 * Utilidades para manejo de cookies
 */

/**
 * Establece una cookie con el nombre, valor y duración especificados
 * @param name Nombre de la cookie
 * @param value Valor de la cookie
 * @param days Duración en días (por defecto 365)
 */
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  // Configuración segura para CORS entre Firebase y Render
  const isSecure = globalThis.location?.protocol === 'https:'
  const sameSite = 'SameSite=None' // Necesario para cross-site
  const secure = isSecure ? ';Secure=true' : '' // Obligatorio con SameSite=None
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${secure};${sameSite}`
}

/**
 * Obtiene el valor de una cookie por su nombre
 * @param name Nombre de la cookie
 * @returns Valor de la cookie o null si no existe
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  for (const cookie of document.cookie.split(';')) {
    const c = cookie.trim()
    if (c.startsWith(nameEQ)) {
      return c.substring(nameEQ.length)
    }
  }
  return null
}

/**
 * Elimina una cookie estableciendo su expiración en el pasado
 * @param name Nombre de la cookie a eliminar
 */
export const deleteCookie = (name: string): void => {
  const isSecure = globalThis.location?.protocol === 'https:'
  const sameSite = 'SameSite=None'
  const secure = isSecure ? ';Secure=true' : ''
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${secure};${sameSite}`
}