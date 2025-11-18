import type { UserType } from '../context/AppContextTypes'
import { log } from '../config/logConfig'

/**
 * roleMapper.ts - Mapeo centralizado de roles
 * 
 * Este archivo proporciona una única fuente de verdad para la conversión
 * entre los roles del backend (Role enum) y los tipos de usuario del frontend (UserType).
 * 
 * IMPORTANTE: Mantener sincronizado con:
 * - Backend: com.urjc.backend.model.Role (ADMIN, CREADOR_DE_CONTENIDO, USUARIO)
 * - Frontend: UserType ('administrator' | 'content-creator' | 'user' | 'user-premium')
 */

/**
 * Roles tal como vienen del backend
 */
export type BackendRole = 'ADMIN' | 'CREADOR_DE_CONTENIDO' | 'USER'

/**
 * Rol para las páginas de perfil
 */
export type ProfileRole = 'standard' | 'premium' | 'creator' | 'admin'

/**
 * Convierte el rol del backend (Role enum) a UserType del frontend
 * 
 * @param role - Rol desde el backend (ADMIN, CREADOR_DE_CONTENIDO, USUARIO)
 * @param esVIP - Indica si el usuario es VIP (solo aplica para USUARIO)
 * @returns UserType correspondiente
 */
export function backendRoleToUserType(role: BackendRole, esVIP: boolean = false): UserType {
  log('debug', 'Converting backend role to UserType:', { role, esVIP })
  
  switch (role) {
    case 'ADMIN':
      return 'administrator'
    case 'CREADOR_DE_CONTENIDO':
      return 'content-creator'
    case 'USER':
      return esVIP ? 'user-premium' : 'user'
    default:
      log('warn', 'Unknown backend role, defaulting to user:', role)
      return 'user'
  }
}

/**
 * Convierte el UserType del frontend al rol de página de perfil
 * 
 * @param userType - Tipo de usuario del contexto
 * @returns Rol para enrutamiento de páginas de perfil
 */
export function userTypeToProfileRole(userType: UserType): ProfileRole {
  log('debug', 'Converting UserType to ProfileRole:', { userType })
  
  switch (userType) {
    case 'user':
      return 'standard'
    case 'user-premium':
      return 'premium'
    case 'content-creator':
      return 'creator'
    case 'administrator':
      return 'admin'
    default:
      log('warn', 'Unknown UserType, defaulting to standard:', userType)
      return 'standard'
  }
}

/**
 * Convierte el UserType del frontend al rol del backend
 * 
 * @param userType - Tipo de usuario del contexto
 * @returns Rol del backend (Role enum)
 */
export function userTypeToBackendRole(userType: UserType): BackendRole {
  log('debug', 'Converting UserType to backend role:', { userType })
  
  switch (userType) {
    case 'administrator':
      return 'ADMIN'
    case 'content-creator':
      return 'CREADOR_DE_CONTENIDO'
    case 'user':
    case 'user-premium':
      return 'USER'
    default:
      log('warn', 'Unknown UserType, defaulting to USER:', userType)
      return 'USER'
  }
}
