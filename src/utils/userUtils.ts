import type { UserSummaryDTO, UserSummaryEndUserDTO } from '../services/loginService'
import type { User } from '../context/AppContextTypes'
import { backendRoleToUserType, type BackendRole } from './roleMapper'

/**
 * Mapea UserSummaryDTO del backend a User del frontend
 * 
 * Utiliza roleMapper centralizado para mantener una única fuente de verdad
 * en la conversión de roles backend → frontend
 */
export function mapUserSummaryToUser(dto: UserSummaryDTO): User {
  // Extraer esVIP si el DTO es de tipo EndUser
  const esVIP = (dto as UserSummaryEndUserDTO).esVIP || false
  
  // Usar el roleMapper centralizado con el valor correcto de esVIP
  const type = backendRoleToUserType(dto.role as BackendRole, esVIP)

  return {
    id: dto.id,
    username: dto.alias || dto.nombre,
    email: dto.email,
    type,
    avatar: dto.fotoPerfilUrl
  }
}