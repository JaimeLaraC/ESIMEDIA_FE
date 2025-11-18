// utils/fieldValidator.ts

// ============ TIPOS Y CONSTANTES ============
interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
  customValidator?: (value: string) => string | undefined;
}

interface ValidationMessages {
  required: string;
  minLength: string;
  maxLength: string;
  pattern: string;
}

// Regex seguro sin backtracking catastrófico - usa caracteres específicos sin cuantificadores ambiguos
const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const VALID_CONTENT_TYPES = new Set(["audio", "video"]);
const MIN_AGE = 4;
const MAX_AGE = 120; // Edad máxima razonable

// ============ VALIDADOR GENÉRICO ============
function validateField(
  value: string | null | undefined,
  rules: ValidationRule,
  messages: Partial<ValidationMessages>
): string | undefined {
  const trimmedValue = value?.trim() || "";

  if (rules.required && !trimmedValue) {
    return messages.required;
  }

  if (!trimmedValue) return undefined;

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return messages.minLength;
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return messages.maxLength;
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return messages.pattern;
  }

  if (rules.customValidator) {
    return rules.customValidator(trimmedValue);
  }

  return undefined;
}

// ============ VALIDADORES EXPORTADOS ============
export function validateEmail(email: string): string | undefined {
  return validateField(email, { required: true, minLength: 6, maxLength: 100, pattern: EMAIL_PATTERN }, {
    required: "hints.email.required",
    minLength: "hints.email.minLength",
    maxLength: "hints.email.maxLength",
    pattern: "hints.email.pattern",
  });
}

export function validatePassword(password: string): string | undefined {
  return validateField(password, { required: true }, {
    required: "hints.password.required",
  });
}

export function validateRepeatPassword(repeatPassword: string, password: string): string | undefined {
  const baseValidation = validateField(repeatPassword, { required: true }, {
    required: "hints.repeatPassword.required",
  });

  if (baseValidation) return baseValidation;
  if (repeatPassword !== password) return "hints.repeatPassword.mismatch";
  return undefined;
}

