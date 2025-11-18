import React, { useState, forwardRef } from 'react'
import '../styles/customcomponents/Textbox.css'

export interface TextboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  /** Tipo del input o si es textarea */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date'
  as?: 'input' | 'textarea'

  /** Etiqueta del campo */
  label?: string

  /** Si el campo es requerido (muestra * en el label) */
  required?: boolean

  /** Placeholder del input */
  placeholder?: string

  /** Valor del input */
  value?: string

  /** Función de cambio */
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void

  /** Mensaje de error */
  error?: string

  /** Mensaje de éxito */
  success?: string

  /** Mensaje informativo */
  info?: string

  /** Icono Material Design a la izquierda */
  icon?: string

  /** Si está cargando */
  loading?: boolean

  /** Clases adicionales */
  className?: string

  /** ID del input */
  id?: string

  /** Nombre del input */
  name?: string

  /** Si está deshabilitado */
  disabled?: boolean

  /** Si no debe renderizar el wrapper (solo el input) */
  noWrapper?: boolean

  /** Atributos adicionales */
  [key: string]: any
}

const Textbox = forwardRef<HTMLElement, TextboxProps>(({
  type = 'text',
  as = 'input',
  label,
  required = false,
  placeholder,
  value,
  onChange,
  error,
  success,
  info,
  icon,
  loading = false,
  className = '',
  id,
  name,
  disabled = false,
  noWrapper = false,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password' && as === 'input'
  const inputType = isPassword && showPassword ? 'text' : type

  const wrapperClasses = [
    'textbox-wrapper',
    'textbox-container-styles', // Agregamos esta clase para los estilos del container
    className, // Agregamos la clase personalizada del usuario
    icon && 'textbox-with-icon',
    type === 'search' && 'textbox-search',
    type === 'number' && 'textbox-number',
    type === 'date' && 'textbox-date',
    rest.readOnly && 'textbox-readonly'
  ].filter(Boolean).join(' ')

  const inputClasses = [
    'textbox-input',
    as === 'textarea' && 'textbox-textarea', // Agregamos clase específica para textarea
    className, // Aplicar className siempre al input
    error && 'textbox-error',
    success && 'textbox-valid',
    !error && !success && 'textbox-neutral'
  ].filter(Boolean).join(' ')

  const labelClasses = [
    'textbox-label',
    required && 'textbox-label-required'
  ].filter(Boolean).join(' ')

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'email':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        )
      case 'person':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        )
      case 'alternate_email':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.43-1.5 1.43s-1.5-.64-1.5-1.43V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
          </svg>
        )
      case 'calendar_today':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-1.99.9-1.99 2L2 21c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
          </svg>
        )
      case 'search':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        )
      default:
        return null
    }
  }

  const renderPasswordToggle = () => (
    <button
      type="button"
      className="textbox-password-toggle"
      onClick={togglePassword}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      tabIndex={-1}
    >
      {showPassword ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  )

  const renderInput = () => {
    const commonProps = {
      id,
      name,
      placeholder,
      value,
      onChange,
      disabled: disabled || loading,
      className: inputClasses,
      ...rest
    }

    if (as === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...commonProps}
        />
      )
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={inputType}
        {...commonProps}
      />
    )
  }

  const containerClasses = [
    'textbox-container',
    'textbox-container-styles',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}

      {noWrapper ? (
        <>
          {icon && (
            <span className="textbox-icon">
              {renderIcon(icon)}
            </span>
          )}

          {renderInput()}

          {isPassword && !disabled && !loading && renderPasswordToggle()}
        </>
      ) : (
        <div className={wrapperClasses}>
          {icon && (
            <span className="textbox-icon">
              {renderIcon(icon)}
            </span>
          )}

          {renderInput()}

          {isPassword && !disabled && !loading && renderPasswordToggle()}
        </div>
      )}

      {error && (
        <div className="textbox-hint textbox-hint-error">
          {error}
        </div>
      )}

      {!error && success && (
        <div className="textbox-hint textbox-hint-success">
          {success}
        </div>
      )}

      {!error && !success && info && (
        <div className="textbox-hint textbox-hint-info">
          {info}
        </div>
      )}
    </div>
  )
})

Textbox.displayName = 'Textbox'

export default Textbox