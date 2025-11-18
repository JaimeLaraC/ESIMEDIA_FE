const API_URL = (import.meta.env.VITE_USERS_API_URL) + '/auth'

/**
 * Solicita el restablecimiento de contraseña.
 * Envía el correo al backend (respuesta genérica, no revela si el correo existe).
 * Nota: Este endpoint no requiere autenticación.
 */
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_URL}/password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return {
      success: data.success ?? response.ok,
      message:
        data.message ??
        "Si el correo está registrado, se enviará un enlace para restablecer la contraseña.",
    };
  } catch (error) {
    console.error("Error al solicitar restablecimiento:", error);
    return { success: false, message: "Error al enviar la solicitud." };
  }
}

/**
 * Valida si el token recibido por correo es válido o ha expirado.
 * Se usa cuando el usuario abre el enlace de restablecimiento.
 */
export async function validateResetToken(token: string) {
  try {
    const response = await fetch(
      `${API_URL}/password-reset/validate?token=${token}`,
      { method: "GET" }
    );

    const data = await response.json();
    return {
      success: data.success ?? response.ok,
      message: data.message ?? "Token válido.",
    };
  } catch (error) {
    console.error("Error al validar token:", error);
    return { success: false, message: "Error al validar el token." };
  }
}

/**
 * Envía la nueva contraseña al backend junto con el token.
 * Si el token es válido, el backend actualizará la contraseña con BCrypt.
 */
export async function confirmPasswordReset(token: string, newPassword: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_USERS_API_URL}/auth/password-reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    return {
      success: data.success ?? response.ok,
      message: data.message ?? "Contraseña restablecida correctamente.",
    };
  } catch (error) {
    console.error("Error al confirmar restablecimiento:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
}

