// src/components/ContentVisibilityToggle.tsx
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { contentVisibilityService } from '../services/contentVisibilityService'
import { log } from '../config/logConfig'

interface ContentVisibilityToggleProps {
  contentId: string
  currentState: 'VISIBLE' | 'OCULTO'
  onUpdate: (newState: 'VISIBLE' | 'OCULTO') => void
  disabled?: boolean
}

/**
 * Componente toggle para cambiar la visibilidad de un contenido.
 * Permite a los creadores activar/desactivar la visibilidad de su contenido.
 */
export const ContentVisibilityToggle: React.FC<ContentVisibilityToggleProps> = ({
  contentId,
  currentState,
  onUpdate,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const isVisible = currentState === 'VISIBLE'

  const handleToggle = async () => {
    if (disabled || isLoading) return

    const newState = isVisible ? 'OCULTO' : 'VISIBLE'
    setIsLoading(true)

    try {
      log('info', `🔄 Cambiando visibilidad de contenido ${contentId} a ${newState}`)

      const result = await contentVisibilityService.toggleVisibility(contentId, newState)

      if (result.success) {
        onUpdate(result.newState)
        toast.success(result.message || 'Visibilidad actualizada correctamente', {
          position: 'top-right',
          autoClose: 3000,
        })
        log('info', `✅ Visibilidad actualizada: ${contentId} -> ${result.newState}`)
      } else {
        toast.error(result.error || 'Error al cambiar visibilidad', {
          position: 'top-right',
          autoClose: 5000,
        })
        log('error', `❌ Error al cambiar visibilidad: ${result.error}`)
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Error de conexión al cambiar visibilidad'
      toast.error(errorMsg, {
        position: 'top-right',
        autoClose: 5000,
      })
      log('error', '❌ Error al cambiar visibilidad:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="visibility-toggle d-flex flex-column">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`visibility-toggle-${contentId}`}
          checked={isVisible}
          onChange={handleToggle}
          disabled={disabled || isLoading}
          style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
        />
        <label
          className="form-check-label"
          htmlFor={`visibility-toggle-${contentId}`}
          style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Actualizando...
            </>
          ) : (
            <>
              {isVisible ? (
                <>
                  <i className="bi bi-eye-fill me-1 text-success"></i>
                  <span className="fw-bold text-success">Visible</span>
                </>
              ) : (
                <>
                  <i className="bi bi-eye-slash-fill me-1 text-secondary"></i>
                  <span className="fw-bold text-secondary">Oculto</span>
                </>
              )}
            </>
          )}
        </label>
      </div>
      
      <small className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
        {isVisible ? (
          <i className="bi bi-info-circle me-1"></i>
        ) : (
          <i className="bi bi-lock-fill me-1"></i>
        )}
        {isVisible
          ? 'El contenido es visible para todos los usuarios'
          : 'El contenido está oculto, solo tú puedes verlo'}
      </small>
    </div>
  )
}
