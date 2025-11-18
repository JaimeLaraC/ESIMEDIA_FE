export type UserRole = 'standard' | 'premium' | 'creator' | 'admin'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  alias?: string
  birthDate: string
  profileImage: string
  joinDate: string
  role: UserRole
  isPremium: boolean
  isCreator: boolean
}

export interface ProfilePageProps {
  readonly profileData: UserProfile
  readonly isOwnProfile: boolean
  readonly onSaveProfile?: (data: { alias?: string; firstName: string; lastName: string; specialty?: string; description?: string }) => void
  readonly onReloadProfile?: () => Promise<void>
}

// Función helper para determinar qué secciones mostrar basado en el rol
export const getRolePermissions = (role: UserRole) => ({
  canSeeSubscription: role === 'standard' || role === 'premium',
  // Solo usuarios básicos y premium pueden eliminar su cuenta
  // Creadores y admins NO pueden eliminar su cuenta (tienen contenido/responsabilidades)
  canSeeCancellation: role === 'standard' || role === 'premium',
  isPremium: role === 'premium'
})

// Función simplificada para obtener la clase del badge
export const getBadgeClass = (role: UserRole): string => {
  const badgeClasses: Record<UserRole, string> = {
    premium: 'badge-premium',
    creator: 'badge-creator',
    admin: 'badge-admin',
    standard: 'badge-user'
  }
  return badgeClasses[role] || 'badge-user'
}

// Función para formatear fechas
export const formatDate = (dateString: string) => {
  // Si no hay fecha o es una cadena vacía, retornar placeholder
  if (!dateString || dateString.trim() === '') {
    return 'No especificada'
  }
  
  const date = new Date(dateString)
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'
  }
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}