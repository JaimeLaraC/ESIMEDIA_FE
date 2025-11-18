import { type ReactNode } from 'react'
import { useI18n } from '../hooks/useI18n'
import defaultAvatar from '../assets/profile_images/default.svg'

interface UserDropdownProps {
  readonly userType: 'admin' | 'creator' | 'basic' | 'premium'
  readonly username: string
  readonly avatarSrc?: string  // URL directa de la imagen
  readonly menuItems: ReactNode
  readonly isOpen: boolean
  readonly dropdownRef: React.RefObject<HTMLDivElement | null>
}

export default function UserDropdown({
  userType,
  username,
  avatarSrc,
  menuItems,
  isOpen,
  dropdownRef
}: UserDropdownProps) {
  const { t } = useI18n()

  // Usa la URL directa o el default
  const imageUrl = avatarSrc || defaultAvatar

  const getUserTypeDisplay = () => {
    switch (userType) {
      case 'admin':
        return `⚙️ ${t('header.userTypes.admin')}`
      case 'creator':
        return `🎬 ${t('header.userTypes.creator')}`
      case 'premium':
        return `✨ ${t('header.userTypes.premium')}`
      default:
        return t('header.userTypes.basic')
    }
  }

  const getAvatarClass = () => {
    return userType === 'premium'
      ? 'user-avatar-large premium'
      : 'user-avatar-large'
  }

  const getDropdownClass = () => {
    return userType === 'premium'
      ? 'user-dropdown premium'
      : 'user-dropdown'
  }

  if (!isOpen) return null

  return (
    <div className={getDropdownClass()} ref={dropdownRef}>
      <div className="user-info">
        <div className={getAvatarClass()}>
          <img src={imageUrl} alt="Profile" />
        </div>
        <div className="user-details">
          <span className="username">{username}</span>
          <span className={`user-type ${userType}`}>
            {getUserTypeDisplay()}
          </span>
        </div>
      </div>

      <nav className="user-menu-nav">{menuItems}</nav>
    </div>
  )
}
