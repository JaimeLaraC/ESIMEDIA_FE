import '../styles/components/AvatarSelector.css'
import { resolveAvatarUrl } from '../utils/avatar'

interface AvatarSelectorProps {
  readonly selectedAvatarUrl?: string             // URL de la imagen (ej: '/src/assets/profile_images/Avatar1.png')
  readonly onAvatarSelect: (url: string) => void // Callback con la URL de la imagen
}

const availableAvatars = [
  'Avatar1.png','Avatar2.png','Avatar3.png',
  'Avatar4.png','Avatar5.png','Avatar6.png',
]

function isSelected(selected: string | undefined, file: string) {
  if (!selected) return false
  const url = resolveAvatarUrl(file)
  return selected === url || selected?.endsWith(`/${file}`)
}

/**
 * Componente para seleccionar una imagen de perfil
 * Envía URLs resueltas (ej: '/src/assets/profile_images/Avatar1.png') en lugar de nombres
 */
export default function AvatarSelector({ selectedAvatarUrl, onAvatarSelect }: AvatarSelectorProps) {
  return (
    <div className="avatar-selector">
      <div className="avatar-grid">
        {availableAvatars.map((file) => {
          const url = resolveAvatarUrl(file)! // URL resuelta por Vite
          const isSelectedAvatar = isSelected(selectedAvatarUrl, file)

          return (
            <button
              key={file}
              type="button"
              className={`avatar-option ${isSelectedAvatar ? 'selected' : ''}`}
              onClick={() => {
                // Enviar URL resuelta directamente - no guardar en localStorage
                onAvatarSelect(url)
              }}
              title={`Select ${file}`}
              aria-pressed={isSelectedAvatar}
              aria-label={`Select ${file}`}
            >
              <img
                src={url}
                alt={`Avatar ${file}`}
                className="avatar-img"
                loading="lazy"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
