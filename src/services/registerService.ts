import { log } from '../config/logConfig'

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  alias?: string
  birthDate: string
  fotoPerfilUrl?: string  // URL de la imagen de perfil (ej: '/src/assets/profile_images/Avatar1.png')
  selectedPlan: 'standard' | 'premium' | ''
}

export async function registerUser(data: RegisterData) {
  try {
    // 🔧 Conversión segura de fecha al formato ISO
    const parseDate = (dateString: string) => {
      if (!dateString) return null;

      // Si viene en formato "dd/MM/yyyy", por ejemplo "06/01/2004"
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // 2004-01-06
      }

      // Si el navegador devuelve ISO ("2004-01-06"), lo devolvemos igual
      return dateString;
    };

    // Mapeo de los nombres esperados por el backend
    const payload = {
      nombre: data.firstName?.trim(),
      apellido: data.lastName,
      email: data.email?.trim(),
      password: data.password,
      alias: data.alias?.trim() || '', // Enviar cadena vacía si no hay alias
      fechaNacimiento: parseDate(data.birthDate),
      esVIP: data.selectedPlan === "premium",
      fotoPerfilUrl: data.fotoPerfilUrl || defaultAvatar, // URL de la foto
    };

    const response = await fetch(`${import.meta.env.VITE_USERS_API_URL}/auth/registerUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error en el servidor");
    }

    return {
      success: result.success ?? response.ok,
      message: result.message ?? "Registro exitoso",
    };
  } catch (error) {
    log('error', '❌ Error al registrar usuario:', error)
    throw error
  }
}

/**
 * Confirma la cuenta del usuario a partir del token recibido por correo.
 */
export async function confirmAccount(token: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_USERS_API_URL}/auth/confirm?token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return {
      success: data.success ?? response.ok,
      message: data.message ?? "Cuenta verificada correctamente.",
    };
  } catch (error) {
    log('error', "Error al confirmar cuenta:", error);
    return { success: false, message: "Error de conexión al confirmar cuenta" };
  }
}

export async function checkEmailAvailability(email: string): Promise<{ success: boolean; exists?: boolean; message?: string }> {
  try {
    const url = `${import.meta.env.VITE_USERS_API_URL}/auth/check-email?email=${encodeURIComponent(email.trim())}`;
    const res = await fetch(url, { method: 'GET' });
    const data = await res.json();
    // Esperado: { success: true, exists: boolean, message: string }
    return typeof data?.exists === 'boolean'
      ? data
      : { success: false, message: 'Respuesta inesperada del servidor' };
  } catch {
    return { success: false, message: 'No se pudo comprobar el correo en el servidor' };
  }
}
