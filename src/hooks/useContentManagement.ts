// src/hooks/useContentManagement.ts
import { useState, useCallback, useEffect } from 'react'
import { log } from '../config/logConfig'
import { contentVisibilityService } from '../services/contentVisibilityService'
import { toast } from 'react-toastify'

interface Content {
  id: string
  title: string
  thumbnail: string
  views: number
  duration: string
  publishedAt: string
  rating: number
  isVisible: boolean
  isPremium: boolean
  state?: 'VISIBLE' | 'OCULTO' // Añadido para compatibilidad con backend
}

export function useContentManagement(initialContent: Content[]) {
  const [content, setContent] = useState<Content[]>([])
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Actualizar contenido solo cuando realmente cambie el contenido (no la referencia)
  useEffect(() => {
    const contentStr = JSON.stringify(initialContent)
    const currentStr = JSON.stringify(content)
    if (contentStr !== currentStr) {
      setContent(initialContent)
    }
  }, [initialContent]) // Eliminamos 'content' de las dependencias para evitar bucle

  const toggleVisibility = useCallback(async (id: string) => {
    // Encontrar el contenido actual
    const currentContent = content.find(item => item.id === id)
    if (!currentContent) return

    // Determinar el nuevo estado basado en isVisible o state
    const currentState = currentContent.state || (currentContent.isVisible ? 'VISIBLE' : 'OCULTO')
    const newState = currentState === 'VISIBLE' ? 'OCULTO' : 'VISIBLE'

    setIsUpdating(id)

    try {
      log('info', `🔄 Cambiando visibilidad de contenido ${id} a ${newState}`)

      // Llamar al backend
      const result = await contentVisibilityService.toggleVisibility(id, newState)

      if (result.success) {
        // Actualizar estado local
        setContent(prev => prev.map(item =>
          item.id === id 
            ? { 
                ...item, 
                isVisible: result.newState === 'VISIBLE',
                state: result.newState 
              } 
            : item
        ))

        toast.success(result.message || 'Visibilidad actualizada correctamente', {
          position: 'top-right',
          autoClose: 3000,
        })

        log('info', `✅ Visibilidad actualizada: ${id} -> ${result.newState}`)
      } else {
        toast.error(result.error || 'Error al cambiar visibilidad', {
          position: 'top-right',
          autoClose: 5000,
        })
      }
    } catch (error: any) {
      log('error', '❌ Error al cambiar visibilidad:', error)
      
      const errorMsg = error.message || 'Error de conexión al cambiar visibilidad'
      toast.error(errorMsg, {
        position: 'top-right',
        autoClose: 5000,
      })
    } finally {
      setIsUpdating(null)
    }
  }, [content])

  const togglePremium = useCallback((id: string) => {
    setContent(prev => prev.map(item =>
      item.id === id ? { ...item, isPremium: !item.isPremium } : item
    ))
  }, [])

  const editContent = useCallback((id: string) => {
    // TODO: Implementar lógica de edición de contenido
    log('info', 'Editando contenido:', id)
  }, [])

  return {
    content,
    toggleVisibility,
    togglePremium,
    editContent,
    isUpdating
  }
}