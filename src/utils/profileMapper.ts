import type { UserSummaryDTO, UserSummaryEndUserDTO, UserSummaryManagerDTO, UserSummaryAdminDTO } from '../services/loginService'
import type { UserProfile, UserRole } from './profileUtils'
import { userTypeToProfileRole } from './roleMapper'
import type { User } from '../context/AppContextTypes'
import { log } from '../config/logConfig'
import defaultAvatar from '../assets/profile_images/default.svg'

function isAdminDTO(dto: UserSummaryDTO): dto is UserSummaryAdminDTO {
  return dto.role === 'ADMIN' || dto.role === 'ADMINISTRADOR' || 'departamento' in dto
}

function isManagerDTO(dto: UserSummaryDTO): dto is UserSummaryManagerDTO {
  return dto.role === 'CREATOR' || dto.role === 'CREADOR_DE_CONTENIDO' || 
         ('descripcion' in dto || 'especialidad' in dto)
}

function isEndUserDTO(dto: UserSummaryDTO): dto is UserSummaryEndUserDTO {
  return dto.role === 'USER' || dto.role === 'USUARIO' || 
         ('fechaNacimiento' in dto || 'esVIP' in dto)
}

interface RoleConfig {
  role: UserRole
  isPremium: boolean
  isCreator: boolean
  logMessage: string
}

function determineRoleConfig(dto: UserSummaryDTO): RoleConfig {
  // Verificar Admin PRIMERO (rol más específico)
  if (isAdminDTO(dto)) {
    return {
      role: 'admin',
      isPremium: true,
      isCreator: false,
      logMessage: 'Admin detected'
    }
  }

  // Verificar Manager/Creator SEGUNDO
  if (isManagerDTO(dto)) {
    return {
      role: 'creator',
      isPremium: true,
      isCreator: true,
      logMessage: 'Manager/Creator detected'
    }
  }

  // Verificar EndUser ÚLTIMO (rol más genérico)
  if (isEndUserDTO(dto)) {
    return {
      role: dto.esVIP ? 'premium' : 'standard',
      isPremium: dto.esVIP || false,
      isCreator: false,
      logMessage: `EndUser detected: esVIP=${dto.esVIP}`
    }
  }

  log('warn', 'Unknown role type, defaulting to standard')
  return {
    role: 'standard',
    isPremium: false,
    isCreator: false,
    logMessage: 'Unknown role type, defaulting to standard'
  }
}

export function mapDTOToUserProfile(dto: UserSummaryDTO, overrideIsPremium?: boolean): UserProfile {
  log('info', 'Mapping DTO to UserProfile:', { role: dto.role, id: dto.id })
  
  const { role, isPremium: dtoIsPremium, isCreator, logMessage } = determineRoleConfig(dto)
  log('debug', logMessage)

  if (isEndUserDTO(dto)) {
    log('debug', 'EndUser birthDate from DTO:', {
      fechaNacimiento: dto.fechaNacimiento,
      type: typeof dto.fechaNacimiento
    })
  }

  const profile: UserProfile = {
    id: dto.id,
    email: dto.email,
    firstName: dto.nombre || '',
    lastName: dto.apellido || '',
    alias: dto.alias,
    birthDate: isEndUserDTO(dto) ? (dto.fechaNacimiento || '') : '',
    profileImage: dto.fotoPerfilUrl || defaultAvatar,
    joinDate: dto.createdAt || new Date().toISOString(),
    role,
    isPremium: overrideIsPremium ?? dtoIsPremium,
    isCreator
  }
  
  log('info', 'Profile mapped successfully:', {
    id: profile.id,
    role: profile.role,
    birthDate: profile.birthDate,
    joinDate: profile.joinDate
  })
  
  return profile
}

export function mapUserToUserProfile(user: User, isPremium: boolean = false): UserProfile {
  const role = userTypeToProfileRole(user.type)
  const [firstName = user.username, ...lastNameParts] = user.username.split(' ')

  return {
    id: user.id,
    email: user.email,
    firstName,
    lastName: lastNameParts.join(' '),
    alias: user.username,
    birthDate: '',
    profileImage: user.avatar || defaultAvatar,
    joinDate: '',
    role,
    isPremium,
    isCreator: user.type === 'content-creator'
  }
}