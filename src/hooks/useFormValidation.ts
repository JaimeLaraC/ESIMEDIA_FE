import { useState, useCallback } from 'react'

/**
 * Generic form validation hook that eliminates duplicate validation logic across forms
 *
 * @template T - The form data type
 * @param validatorMap - Map of field names to their validator functions
 * @param t - Translation function for error messages
 * @returns Validation state and methods
 *
 * @example
 * const { errors, validateField, validateAll, setErrors } = useFormValidation({
 *   email: validateEmail,
 *   firstName: validateFirstName
 * }, t)
 */
export function useFormValidation<T extends Record<string, any>>(
  validatorMap: Partial<Record<keyof T, (value: any) => string | undefined>>,
  t: (key: string) => string
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  /**
   * Validates a single field and returns the error message
   */
  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    const validator = validatorMap[field]
    if (!validator) return undefined

    const errorKey = validator(value)
    return errorKey ? t(errorKey) : undefined
  }, [validatorMap, t])

  /**
   * Validates a single field and updates error state
   */
  const validateAndSetField = useCallback((field: keyof T, value: any): string | undefined => {
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
    return error
  }, [validateField])

  /**
   * Validates all fields in the form data
   * @returns true if form is valid (no errors), false otherwise
   */
  const validateAll = useCallback((formData: T): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.keys(validatorMap).forEach(key => {
      const field = key as keyof T
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [validatorMap, validateField])

  /**
   * Clears all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Clears error for a specific field
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    errors,
    setErrors,
    validateField,
    validateAndSetField,
    validateAll,
    clearErrors,
    clearFieldError
  }
}
