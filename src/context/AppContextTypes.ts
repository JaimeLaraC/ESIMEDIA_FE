export type Page = 'home' | 'auth' | 'plans'
export type UserType = 'guest' | 'user' | 'user-premium' | 'content-creator' | 'administrator'

export interface User {
  id: string
  username: string
  email: string
  type: UserType
  avatar?: string
}

export interface SubscriptionInfo {
  planName: string
  isVip: boolean
  isPremium: boolean
  isLoading: boolean
  error: string | null
  changePlan: (newPlan: 'STANDARD' | 'PREMIUM') => Promise<void>
  loadSubscription: () => Promise<void>
  clearError: () => void
}

export interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  isLoading: boolean // Indica si se está verificando la sesión inicial
  // DevTools: Override temporal del header
  headerOverride: UserType | null
  setHeaderOverride: (type: UserType | null) => void
  // Información de suscripción
  subscription: SubscriptionInfo
}