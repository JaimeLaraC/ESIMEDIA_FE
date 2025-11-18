import { log } from '../config/logConfig'

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_USERS_API_URL

/**
 * Interfaz para la respuesta de login (sin tokens, ya que se manejan via cookies HttpOnly)
 */
export interface LoginResponse {
  tokenType?: string;
  expiresIn?: number;
}

/**
 * Interfaz para la solicitud de login.
 */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/**
 * Interfaz base para el resumen de datos del usuario.
 * Corresponde a UserSummaryBaseDTO del backend.
 */
export interface UserSummaryBaseDTO {
  id: string;
  email: string;
  role: string;
  nombre: string;
  apellido: string;
  alias?: string;
  emailVerified: boolean;
  status: string;
  fotoPerfilId?: string;
  fotoPerfilUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO específico para usuarios finales (end_user).
 * Corresponde a UserSummaryEndUserDTO del backend.
 */
export interface UserSummaryEndUserDTO extends UserSummaryBaseDTO {
  fechaNacimiento?: string;
  esVIP?: boolean;
}

/**
 * DTO específico para creadores de contenido (manager).
 * Corresponde a UserSummaryManagerDTO del backend.
 */
export interface UserSummaryManagerDTO extends UserSummaryBaseDTO {
  descripcion?: string;
  especialidad?: string[];
  tipoContenido?: string;
}

/**
 * DTO específico para administradores (admin).
 * Corresponde a UserSummaryAdminDTO del backend.
 */
export interface UserSummaryAdminDTO extends UserSummaryBaseDTO {
  departamento?: string;
}

/**
 * Tipo unión para todos los DTOs de usuario.
 * El backend puede devolver cualquiera de estos según el rol.
 */
export type UserSummaryDTO = UserSummaryEndUserDTO | UserSummaryManagerDTO | UserSummaryAdminDTO

/**
 * Interfaz para errores de autenticación.
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Servicio para gestionar la autenticación de usuarios en el frontend.
 *
 * <p>Proporciona métodos para iniciar sesión, obtener datos del usuario actual,
 * cerrar sesión y verificar el estado de autenticación. Utiliza cookies HttpOnly
 * para mantener el estado de autenticación de forma segura.</p>
 *
 * <h3>Dependencias</h3>
 * <ul>
 *   <li>{@link log} - Para logging de operaciones.</li>
 *   <li>API_BASE_URL - URL base del backend (configurable via VITE_API_BASE_URL).</li>
 * </ul>
 *
 * <h3>Notas</h3>
 * <ul>
 *   <li>Los tokens JWT se manejan automáticamente via cookies HttpOnly.</li>
 *   <li>Los errores se manejan mediante la clase {@link AuthError} personalizada.</li>
 *   <li>Las cookies se incluyen automáticamente en solicitudes posteriores.</li>
 * </ul>
 *
 * @author Ángel García Lopezlira
 * @since 1.0
 */
export class LoginService {
  
  /**
   * Realiza el login del usuario
   * @param identifier Email o identificador del usuario
   * @param password Contraseña del usuario
   * @returns Promise<LoginResponse> - Devuelve información del login (sin tokens, ya que se manejan via cookies)
   * @throws AuthError si hay problemas de autenticación
   */
  static async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      log('info', 'Attempting login for user:', { identifier })

      const loginData: LoginRequest = {
        identifier,
        password
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include' // Usar cookies para Users API
      })

      if (response.ok) {
        // El backend guarda el token en cookie "session_token"
        log('info', 'Login successful for user:', { identifier })

        return {
          tokenType: 'Bearer',
          expiresIn: 3600
        }
      }

      // Manejo de errores específicos según el código de estado
      const errorMessage = await response.text()

      switch (response.status) {
        case 401:
          throw new AuthError('Credenciales incorrectas', 'INVALID_CREDENTIALS', 401)
        case 423:
          throw new AuthError('Cuenta bloqueada', 'ACCOUNT_BLOCKED', 423)
        case 428:
          throw new AuthError('Autenticación de dos factores requerida', 'MFA_REQUIRED', 428)
        default:
          throw new AuthError(errorMessage || 'Error interno del servidor', 'INTERNAL_ERROR', response.status)
      }

    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }

      log('error', 'Network error during login:', error)
      throw new AuthError('Error de conexión con el servidor', 'NETWORK_ERROR')
    }
  }

  /**
   * Obtiene los datos del usuario autenticado actual
   * @returns Promise<UserSummaryDTO> - Datos del usuario
   * @throws AuthError si no hay sesión válida
   * @deprecated Usar UserService.getCurrentUser() en su lugar
   */
  static async getCurrentUser(): Promise<UserSummaryDTO> {
    // Delegar a UserService para mantener compatibilidad
    const { UserService: UserSvc } = await import('./userService')
    try {
      return await UserSvc.getCurrentUser()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'SESSION_EXPIRED') {
          throw new AuthError('Sesión expirada o no válida', 'SESSION_EXPIRED', 401)
        }
        throw new AuthError('Error al obtener datos del usuario', 'USER_DATA_ERROR')
      }
      throw new AuthError('Error de conexión con el servidor', 'NETWORK_ERROR')
    }
  }

  /**
   * Cierra la sesión del usuario
   * @param setUser - Función opcional para limpiar el contexto de usuario
   * @returns Promise<void>
   */
  static async logout(setUser?: (user: null) => void): Promise<void> {
    try {
      log('info', 'Logging out user')

      // Llamar al endpoint de logout en el backend para invalidar la cookie JWT
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Usar cookies para Users API
        })

        if (!response.ok) {
          log('warn', `Logout endpoint returned ${response.status}, continuing with local cleanup`)
        } else {
          log('info', 'Backend logout successful, JWT cookie invalidated')
        }
      } catch (error) {
        log('warn', 'Error calling logout endpoint, continuing with local cleanup:', error)
      }

      // Limpiar contexto de usuario si se proporciona la función
      if (setUser) {
        setUser(null)
      }

      // Limpiar cualquier dato local residual
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')

      log('info', 'User logged out successfully')

    } catch (error) {
      log('error', 'Error during logout:', error)
      throw new Error('Error al cerrar sesión. Inténtalo de nuevo.')
    }
  }

  /**
   * Verifica si el usuario tiene una sesión válida
   * @returns Promise<boolean> - true si está autenticado, false en caso contrario
   * @deprecated Usar UserService.isAuthenticated() en su lugar
   */
  static async isAuthenticated(): Promise<boolean> {
    // Delegar a UserService para mantener compatibilidad
    const { UserService: UserSvc } = await import('./userService')
    return await UserSvc.isAuthenticated()
  }
}

// Clase de error personalizada para autenticación
/**
 * Error personalizado para operaciones de autenticación.
 *
 * <p>Extiende la clase Error nativa de JavaScript para proporcionar información
 * adicional sobre errores de autenticación, incluyendo códigos de error y
 * códigos de estado HTTP.</p>
 *
 * @example
 * ```typescript
 * throw new AuthError('Credenciales incorrectas', 'INVALID_CREDENTIALS', 401);
 * ```
 */
export class AuthError extends Error {
  public code?: string;
  public status?: number;
  
  constructor(message: string, code?: string, status?: number) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.status = status
  }
}

