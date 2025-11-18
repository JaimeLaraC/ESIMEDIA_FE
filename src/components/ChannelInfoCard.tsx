// src/components/ChannelInfoCard.tsx
import { useI18n } from '../hooks/useI18n'
import Textbox from '../customcomponents/Textbox'
import FormSelect from '../customcomponents/FormSelect'
import { log } from '../config/logConfig'

import defaultAvatar from '../assets/profile_images/default.svg'
import { resolveAvatarUrl } from '../utils/avatar'

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

interface ChannelInfoCardProps {
  readonly channelData: CreatorChannel
  readonly isEditing: boolean
  readonly editingData: { description: string; specialty: string } | null
  readonly validationErrors: { description?: string; specialty?: string }
  readonly onEdit: () => void
  readonly onSave: () => void
  readonly onCancel: () => void
  readonly onDataChange: (data: { description: string; specialty: string }) => void
}

// Detecta si ya es una URL o una ruta servida por Vite/dev:
// http(s)://...,  /src/assets/...,  /assets/...,  blob:, data:
function isUrlOrBundled(path?: string) {
  if (!path) return false
  return /^https?:\/\//i.test(path) || /^(\/(src\/)?assets\/|blob:|data:)/i.test(path)
}

export default function ChannelInfoCard({
  channelData,
  isEditing,
  editingData,
  validationErrors,
  onEdit,
  onSave,
  onCancel,
  onDataChange
}: ChannelInfoCardProps) {
  const { t, translations } = useI18n()
  
  log('debug', 'ChannelInfoCard - contentType:', channelData.contentType)

  // === Lógica del avatar (idéntica a lo que ya te funciona) ===
  const lsUrl  = (typeof window !== 'undefined') ? localStorage.getItem('selectedAvatarUrl') || undefined : undefined
  const lsName = (typeof window !== 'undefined') ? localStorage.getItem('selectedAvatar')    || undefined : undefined

  // Prioridad: lo elegido por el usuario → dato del canal
  const rawCandidate =
    lsUrl ||
    lsName ||
    (channelData?.profileImage && channelData.profileImage !== 'default.svg' ? channelData.profileImage : undefined)

  const channelAvatarUrl =
    !rawCandidate
      ? defaultAvatar
      : isUrlOrBundled(rawCandidate)
        ? rawCandidate               // ya es URL o ruta servida (/src/assets o /assets)
        : resolveAvatarUrl(rawCandidate) || defaultAvatar

  // Opciones de especialidad
  const specialtyKeys = Object.keys(translations.creator?.channel?.specialties || {})
  const specialtyOptions = [
    { value: '', label: t('creator.form.fields.specialty') },
    ...specialtyKeys.map(specialty => ({
      value: specialty,
      label: t(`creator.channel.specialties.${specialty}`)
    }))
  ]

  const translateSpecialty = (specialtyKey: string) => {
    if (!specialtyKey) return t('creator.form.fields.specialty')
    return t(`creator.channel.specialties.${specialtyKey}`)
  }

  return (
    <div className="card card-lg">
      <div className="channel-header">
        <h2>{t('creator.channel.info.title')}</h2>
        {!isEditing ? (
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>
            {t('creator.channel.info.edit')}
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn btn-primary btn-sm" onClick={onSave}>
              {t('creator.channel.info.save')}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onCancel}>
              {t('creator.channel.info.cancel')}
            </button>
          </div>
        )}
      </div>

      <div className="channel-content">
        <div className="channel-avatar">
          {/* 👉 ahora usa la URL resuelta y válida en todos los casos */}
          <img src={channelAvatarUrl} alt="Avatar del canal" />
        </div>

        <div className="channel-details">
          <h3 className="channel-name-readonly">{channelData.name}</h3>

          {isEditing && editingData ? (
            <div className="channel-edit-form">
              <div className="form-group">
                <Textbox
                  as="textarea"
                  label={t('creator.channel.description')}
                  value={editingData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onDataChange({ ...editingData, description: e.target.value })
                  }
                  placeholder={t('creator.channel.descriptionPlaceholder')}
                  rows={3}
                  error={validationErrors.description}
                />
              </div>

              <div className="form-group">
                <FormSelect
                  value={editingData.specialty}
                  options={specialtyOptions}
                  onChange={(value) => onDataChange({ ...editingData, specialty: value })}
                />
                {validationErrors.specialty && (
                  <div className="textbox-hint textbox-hint-error" style={{ marginTop: '4px' }}>
                    {validationErrors.specialty}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <p className="channel-description">{channelData.description}</p>
              <div className="channel-stats">
                <span className="content-type">
                  {t('creator.channel.contentType')}: {channelData.contentType}
                </span>
                <span className="specialty">
                  {t('creator.channel.specialty')}: {translateSpecialty(channelData.specialty)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
