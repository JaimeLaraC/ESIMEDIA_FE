import { useState, useEffect } from 'react'
import { log } from '../config/logConfig'
import type { UserProfile, ProfilePageProps } from '../utils/profileUtils'

// Hook personalizado para manejar el estado de edición del perfil
export const useProfileEditing = (profileData: UserProfile, onSaveProfile?: ProfilePageProps['onSaveProfile']) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [aliasValue, setAliasValue] = useState(profileData.alias || '')
  const [firstNameValue, setFirstNameValue] = useState(profileData.firstName)
  const [lastNameValue, setLastNameValue] = useState(profileData.lastName)

  // Inicializar valores cuando cambie profileData
  useEffect(() => {
    setAliasValue(profileData.alias || '')
    setFirstNameValue(profileData.firstName)
    setLastNameValue(profileData.lastName)
  }, [profileData.alias, profileData.firstName, profileData.lastName])

  const handleProfileEditToggle = () => {
    if (isEditingProfile) {
      // Cancelar edición - restaurar valores originales
      setAliasValue(profileData.alias || '')
      setFirstNameValue(profileData.firstName)
      setLastNameValue(profileData.lastName)
    }
    setIsEditingProfile(!isEditingProfile)
  }

  const handleSaveProfile = () => {
    const updatedData: { alias?: string; firstName: string; lastName: string } = {
      firstName: firstNameValue,
      lastName: lastNameValue
    }

    // Only include alias if the user role allows editing it (not admin)
    if (profileData.role !== 'admin') {
      updatedData.alias = aliasValue || undefined
    }

    if (onSaveProfile) {
      onSaveProfile(updatedData)
    } else {
      // Lógica por defecto si no hay callback
      log('info', 'Guardando perfil:', updatedData)
    }

    setIsEditingProfile(false)
  }

  return {
    isEditingProfile,
    aliasValue,
    firstNameValue,
    lastNameValue,
    setAliasValue,
    setFirstNameValue,
    setLastNameValue,
    handleProfileEditToggle,
    handleSaveProfile
  }
}