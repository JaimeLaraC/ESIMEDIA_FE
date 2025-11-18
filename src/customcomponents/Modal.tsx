import { type ReactNode, useEffect, useRef } from 'react'
import { useI18n } from '../hooks/useI18n'
import '../styles/customcomponents/Modal.css'

interface ModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title: string
  readonly children: ReactNode
  readonly size?: 'small' | 'medium' | 'large'
  readonly showCloseButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true
}: ModalProps) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
      dialog.showModal()
      // Reset scroll to top when modal opens
      setTimeout(() => {
        dialog.scrollTop = 0
      }, 0)
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = ''
      dialog.close()
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay con blur personalizado */}
      {isOpen && <div className="modal-overlay" />}

      <dialog ref={dialogRef} className={`modal modal-${size}`} onClose={handleClose}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            {showCloseButton && (
              <button
                className="modal-close"
                onClick={handleClose}
                aria-label={t('common.close')}
              >
                ✕
              </button>
            )}
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </dialog>
    </>
  )
}