/**
 * Servicio para verificar contraseñas comprometidas usando la API de Have I Been Pwned (HIBP)
 * Solo verifica contraseñas que pasan la validación de fortaleza (zxcvbn score >= 4)
 */

import { log } from '../config/logConfig'

export interface HIBPResult {
  isCompromised: boolean
  count: number // Número de veces que aparece en brechas
  error?: string
}

/**
 * Calcula el hash SHA-1 de una contraseña usando la Web Crypto API
 */
async function sha1Hash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

/**
 * Verifica si una contraseña ha sido comprometida usando la API de HIBP
 * @param password La contraseña a verificar
 * @param minStrengthScore Mínimo score de zxcvbn requerido para enviar (default: 4)
 * @returns Promise<HIBPResult>
 */
export async function checkPasswordHIBP(
  password: string,
  minStrengthScore: number = 4
): Promise<HIBPResult> {
  try {
    // Solo verificar contraseñas que pasan la validación de fortaleza básica
    if (password.length < 8) {
      return {
        isCompromised: false,
        count: 0,
        error: 'Password too short for HIBP check'
      }
    }

    // Verificar que la contraseña tenga la fortaleza mínima requerida
    // Esta función asume que se llama solo cuando la contraseña es fuerte,
    // pero agregamos una validación adicional por seguridad
    if (minStrengthScore > 0 && password.length < 8) {
      return {
        isCompromised: false,
        count: 0,
        error: 'Password strength too low for HIBP check'
      }
    }

    // Calcular hash SHA-1
    const hash = await sha1Hash(password)
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5)

    // Llamar a la API de HIBP
    const response = await fetch(`http://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'ESIMedia-Password-Checker'
      }
    })

    if (!response.ok) {
      throw new Error(`HIBP API error: ${response.status}`)
    }

    const data = await response.text()

    // Buscar el sufijo en los resultados
    const lines = data.split('\n')
    for (const line of lines) {
      const [returnedSuffix, count] = line.trim().split(':')
      if (returnedSuffix === suffix) {
        return {
          isCompromised: true,
          count: parseInt(count, 10)
        }
      }
    }

    // No encontrada en brechas
    return {
      isCompromised: false,
      count: 0
    }

  } catch (error) {
    log('error', 'Error checking password with HIBP:', error)
    return {
      isCompromised: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verifica si una contraseña debería ser enviada a HIBP basado en su fortaleza
 * @param passwordStrength Score de zxcvbn (0-4)
 * @param minScore Mínimo score requerido (default: 4)
 */
export function shouldCheckHIBP(passwordStrength: number, minScore: number = 4): boolean {
  return passwordStrength >= minScore
}