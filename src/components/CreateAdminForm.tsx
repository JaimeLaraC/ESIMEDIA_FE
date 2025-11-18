// src/components/CreateAdminForm.tsx
import { useState, useCallback, useRef, useEffect } from 'react'
import Textbox from '../customcomponents/Textbox'
import AvatarSelector from '../components/AvatarSelector'
import { createAdmin } from '../services/adminService'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { checkEmailAvailability } from '../services/registerService'
import { useI18n } from '../hooks/useI18n'
import { useFormValidation } from '../hooks/useFormValidation'
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateDepartment,
  validatePhoto,
} from '../utils/fieldValidator'

interface CreateAdminFormProps {
  readonly onSubmit?: (adminData: AdminData) => void
}

interface AdminData {
  firstName: string
  lastName: string
  email: string
  adminArea: string
  profileImage: string
}

export default function CreateAdminForm({ onSubmit }: CreateAdminFormProps) {
  const { t } = useI18n()
  const { error, success } = useNotifications()

  // Use shared form validation hook
  const { errors: validationErrors, setErrors: setValidationErrors, validateField } = useFormValidation<AdminData>({
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    adminArea: validateDepartment,
    profileImage: validatePhoto
  }, t)

  const [formData, setFormData] = useState<AdminData>({
    firstName: '',
    lastName: '',
    email: '',
    adminArea: '',
    profileImage: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailChecking, setEmailChecking] = useState(false)

  // Ref para el timeout del debounce
  const emailCheckTimeoutRef = useRef<number | null>(null)

  // Limpiar timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current)
      }
    }
  }, [])

  // Función debounced para verificar email
  const debouncedEmailCheck = useCallback(async (email: string) => {
    if (!email.trim()) return

    setEmailChecking(true)
    try {
      const emailCheck = await checkEmailAvailability(email.trim())
      setValidationErrors(prev => ({
        ...prev,
        email: emailCheck.exists ? t('admin.createAdminForm.errors.emailExists') : undefined
      }))
    } catch (err) {
      console.warn(t('admin.createAdminForm.errors.emailCheckFailed'), err)
      // No mostramos error si falla la verificación, solo lo logueamos
    } finally {
      setEmailChecking(false)
    }
  }, [])

  // Función helper para validar email con debounce
  const handleEmailValidation = useCallback((value: string) => {
    const emailError = validateEmail(value)
    const error = emailError ? t(emailError) : undefined

    // Limpiar timeout anterior
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current)
    }

    // Si el email es válido, programar verificación con debounce
    if (!error && value.trim()) {
      emailCheckTimeoutRef.current = setTimeout(() => {
        debouncedEmailCheck(value)
      }, 800) // Esperar 800ms después de que el usuario deje de escribir
    } else {
      // Si hay error de formato o email vacío, limpiar estado de checking
      setEmailChecking(false)
      setValidationErrors(prev => ({
        ...prev,
        email: error
      }))
    }

    return error
  }, [t, debouncedEmailCheck])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const field = name as keyof AdminData

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validate field using shared hook
    if (field === 'email') {
      handleEmailValidation(value)
    } else {
      const error = validateField(field, value)
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }))
    }
  }

  const validateForm = async (): Promise<boolean> => {
    // Clear any pending timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current)
      emailCheckTimeoutRef.current = null
    }

    // Validate all fields using shared hook
    const errors: Partial<Record<keyof AdminData, string>> = {}
    const fields: (keyof AdminData)[] = ['firstName', 'lastName', 'email', 'adminArea', 'profileImage']

    fields.forEach(field => {
      const error = validateField(field, formData[field])
      if (error) errors[field] = error
    })

    // Check email availability if format is valid
    if (!errors.email && formData.email.trim()) {
      setEmailChecking(true)
      try {
        const emailCheck = await checkEmailAvailability(formData.email.trim())
        if (emailCheck.exists) {
          errors.email = 'Este correo electrónico ya está registrado'
        }
      } catch (err) {
        console.warn('No se pudo verificar la disponibilidad del email:', err)
      } finally {
        setEmailChecking(false)
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = await validateForm()
    if (!isValid) {
      error(t('admin.createAdminForm.errors.formValidation'))
      return
    }

    setIsSubmitting(true)

    try {
      const adminData = {
        email: formData.email.trim(),
        nombre: formData.firstName.trim(),
        apellido: formData.lastName.trim(),
        departamento: formData.adminArea.trim(),
        profileImage: formData.profileImage
      }

      const result = await createAdmin(adminData)

      if (result.success) {
        success(result.message || t('admin.createAdminForm.errors.createSuccess'))
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          adminArea: '',
          profileImage: ''
        })
        setValidationErrors({})

        // Llamar al callback si existe
        if (onSubmit) {
          onSubmit(formData)
        }
      } else {
        error(result.message || t('admin.createAdminForm.errors.createFailed'))
      }
    } catch (err) {
      console.error('Error al crear administrador:', err)
      const errorMessage = err instanceof Error ? err.message : t('admin.createAdminForm.errors.unknownError')
      error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card card-lg">
      <div className="content-header">
        <h2>{t('admin.createAdminForm.title')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="create-admin-form">
        <div className="form-row">
          <div className="form-group">
            <Textbox
              type="text"
              label={t('admin.createAdminForm.fields.firstName')}
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              error={validationErrors.firstName}
            />
          </div>

          <div className="form-group">
            <Textbox
              type="text"
              label={t('admin.createAdminForm.fields.lastName')}
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              error={validationErrors.lastName}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Textbox
              type="email"
              label={t('admin.createAdminForm.fields.email')}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={validationErrors.email}
              disabled={emailChecking}
            />
            {emailChecking}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <Textbox
              type="text"
              label={t('admin.createAdminForm.fields.adminArea')}
              name="adminArea"
              value={formData.adminArea}
              onChange={handleInputChange}
              placeholder={t('admin.createAdminForm.placeholders.adminArea')}
              required
              error={validationErrors.adminArea}
            />
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">{t('admin.createAdminForm.fields.profileImage')}</label>
            <div className="admin-form">
              <AvatarSelector
                selectedAvatarUrl={formData.profileImage}
                onAvatarSelect={(avatar) => setFormData(prev => ({ ...prev, profileImage: avatar }))}
              />
            </div>
            {validationErrors.profileImage && <span className="error-message">{validationErrors.profileImage}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || emailChecking}
          >
            {isSubmitting ? t('admin.createAdminForm.buttons.submitting') : t('admin.createAdminForm.buttons.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}