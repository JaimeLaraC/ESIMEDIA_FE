/**
 * Configuración de logging para diferentes entornos
 */

export interface LogConfig {
  enabled: boolean
  levels: {
    debug: boolean
    info: boolean
    warn: boolean
    error: boolean
  }
  // Características adicionales de seguridad
  sensitiveDataMask: boolean
  maxBufferSize: number
}

// Configuración para desarrollo
const developmentConfig: LogConfig = {
  enabled: true,
  levels: {
    debug: true,
    info: true,
    warn: true,
    error: true
  },
  sensitiveDataMask: false,
  maxBufferSize: 100
}

// Configuración para producción (logs activados por defecto)
const productionConfig: LogConfig = {
  enabled: true,
  levels: {
    debug: true,
    info: true,
    warn: true,
    error: true
  },
  sensitiveDataMask: true,
  maxBufferSize: 10
}

// Configuración para testing
const testConfig: LogConfig = {
  enabled: false,
  levels: {
    debug: false,
    info: false,
    warn: true,
    error: true
  },
  sensitiveDataMask: true,
  maxBufferSize: 10
}

// Función para obtener configuración según el entorno
export function getLogConfig(): LogConfig {
  // Leer la variable de entorno para el nivel de log
  const logLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase()

  // Definir niveles en orden jerárquico
  const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const
  const levelIndex = LOG_LEVELS.indexOf(logLevel as typeof LOG_LEVELS[number])

  let baseConfig: LogConfig

  if (levelIndex >= 0) {
    // Configuración basada en el nivel especificado
    baseConfig = {
      enabled: true,
      levels: {
        debug: levelIndex <= 0, // DEBUG y superiores
        info: levelIndex <= 1,  // INFO y superiores
        warn: levelIndex <= 2,  // WARN y superiores
        error: levelIndex <= 3  // ERROR y superiores
      },
      sensitiveDataMask: false, // En modo personalizado, no enmascarar por defecto
      maxBufferSize: 100
    }
  } else {
    // Fallback al entorno actual si no se especifica VITE_LOG_LEVEL válido
    const env = import.meta.env.MODE
    switch (env) {
      case 'development':
        baseConfig = developmentConfig
        break
      case 'test':
        baseConfig = testConfig
        break
      case 'production':
      default:
        baseConfig = productionConfig
        break
    }
  }

  return baseConfig
}

// Función de logging que usa la configuración de LogConfig
export function log(level: keyof LogConfig['levels'], message: string, ...args: unknown[]): void {
  const config = getLogConfig()

  if (!config.enabled || !config.levels[level]) {
    return
  }

  const prefix = `[${level.toUpperCase()}]`
  const formattedMessage = `${prefix} ${message}`

  switch (level) {
    case 'debug':
    case 'info':
      console.log(formattedMessage, ...args)
      break
    case 'warn':
      console.warn(formattedMessage, ...args)
      break
    case 'error':
      console.error(formattedMessage, ...args)
      break
  }
}

// Palabras clave sensibles que deben ser enmascaradas
export const SENSITIVE_KEYWORDS = [
  'password',
  'token',
  'auth',
  'secret',
  'key',
  'credential',
  'session'
]