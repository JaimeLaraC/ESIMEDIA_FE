/**
 * Extrae el JWT token de la cookie session_token
 */
function getJwtFromCookie(): string | null {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'session_token') {
      return value
    }
  }
  return null
}

/**
 * Wrapper de fetch que maneja autenticación
 * - Users API: usa cookies HttpOnly
 * - Content API: extrae JWT de cookie y lo envía en Authorization header para cross-domain
 */

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * Realiza una solicitud HTTP con autenticación
 * - Extrae JWT de cookie "session_token" y lo envía en header Authorization
 * - También incluye cookies para compatibilidad con mismo dominio
 * @param url URL a la que hacer la solicitud
 * @param options Opciones de RequestInit (method, body, headers, etc.)
 * @returns Promise con la respuesta
 */
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  let headers: Record<string, string> = { ...options.headers }

  // Extraer JWT de la cookie y agregarlo al header Authorization para cross-domain
  const jwtToken = getJwtFromCookie()
  if (jwtToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${jwtToken}`
  }

  // Solo agregar Content-Type si hay body (POST, PUT, PATCH)
  if (options.body && !headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  let fetchOptions: RequestInit = {
    ...options,
    headers
  }

  // Por compatibilidad con cookies HttpOnly entre dominios (Firebase <-> Render)
  // usamos `credentials: 'include'` por defecto a menos que el llamador lo sobrescriba.
  fetchOptions.credentials ??= 'include'

  const response = await fetch(url, fetchOptions)

  // NOTA: No limpiamos el token automáticamente en 401.
  // Razones:
  // 1. Un 401 podría ser por otros motivos (token inválido, backend rechaza formato, etc.)
  // 2. Cada servicio debe decidir si limpia el token o no
  // 3. El AppContext es responsable de validar y limpiar tokens

  return response
}

/**
 * Versión simplificada para GET requests
 */
export async function fetchGetWithAuth(url: string): Promise<Response> {
  return fetchWithAuth(url, { method: 'GET' })
}

/**
 * Versión simplificada para POST requests
 */
export async function fetchPostWithAuth(
  url: string,
  data: Record<string, any> = {}
): Promise<Response> {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Versión simplificada para PUT requests
 */
export async function fetchPutWithAuth(
  url: string,
  data: Record<string, any> = {}
): Promise<Response> {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Versión simplificada para DELETE requests
 */
export async function fetchDeleteWithAuth(url: string): Promise<Response> {
  return fetchWithAuth(url, { method: 'DELETE' })
}
