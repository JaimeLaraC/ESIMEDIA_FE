import { useNavigate } from 'react-router-dom'
import { useI18n } from '../hooks/useI18n'
import { useApp } from '../context/AppContextHooks'

interface UserMenuItemsProps {
  onLogout: () => void
  onCloseMenu?: () => void
  showPremiumUpgrade?: boolean
  extraItems?: React.ReactNode // Elementos adicionales antes del logout
}

/**
 * Componente compartido que renderiza los elementos del menú de usuario.
 * 
 * Incluye:
 * - Enlace a perfil
 * - Upgrade a Premium (opcional, solo para usuarios básicos)
 * - Cerrar sesión
 * 
 * @param onLogout - Función a llamar al hacer logout
 * @param onCloseMenu - Función opcional para cerrar el menú después de cada acción
 * @param showPremiumUpgrade - Si se debe mostrar el botón de upgrade a premium (solo para usuarios básicos)
 */
export default function UserMenuItems({ 
  onLogout, 
  onCloseMenu,
  showPremiumUpgrade = false,
  extraItems 
}: Readonly<UserMenuItemsProps>) {
  const { t } = useI18n()
  const { user } = useApp()
  const navigate = useNavigate()
  
  const handleProfileClick = () => {
    navigate(`/profile/${user?.id}`)
    onCloseMenu?.()
  }
  
  const handlePremiumClick = () => {
    navigate(`/profile/${user?.id}`)
    onCloseMenu?.()
  }
  
  return (
    <>
      <button onClick={handleProfileClick}>
        {t('header.userMenu.profile')}
      </button>
      {showPremiumUpgrade && (
        <button onClick={handlePremiumClick} className="premium-upgrade-button">
          {t('header.premium.upgrade')}
        </button>
      )}
      {extraItems}
      <hr />
      <button onClick={onLogout}>
        {t('header.userMenu.logout')}
      </button>
    </>
  )
}
