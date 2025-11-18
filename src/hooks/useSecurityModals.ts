import { useState } from 'react'
import { useApp } from './useApp'
import { useDeleteAccount } from './useDeleteAccount'

// Hook personalizado para manejar modales de seguridad
export const useSecurityModals = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; feedback: { suggestions: string[]; warning: string } } | null>(null)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [isDeletePasswordModalOpen, setIsDeletePasswordModalOpen] = useState(false)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)
  const [is3FAModalOpen, setIs3FAModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  const { deleteAccount, isDeleting, deleteError, clearError } = useDeleteAccount()
  const { user } = useApp()

  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true)
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false)

  const handleOpen2FAModal = () => setIs2FAModalOpen(true)
  const handleClose2FAModal = () => setIs2FAModalOpen(false)

  const handleOpen3FAModal = () => setIs3FAModalOpen(true)
  const handleClose3FAModal = () => setIs3FAModalOpen(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    if (password.length > 0) {
      // Import zxcvbn dynamically to avoid issues
      import('zxcvbn').then((zxcvbn) => {
        const result = zxcvbn.default(password)
        setPasswordStrength({ score: result.score, feedback: result.feedback })
      })
    } else {
      setPasswordStrength(null)
    }
  }

  const handleOpenDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(true)
  const handleCloseDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(false)

  const handleConfirmDelete = () => {
    setIsDeleteConfirmModalOpen(false)
    setIsDeletePasswordModalOpen(true)
  }

  const handleCloseDeletePasswordModal = () => {
    setIsDeletePasswordModalOpen(false)
    setDeletePassword('')
    clearError() // Limpiar el error cuando se cierra el modal
  }

  const handleDeleteAccount = async () => {
    if (!user?.id || !deletePassword.trim()) {
      return
    }
    await deleteAccount(user.id, deletePassword)
  }

  return {
    isPasswordModalOpen,
    passwordStrength,
    isDeleteConfirmModalOpen,
    isDeletePasswordModalOpen,
    is2FAModalOpen,
    is3FAModalOpen,
    deletePassword,
    setDeletePassword,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handleOpen2FAModal,
    handleClose2FAModal,
    handleOpen3FAModal,
    handleClose3FAModal,
    handlePasswordChange,
    handleOpenDeleteConfirmModal,
    handleCloseDeleteConfirmModal,
    handleConfirmDelete,
    handleCloseDeletePasswordModal,
    handleDeleteAccount,
    // Estados de eliminación del hook useDeleteAccount
    isDeleting,
    deleteError,
    clearError
  }
}