import { useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import '../styles/components/ConfirmationModal.css'

interface ConfirmationModalProps {
  readonly isOpen: boolean
  readonly title: string
  readonly message: string
  readonly confirmText?: string
  readonly cancelText?: string
  readonly confirmButtonClass?: string
  readonly onConfirm: () => void | Promise<void>
  readonly onCancel: () => void
  readonly isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonClass = 'btn-danger',
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmationModalProps) {
  const { t } = useI18n()

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel, isLoading])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="confirmation-modal-backdrop"
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && !isLoading) {
            onCancel()
          }
        }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Modal */}
        <div
          className="confirmation-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
          aria-describedby="confirmation-message"
        >
          <div className="confirmation-modal-header">
            <h3 id="confirmation-title" className="confirmation-modal-title">{title}</h3>
            <button
              className="confirmation-modal-close"
              onClick={onCancel}
              aria-label={t('common.close')}
              disabled={isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div className="confirmation-modal-body">
            <p id="confirmation-message" className="confirmation-modal-message">{message}</p>
          </div>

          <div className="confirmation-modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText || t('common.cancel')}
            </button>
            <button
              className={`btn ${confirmButtonClass}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('common.processing')}
                </>
              ) : (
                confirmText || t('common.confirm')
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}