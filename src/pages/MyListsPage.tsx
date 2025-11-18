import { useState, useEffect } from 'react'
import { ContentListService, type ContentListResponse } from '../services/contentListService'
import { log } from '../config/logConfig'
import { useApp } from '../context/AppContextHooks'
import MyListsSection from '../components/MyListsSection'
import PublicListsSection from '../components/PublicListsSection'
import PremiumAd from '../customcomponents/PremiumAd'
import '../styles/pages/MyListsPage.css'

/**
 * Página principal de listas de contenido del usuario.
 *
 * Esta página muestra las listas de contenido del usuario organizadas en dos secciones:
 * - Listas personales del usuario (privadas)
 * - Listas públicas creadas por otros usuarios
 *
 * Incluye funcionalidad de click-to-play, gestión de listas personales (editar/eliminar),
 * y publicidad condicional para usuarios no premium.
 *
 * @component
 * @example
 * ```tsx
 * <MyListsPage />
 * ```
 */
export default function MyListsPage() {
  const { subscription } = useApp()
  const [myLists, setMyLists] = useState<ContentListResponse[]>([])
  const [publicLists, setPublicLists] = useState<ContentListResponse[]>([])
  const [loadingMyLists, setLoadingMyLists] = useState(true)
  const [loadingPublicLists, setLoadingPublicLists] = useState(true)

  useEffect(() => {
    loadMyLists()
    loadPublicLists()
  }, [])

  /**
   * Carga las listas personales del usuario desde la API.
   * Maneja errores silenciosamente para no molestar a usuarios sin listas.
   *
   * @async
   * @private
   */
  const loadMyLists = async () => {
    try {
      setLoadingMyLists(true)
      const data = await ContentListService.getMyContentLists()
      setMyLists(data)
      log('info', `Loaded ${data.length} personal lists`)
    } catch (error) {
      log('error', 'Error loading personal lists:', error)
      // No mostrar notificación de error para listas privadas
    } finally {
      setLoadingMyLists(false)
    }
  }

  /**
   * Carga las listas públicas desde la API.
   * Maneja errores silenciosamente para mantener la UX fluida.
   *
   * @async
   * @private
   */
  const loadPublicLists = async () => {
    try {
      setLoadingPublicLists(true)
      const data = await ContentListService.getPublicContentLists()
      setPublicLists(data)
      log('info', `Loaded ${data.length} public lists`)
    } catch (error) {
      log('error', 'Error loading public lists:', error)
      // No mostrar notificación de error para listas públicas
    } finally {
      setLoadingPublicLists(false)
    }
  }

  /**
   * Maneja la eliminación de una lista personal.
   * Recarga las listas personales para reflejar los cambios.
   *
   * @private
   */
  const handleListDeleted = () => {
    loadMyLists() // Recargar listas personales
  }

  return (
    <div className="my-lists-page">
      <div className="my-lists-page-content">
        {/* Mis Listas */}
        <div className="my-lists-section-wrapper">
          <MyListsSection
            lists={myLists}
            onListDeleted={handleListDeleted}
            loading={loadingMyLists}
          />

          {/* Publicidad para usuarios no premium */}
          {!subscription.isPremium && (
            <div className="my-lists-ad-container">
              <PremiumAd />
            </div>
          )}
        </div>

        {/* Listas Públicas */}
        <div className="public-lists-section-wrapper">
          <PublicListsSection
            lists={publicLists}
            loading={loadingPublicLists}
          />
        </div>
      </div>
    </div>
  )
}
