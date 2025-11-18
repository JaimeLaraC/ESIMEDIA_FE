import { log } from '../config/logConfig'
import { fetchWithAuth } from '../utils/fetchWithAuth'

const API_URL = import.meta.env.VITE_USERS_API_URL

export interface CreatorRequest {
  id: string
  userName: string
  email: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  firstName: string
  lastName: string
  channelAlias: string
  channelDescription: string
  contentType: 'video' | 'audio'
  specialty: string
  profileImage: string
}

// Interfaz para los datos de usuario del backend (UserSummary)
export interface UserListItem {
  id: string;
  email: string;
  alias?: string;
  nombre: string;
  apellido?: string;
  role: string;
  roleId: string; // ID del rol
  emailVerified?: boolean;
  status: string;
  fotoPerfilId?: string;
  fotoPerfilUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  has2FAEnabled?: boolean;
  has3FAEnabled?: boolean;
  lastPasswordChangeAt?: string;
  // Campos específicos según el tipo de usuario (heredan de DTOs específicos)
  fechaNacimiento?: string;
  esVIP?: boolean;
  departamento?: string;
  descripcion?: string;
  especialidad?: string;
  tipoContenido?: string;
  requestStatus?: string; // Estado de la solicitud si aplica
}

export interface AdminUsersResponse {
  success: boolean
  data?: UserListItem[]
  message?: string
}

export interface AdminUserResponse {
  success: boolean
  data?: UserListItem
  message?: string
}

// Interfaz para crear administrador
export interface CreateAdminData {
  email: string
  nombre: string
  apellido: string
  alias?: string
  departamento: string
}

export interface CreateAdminResponse {
  success: boolean
  message: string
}

// Obtener todas las peticiones pendientes
export async function fetchPendingRequests(): Promise<CreatorRequest[]> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/creators/requests`, {
      method: 'GET'
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    return await response.json()
  } catch (error) {
    log('error', 'Error al obtener peticiones de creadores:', error)
    throw error
  }
}

// Aprobar petición
export async function approveRequest(id: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/creators/${id}/approve`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
  } catch (error) {
    log('error', 'Error al aprobar petición:', error)
    throw error
  }
}

// Rechazar petición
export async function rejectRequest(id: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/creators/${id}/reject`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
  } catch (error) {
    log('error', 'Error al rechazar petición:', error)
    throw error
  }
}

// ============= GESTIÓN DE USUARIOS =============

/**
 * Obtiene la lista completa de usuarios del sistema
 */
export async function getAllUsers(): Promise<UserListItem[]> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/users`, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      log('error', 'Error al obtener usuarios:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data: UserListItem[] = await response.json()
    log('info', 'Usuarios obtenidos exitosamente:', { count: data.length })
    
    return data
  } catch (error) {
    log('error', 'Error de red al obtener usuarios:', error)
    throw error
  }
}

/**
 * Obtiene los detalles de un usuario específico por ID
 */
export async function getUserById(userId: string): Promise<UserListItem> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/users/${userId}`, {
      method: 'GET'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      log('error', 'Error al obtener usuario:', {
        userId,
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data: UserListItem = await response.json()
    log('info', 'Usuario obtenido exitosamente:', { userId, email: data.email })
    
    return data
  } catch (error) {
    log('error', 'Error de red al obtener usuario:', { userId, error })
    throw error
  }
}

/**
 * Crea un nuevo administrador en el sistema
 */
export async function createAdmin(adminData: CreateAdminData): Promise<CreateAdminResponse> {
  try {
    const payload = {
      email: adminData.email.trim(),
      nombre: adminData.nombre.trim(),
      apellido: adminData.apellido.trim(),
      alias: adminData.alias?.trim() || undefined,
      departamento: adminData.departamento.trim()
    }

    const response = await fetchWithAuth(`${API_URL}/auth/registerAdmin`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      log('error', 'Error al crear administrador:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      })
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    log('info', 'Administrador creado exitosamente:', { email: adminData.email })
    
    return {
      success: data.success ?? true,
      message: data.message ?? 'Administrador creado correctamente. Se ha enviado un email con el enlace para configurar la contraseña.'
    }
  } catch (error) {
    log('error', 'Error de red al crear administrador:', error)
    throw error
  }
}

/**
 * Bloquea o desbloquea un usuario
 */
export async function toggleUserBlock(userId: string, block: boolean): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/users/${userId}/block`, {
      method: 'PUT',
      body: JSON.stringify({ blocked: block })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      log('error', `Error al ${block ? 'bloquear' : 'desbloquear'} usuario:`, {
        userId,
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    log('info', `Usuario ${block ? 'bloqueado' : 'desbloqueado'} exitosamente:`, { userId })
  } catch (error) {
    log('error', `Error de red al ${block ? 'bloquear' : 'desbloquear'} usuario:`, { userId, error })
    throw error
  }
}

/**
 * Elimina un usuario del sistema
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      log('error', 'Error al eliminar usuario:', {
        userId,
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    log('info', 'Usuario eliminado exitosamente:', { userId })
  } catch (error) {
    log('error', 'Error de red al eliminar usuario:', { userId, error })
    throw error
  }
}

/**
 * Actualiza la información de un usuario (solo nombre, apellido y alias según restricciones de rol)
 */
export async function updateUser(userId: string, updateData: { nombre: string; apellido: string; alias?: string; especialidad?: string; descripcion?: string }): Promise<UserListItem> {
  try {
    const payload = {
      nombre: updateData.nombre.trim(),
      apellido: updateData.apellido.trim(),
      alias: updateData.alias?.trim() || undefined,
      especialidad: updateData.especialidad?.trim() || undefined,
      descripcion: updateData.descripcion?.trim() || undefined
    }

    // Remover campos undefined para evitar enviar valores vacíos
    if (!payload.alias) {
      delete payload.alias
    }
    if (!payload.especialidad) {
      delete payload.especialidad
    }
    if (!payload.descripcion) {
      delete payload.descripcion
    }

    const response = await fetchWithAuth(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      log('error', 'Error al actualizar usuario:', {
        userId,
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data: UserListItem = await response.json()
    log('info', 'Usuario actualizado exitosamente:', { userId, email: data.email })
    
    return data
  } catch (error) {
    log('error', 'Error de red al actualizar usuario:', { userId, error })
    throw error
  }
}
