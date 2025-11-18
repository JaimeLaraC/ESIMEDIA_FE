import { useState, useEffect } from 'react'
import { log } from '../config/logConfig'
import '../styles/components/ProfileButton.css'
import defaultAvatar from '../assets/profile_images/default.svg'

interface ProfileButtonProps {
  avatarSrc?: string           // URL directa de la imagen
  altText?: string
  onClick?: () => void
  userType?: 'basic' | 'premium' | 'creator' | 'admin'
  ariaLabel?: string
  isExpanded?: boolean
  className?: string
}

export default function ProfileButton({
  avatarSrc,
  altText = 'Avatar de usuario',
  onClick,
  userType = 'basic',
  ariaLabel = 'Menú de usuario',
  isExpanded = false,
  className = '',
}: Readonly<ProfileButtonProps>) {

  // Usa la URL directa o el default
  const imageUrl = avatarSrc || defaultAvatar

  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl)

  useEffect(() => {
    setImageLoaded(false)
    setCurrentSrc(imageUrl)
    log('info', 'ProfileButton -> avatarSrc:', avatarSrc)
  }, [avatarSrc])

  return (
    <button
      className={`profile-button ${userType ? 'profile-button--' + userType : ''} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isExpanded}
      type="button"
    >
      <div className={`profile-button__avatar ${imageLoaded ? 'is-loaded' : ''}`}>
        <img
          src={currentSrc}
          alt={altText}
          className="profile-button__image"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            log('warn', 'ProfileButton: error cargando', currentSrc, '-> fallback default')
            if (currentSrc !== defaultAvatar) {
              setCurrentSrc(defaultAvatar)
              setImageLoaded(false)
            } else {
              setImageLoaded(true)
            }
          }}
        />
      </div>
    </button>
  )
}