// Patrón para nombres y apellidos:
// - Permite letras (incluye tildes, ñ, diéresis)
// - Permite espacios, apóstrofes y guiones (para nombres compuestos como "María José" o "O'Connor")
// - NO permite números ni caracteres especiales raros
// - NO permite múltiples espacios/guiones/apóstrofes consecutivos
const NAME_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+([' -][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

export function validateFirstName(nombre: string): string | undefined {
  const baseValidation = validateField(nombre, { required: true, minLength: 3, maxLength: 50 }, {
    required: "hints.firstName.required",
    minLength: "hints.firstName.minLength",
    maxLength: "hints.firstName.maxLength",
  });
  
  if (baseValidation) return baseValidation;
  
  if (!NAME_PATTERN.test(nombre.trim())) {
    return "hints.firstName.pattern";
  }
  
  return undefined;
}

export function validateLastName(apellido: string): string | undefined {
  const baseValidation = validateField(apellido, { required: true, minLength: 3, maxLength: 50 }, {
    required: "hints.lastName.required",
    minLength: "hints.lastName.minLength",
    maxLength: "hints.lastName.maxLength",
  });
  
  if (baseValidation) return baseValidation;
  
  if (!NAME_PATTERN.test(apellido.trim())) {
    return "hints.lastName.pattern";
  }
  
  return undefined;
}

// Patrón mejorado para alias:
// - Debe empezar con letra o número
// - Puede contener letras, números, guiones bajos y guiones medios
// - NO permite guiones/guiones bajos consecutivos
// - NO permite terminar en guion o guion bajo
const ALIAS_PATTERN = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;

export function validateAlias(alias: string): string | undefined {
  // Si el alias está vacío, es válido (campo opcional)
  const trimmedAlias = alias?.trim() || '';
  if (!trimmedAlias) return undefined;
  
  const baseValidation = validateField(trimmedAlias, { minLength: 3, maxLength: 12 }, {
    minLength: "hints.alias.minLength",
    maxLength: "hints.alias.maxLength",
  });
  
  if (baseValidation) return baseValidation;
  
  if (!ALIAS_PATTERN.test(trimmedAlias)) {
    return "hints.alias.pattern";
  }
  
  // Validar que no tenga guiones o guiones bajos consecutivos
  if (/[-_]{2,}/.test(trimmedAlias)) {
    return "hints.alias.noConsecutive";
  }
  
  return undefined;
}

export function validateBirthDate(birthDate: string): string | undefined {
  if (!birthDate) return "hints.birthDate.required";

  const birth = new Date(birthDate);
  const today = new Date();
  
  // Validar que la fecha no sea en el futuro
  if (birth > today) {
    return "hints.birthDate.future";
  }
  
  const age = calculateAge(birth, today);

  if (age < MIN_AGE) return "hints.birthDate.tooYoung";
  
  // Validar que la fecha no sea demasiado antigua (más de 120 años)
  if (age > MAX_AGE) return "hints.birthDate.tooOld";
  
  return undefined;
}

function calculateAge(birthDate: Date, currentDate: Date): number {
  const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    currentDate.getMonth() > birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
  
  return hasBirthdayPassed ? yearsDiff : yearsDiff - 1;
}

export function validateChannelDescription(desc: string): string | undefined {
  return validateField(desc, { 
    required: true, 
    minLength: 10, 
    maxLength: 500 
  }, {
    required: "hints.channelDescription.required",
    minLength: "hints.channelDescription.minLength",
    maxLength: "hints.channelDescription.maxLength",
  });
}

export function validateContentType(contentType: string): string | undefined {
  if (!contentType) return "hints.contentType.required";
  if (!VALID_CONTENT_TYPES.has(contentType.toLowerCase())) {
    return "hints.contentType.invalid";
  }
  return undefined;
}


export function validateSpecialty(specialty: string): string | undefined {
  return validateField(specialty, { required: true }, {
    required: "hints.specialty.required",
  });
}

export function validatePhoto(photo: string): string | undefined {
  if (!photo) return "hints.photo.required";
  return undefined;
}

// ============ VALIDACIONES PARA CAMBIO DE CONTRASEÑA ============

export function validateCurrentPassword(password: string): string | undefined {
  return validateField(password, { required: true }, {
    required: "hints.currentPassword.required",
  });
}

export function validateNewPassword(password: string): string | undefined {
  return validateField(password, { required: true }, {
    required: "hints.newPassword.required",
  });
}

export function validateConfirmPassword(confirmPassword: string, newPassword: string): string | undefined {
  const baseValidation = validateField(confirmPassword, { required: true }, {
    required: "hints.confirmPassword.required",
  });
  
  if (baseValidation) return baseValidation;
  
  if (confirmPassword !== newPassword) {
    return "hints.confirmPassword.mismatch";
  }
  
  return undefined;
}

// ============ VALIDACIONES PARA URL DE VIDEO ============

export function validateVideoUrl(url: string): string | undefined {
  if (!url?.trim()) return "hints.videoUrl.required";
  
  // Expresiones regulares optimizadas sin backtracking para URLs de YouTube y Vimeo
  const youtubeRegex = /^https?:\/\/(?:(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:[?&][a-zA-Z0-9_=&-]*)?$/;
  const vimeoRegex = /^https?:\/\/(?:(?:www\.)?vimeo\.com\/|player\.vimeo\.com\/video\/)\d+(?:[?&][a-zA-Z0-9_=&-]*)?$/;

  if (!youtubeRegex.test(url.trim()) && !vimeoRegex.test(url.trim())) {
    return "hints.videoUrl.invalid";
  }
  
  return undefined;
}

// ============ VALIDACIONES PARA FORMULARIO DE CONTENIDO ============

export function validateContentTitle(title: string): string | undefined {
  if (!title?.trim()) return "hints.contentTitle.required";
  if (title.trim().length < 3) return "hints.contentTitle.minLength";
  if (title.trim().length > 100) return "hints.contentTitle.maxLength";
  return undefined;
}

export function validateContentDescription(description: string): string | undefined {
  if (description && description.trim().length < 10) return "hints.contentDescription.minLength";
  if (description && description.trim().length > 1000) return "hints.contentDescription.maxLength";
  return undefined;
}

export function validateContentMaxQuality(maxQuality: string): string | undefined {
  if (!maxQuality?.trim()) return "hints.contentMaxQuality.required";
  
  const validQualities = ['144p', '360p', '480p', '720p', '1080p', '4k'];
  if (!validQualities.includes(maxQuality)) {
    return "hints.contentMaxQuality.invalid";
  }
  
  return undefined;
}

export function validateContentMinimumAge(minimumAge: number | undefined): string | undefined {
  if (minimumAge === undefined || minimumAge === null) return undefined; // Campo opcional
  if (!Number.isInteger(minimumAge) || minimumAge < 0 || minimumAge > 99) {
    return "hints.contentMinimumAge.range";
  }
  return undefined;
}

export function validateContentThumbnail(thumbnail: File | undefined): string | undefined {
  if (!thumbnail) return undefined; // Campo opcional

  // Validar tipo de archivo
  if (!thumbnail.type.startsWith('image/')) {
    return "hints.contentThumbnail.type";
  }

  // Validar tamaño (1MB máximo)
  if (thumbnail.size > 1 * 1024 * 1024) {
    return "hints.contentThumbnail.size";
  }

  return undefined;
}

export function validateContentAvailableUntil(availableUntil: string, isVisible: boolean): string | undefined {
  if (!isVisible) return undefined; // No validar si no está visible

  // Solo validar si hay un valor (campo opcional)
  if (!availableUntil.trim()) return undefined;

  const selectedDate = new Date(availableUntil);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear hora para comparación

  if (selectedDate <= today) {
    return "hints.contentAvailableUntil.future";
  }

  return undefined;
}

export function validateContentTags(tags: string): string | undefined {
  if (!tags?.trim()) return "hints.contentTags.required";

  const trimmedTags = tags.trim();
  const tagArray = trimmedTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  if (tagArray.length === 0) return "hints.contentTags.minTags";

  if (tagArray.length > 10) return "hints.contentTags.maxTags";

  // Validar cada tag individualmente
  for (const tag of tagArray) {
    if (tag.length < 2) return "hints.contentTags.tagMinLength";
    if (tag.length > 20) return "hints.contentTags.tagMaxLength";
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(tag)) {
      return "hints.contentTags.tagPattern";
    }
  }

  return undefined;
}

// ============ VALIDACIÓN COMPLETA DEL FORMULARIO ============

export interface ContentFormData {
  title: string;
  description: string;
  maxQuality: string;
  minimumAge?: number;
  thumbnailImage?: File;
  isPremium: boolean;
  isVisible: boolean;
  availableUntil: string;
  tags: string;
}

export function validateContentForm(formData: ContentFormData): Partial<Record<keyof ContentFormData, string>> {
  const errors: Partial<Record<keyof ContentFormData, string>> = {};

  // Validar campos requeridos
  const titleError = validateContentTitle(formData.title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateContentDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;

  const maxQualityError = validateContentMaxQuality(formData.maxQuality);
  if (maxQualityError) errors.maxQuality = maxQualityError;

  const minimumAgeError = validateContentMinimumAge(formData.minimumAge);
  if (minimumAgeError) errors.minimumAge = minimumAgeError;

  const thumbnailImageError = validateContentThumbnail(formData.thumbnailImage);
  if (thumbnailImageError) errors.thumbnailImage = thumbnailImageError;

  const availableUntilError = validateContentAvailableUntil(formData.availableUntil, formData.isVisible);
  if (availableUntilError) errors.availableUntil = availableUntilError;

  const tagsError = validateContentTags(formData.tags);
  if (tagsError) errors.tags = tagsError;

  return errors;
}

// ============ VALIDACIONES PARA REQUISITOS DE CONTRASEÑA ============

export interface PasswordRequirements {
  length: boolean
  mixedCase: boolean
  numbersOrSymbols: boolean
  noObviousPatterns: boolean
  noCommonWords: boolean
  noPersonalData: boolean
}

export function evaluatePasswordRequirements(
  password: string,
  personalData?: {
    firstName?: string
    lastName?: string
    alias?: string
    birthDate?: string
  }
): PasswordRequirements {
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumbersOrSymbols = /\d/.test(password) || /[^a-zA-Z0-9]/.test(password)

  // Patrones obvios más comunes (divididos para evitar complejidad)
  const sequences = /(?:012|123|234|345|456|567|678|789|890)/
  const letters1 = /(?:abc|bcd|cde|def|efg|fgh|ghi)/i
  const letters2 = /(?:hij|ijk|jkl|klm|mno)/i
  const letters3 = /(?:nop|opq|pqr|qrs|rst|stu)/i
  const letters4 = /(?:tuv|uvw|vwx|wxy|xyz)/i
  const common = /(?:qwerty|asdf|zxcv)/i
  const repeatedChars = /(.)\1{3,}/
  const noObviousPatterns = !sequences.test(password) && !letters1.test(password) && !letters2.test(password) &&
                           !letters3.test(password) && !letters4.test(password) && !common.test(password) &&
                           !repeatedChars.test(password)

  // Palabras comunes
  const commonWords = /\b(password|admin|user|login|welcome|letmein|monkey|dragon|football|baseball|superman|trustno1|123456|qwerty|abc123)\b/i
  const noCommonWords = !commonWords.test(password)

  // Datos personales
  const personalDataPattern = personalData ?
    new RegExp(`${personalData.firstName || ''}|${personalData.lastName || ''}|${personalData.alias || ''}|${personalData.birthDate || ''}`, 'i') :
    null
  const noPersonalData = !personalDataPattern || !personalDataPattern.test(password) ||
                        !(personalData?.firstName || personalData?.lastName)

  return {
    length: password.length >= 8,
    mixedCase: hasLowerCase && hasUpperCase,
    numbersOrSymbols: hasNumbersOrSymbols,
    noObviousPatterns,
    noCommonWords,
    noPersonalData
  }
}

export function getPasswordRequirements(
  password: string,
  personalData?: {
    firstName?: string
    lastName?: string
    alias?: string
    birthDate?: string
  }
): PasswordRequirements {
  if (!password) {
    return {
      length: false,
      mixedCase: false,
      numbersOrSymbols: false,
      noObviousPatterns: false,
      noCommonWords: false,
      noPersonalData: false
    }
  }

  // Intentar usar zxcvbn si está disponible (importado dinámicamente)
  try {
    // Verificar si zxcvbn está disponible globalmente (importado en el componente)
    const zxcvbn = (globalThis as any).zxcvbn
    if (zxcvbn) {
      const zxcvbnResult = zxcvbn(password)
      const zxcvbnScore = zxcvbnResult.score

      // Si zxcvbn da puntuación 3 o más, considerar que todos los requisitos están cumplidos
      if (zxcvbnScore >= 3) {
        return {
          length: true,
          mixedCase: true,
          numbersOrSymbols: true,
          noObviousPatterns: true,
          noCommonWords: true,
          noPersonalData: true
        }
      }
    }
  } catch (zxcvbnError) {
    // Si zxcvbn no está disponible, continuar con la evaluación manual
    // Este catch es intencional para manejar el caso donde zxcvbn no está cargado
    console.warn('zxcvbn not available, falling back to manual password validation:', zxcvbnError)
  }

  // Si la puntuación es menor a 3 o zxcvbn no está disponible, evaluar requisitos individuales
  return evaluatePasswordRequirements(password, personalData)
}

// ============ VALIDACIONES PARA ADMINISTRADORES ============

export function validateDepartment(department: string): string | undefined {
  return validateField(department, { required: true, minLength: 3, maxLength: 100 }, {
    required: "hints.department.required",
    minLength: "hints.department.minLength",
    maxLength: "hints.department.maxLength",
  });
}

// ============ VALIDACIONES PARA LISTAS DE CONTENIDO ============

export function validateListName(name: string): string | undefined {
  if (!name?.trim()) return "hints.listName.required";
  if (name.trim().length < 3) return "hints.listName.minLength";
  if (name.trim().length > 100) return "hints.listName.maxLength";
  return undefined;
}

export function validateListDescription(description: string): string | undefined {
  if (description && description.trim().length > 500) return "hints.listDescription.maxLength";
  return undefined;
}