// src/hooks/useCreatorRequests.ts
import { useEffect, useState, useCallback } from 'react'
import {
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
  type CreatorRequest
} from '../services/adminService'
import defaultAvatar from '../assets/profile_images/default.svg'

/**
 * Mapea el estado del backend a los valores esperados por el front
 */
const normalizeStatus = (status: string): 'pending' | 'approved' | 'rejected' => {
  if (!status) return 'pending'

  const normalized = status.toLowerCase()
  if (normalized.includes('approved')) return 'approved'
  if (normalized.includes('rejected')) return 'rejected'
  return 'pending'
}

export function useCreatorRequests() {
  const [requests, setRequests] = useState<CreatorRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchPendingRequests()

      // El backend ahora devuelve CreatorRequestDTO directamente, sin necesidad de mapeo
      // Los campos ya vienen normalizados y la imagen resuelta
      const normalized = data.map((request: CreatorRequest) => ({
        id: request.id,
        userName: request.userName,
        email: request.email,
        submittedAt: request.submittedAt,
        status: request.status as 'pending' | 'approved' | 'rejected',
        firstName: request.firstName,
        lastName: request.lastName,
        channelAlias: request.channelAlias,
        channelDescription: request.channelDescription,
        contentType: request.contentType,
        specialty: request.specialty,
        profileImage: request.profileImage || defaultAvatar
      }))

      setRequests(normalized)
    } catch (err) {
      console.error('Error al cargar solicitudes:', err)
      setError('Error al cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id)
      // Actualiza visualmente el estado
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'approved' } : r
        )
      )
    } catch (err) {
      console.error('Error al aprobar solicitud:', err)
      setError('Error al aprobar la solicitud.')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id)
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'rejected' } : r
        )
      )
    } catch (err) {
      console.error('Error al rechazar solicitud:', err)
      setError('Error al rechazar la solicitud.')
    }
  }

  const retry = () => loadRequests()

  return { requests, loading, error, handleApprove, handleReject, retry }
}
