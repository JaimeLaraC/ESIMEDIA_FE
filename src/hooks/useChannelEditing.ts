// src/hooks/useChannelEditing.ts
import { useState, useCallback } from 'react'
import { log } from '../config/logConfig'
import { UserService } from '../services/userService'

interface CreatorChannel {
  id: string
  name: string
  profileImage: string
  description: string
  subscriberCount: number
  createdAt: string
  contentType: 'audio' | 'video'
  specialty: string
}

export function useChannelEditing(initialData: CreatorChannel | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingData, setEditingData] = useState<{ description: string; specialty: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ description?: string; specialty?: string }>({})

  const startEditing = useCallback(() => {
    if (!initialData) return
    setEditingData({
      description: initialData.description,
      specialty: initialData.specialty
    })
    setValidationErrors({})
    setIsEditing(true)
  }, [initialData])

  const saveChanges = useCallback(async () => {
    if (!editingData || !initialData) return false

    // Limpiar errores previos
    setValidationErrors({})

    // Validación de especialidad (requerida)
    if (!editingData.specialty.trim()) {
      setValidationErrors(prev => ({ ...prev, specialty: 'La especialidad es requerida' }))
      log('warn', 'Especialidad requerida vacía en edición de canal')
      return false
    }

    // Validación de descripción (opcional, pero mínimo 10 caracteres si tiene contenido)
    const descriptionTrimmed = editingData.description.trim()
    if (descriptionTrimmed && descriptionTrimmed.length < 10) {
      setValidationErrors(prev => ({ ...prev, description: 'La descripción debe tener al menos 10 caracteres' }))
      log('warn', 'Descripción demasiado corta en edición de canal')
      return false
    }

    try {
      log('info', 'Guardando cambios del canal:', editingData)

      // Obtener los datos actuales del usuario para enviar nombre y apellido
      const currentUser = await UserService.getCurrentUser()
      log('info', 'Datos actuales del usuario obtenidos:', { nombre: currentUser.nombre, apellido: currentUser.apellido })

      // Llamar a la API para actualizar el perfil del creador
      await UserService.updateProfile({
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        especialidad: editingData.specialty,
        descripcion: editingData.description
      })

      log('info', 'Cambios del canal guardados exitosamente')
      setIsEditing(false)
      setEditingData(null)
      setValidationErrors({})
      return true
    } catch (error) {
      log('error', 'Error guardando cambios del canal:', error)
      return false
    }
  }, [editingData, initialData])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditingData(null)
    setValidationErrors({})
  }, [])

  const updateData = useCallback((data: { description: string; specialty: string }) => {
    setEditingData(data)

    // Validación en tiempo real
    const newErrors: { description?: string; specialty?: string } = {}

    // Validación de especialidad
    if (!data.specialty.trim()) {
      newErrors.specialty = 'La especialidad es requerida'
    }

    // Validación de descripción
    const descriptionTrimmed = data.description.trim()
    if (descriptionTrimmed && descriptionTrimmed.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    setValidationErrors(newErrors)
  }, [])

  return {
    isEditing,
    editingData,
    validationErrors,
    startEditing,
    saveChanges,
    cancelEditing,
    updateData
  }
}