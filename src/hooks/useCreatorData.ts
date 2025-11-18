// src/hooks/useCreatorData.ts
import { useState, useEffect, useCallback } from 'react'
import { log } from '../config/logConfig'
import { useApp } from '../context/AppContextHooks'
import { UserService } from '../services/userService'
import { fetchWithAuth } from '../utils/fetchWithAuth'
import type { UserSummaryManagerDTO } from '../services/loginService'
import defaultAvatar from '../assets/profile_images/default.svg'
import defaultVideoImage from '../assets/default_video.png'
import defaultAudioImage from '../assets/default_audio.png'

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

interface ChannelMetrics {
  totalViews: number
  publishedContent: number
  averageRating: number
}

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
}


export function useCreatorData() {
  const { user } = useApp()
  const [channelData, setChannelData] = useState<CreatorChannel | null>(null)
  const [metrics, setMetrics] = useState<ChannelMetrics | null>(null)
  const [recentContent, setRecentContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCreatorData = useCallback(async () => {
    if (!user) {
      log('warn', '❌ No hay usuario autenticado')
      setError('Usuario no autenticado')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      log('info', '🔄 Iniciando carga de datos del creador:', { userId: user.id, userType: user.type })

      // Obtener los datos completos del usuario desde el backend (incluye campos específicos de Manager/Creator)
      const userData = await UserService.getUserById(user.id)
      log('info', 'DTO recibido para creator:', userData)

      // Verificar que sea un ManagerDTO (creator)
      const isManagerDTO = (dto: typeof userData): dto is UserSummaryManagerDTO => {
        return 'descripcion' in dto || 'especialidad' in dto || dto.role === 'CREADOR_DE_CONTENIDO'
      }

      if (!isManagerDTO(userData)) {
        log('warn', 'El usuario no es un creator/manager')
        setError('El usuario no tiene perfil de creador')
        setIsLoading(false)
        return
      }

      // Mapear tipo de contenido del backend al frontend
      // El enum en BD es minúsculas: 'audio', 'video'
      const contentTypeMap: Record<string, 'audio' | 'video'> = {
        'audio': 'audio',
        'video': 'video',
        // También soportamos mayúsculas por si cambia en el futuro
        'AUDIO': 'audio',
        'VIDEO': 'video'
      }

      // Mapear especialidades (puede ser un array, tomamos la primera o 'General')
      const specialty = Array.isArray(userData.especialidad) 
        ? (userData.especialidad[0] ?? 'General')
        : (userData.especialidad ?? 'General')

      // Log para debugging del tipo de contenido
      log('info', 'Tipo de contenido del DTO:', userData.tipoContenido)
      const mappedContentType = userData.tipoContenido ? (contentTypeMap[userData.tipoContenido] || 'audio') : 'audio'
      log('info', 'Tipo de contenido mapeado:', mappedContentType)

      setChannelData({
        id: userData.id,
        name: userData.alias || `${userData.nombre} ${userData.apellido}`,
        profileImage: userData.fotoPerfilUrl || defaultAvatar,
        description: userData.descripcion || 'Sin descripción',
        subscriberCount: 0, // Cuando el backend tenga esta métrica
        createdAt: userData.createdAt || new Date().toISOString(),
        contentType: mappedContentType,
        specialty: specialty
      })

      // Obtener todo el contenido según el tipo que puede subir el creador
      try {
        log('info', '📡 Solicitando todo el contenido disponible...')
        
        // Determinar el tipo de contenido a buscar según lo que puede subir el creador
        const contentTypeToSearch = mappedContentType === 'video' ? 'video' : 'audio'
        log('info', `🔍 Obteniendo contenido tipo: ${contentTypeToSearch}`)
        
        // Usar el endpoint público de contenido que no requiere permisos específicos
        const response = await fetchWithAuth(`${import.meta.env.VITE_USERS_API_URL}/api/content?type=${contentTypeToSearch}`, {
          method: 'GET'
        })
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const contents = await response.json()
        
        log('info', `✅ Respuesta recibida del backend:`, { 
          isArray: Array.isArray(contents), 
          length: Array.isArray(contents) ? contents.length : 'N/A',
          contentType: contentTypeToSearch,
          data: contents 
        })
        
        // Mapear contenidos del backend al formato del frontend
        const mappedContents = Array.isArray(contents) ? contents.map((content: any) => {
          const defaultThumbnail = contentTypeToSearch === 'video' ? defaultVideoImage : defaultAudioImage
          const mappedContent = {
            id: content.id || 'unknown',
            title: content.title || 'Sin título',
            thumbnail: content.thumbnail || defaultThumbnail,
            views: content.views || 0,
            duration: content.duration || 'N/A',
            publishedAt: content.addedAt || new Date().toISOString(),
            rating: content.rating || 0,
            isVisible: true, // Los contenidos en búsqueda deberían ser visibles
            isPremium: content.isPremium || false
          }
          log('debug', 'Contenido mapeado:', mappedContent)
          return mappedContent
        }) : []
        
        setRecentContent(mappedContents)
        log('info', `✅ ${mappedContents.length} contenidos mapeados y guardados`)
        
        // Calcular métricas reales
        const totalViews = Array.isArray(contents) 
          ? contents.reduce((sum: number, c: any) => sum + (c.views || 0), 0) 
          : 0
        const visibleContents = Array.isArray(contents)
          ? contents.filter((c: any) => c.state === 'VISIBLE')
          : []
        const avgRating = Array.isArray(contents) && contents.length > 0
          ? contents.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / contents.length
          : 0
        
        setMetrics({
          totalViews,
          publishedContent: visibleContents.length,
          averageRating: Math.round(avgRating * 10) / 10
        })
        
        log('info', '📊 Métricas calculadas:', {
          totalViews,
          publishedContent: visibleContents.length,
          averageRating: Math.round(avgRating * 10) / 10
        })
        
      } catch (err) {
        log('warn', '⚠️ Error al obtener contenido del creador:', err)
        // Usar valores por defecto en caso de error
        setMetrics({
          totalViews: 0,
          publishedContent: 0,
          averageRating: 0
        })
        setRecentContent([])
      }

    } catch (err) {
      log('error', 'Error cargando datos del creador:', err)
      setError('Error al cargar la información. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retry = useCallback(() => {
    loadCreatorData()
  }, [loadCreatorData])

  useEffect(() => {
    loadCreatorData()
  }, [loadCreatorData, user])

  return {
    channelData,
    metrics,
    recentContent,
    isLoading,
    error,
    retry
  }
}