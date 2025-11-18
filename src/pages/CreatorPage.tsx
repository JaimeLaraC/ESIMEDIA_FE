import { useI18n } from '../hooks/useI18n'
import ChannelInfoCard from '../components/ChannelInfoCard'
import MetricsCard from '../components/MetricsCard'
import ContentList from '../components/ContentList'
import UploadButton from '../components/UploadButton'
import LoadingState from '../customcomponents/LoadingState'
import ErrorState from '../customcomponents/ErrorState'
import { useCreatorData } from '../hooks/useCreatorData'
import { useChannelEditing } from '../hooks/useChannelEditing'
import { useContentManagement } from '../hooks/useContentManagement'
import { useNotifications } from '../customcomponents/NotificationProvider'
import '../styles/components/Buttons.css'
import '../styles/pages/CreatorPage.css'
import '../styles/components/Cards.css'

export default function CreatorPage() {
  const { t } = useI18n()
  const { success, error: showError } = useNotifications()

  // Hooks personalizados para manejar la lógica
  const { 
    channelData, 
    metrics, 
    recentContent, 
    isLoading, 
    error, 
    retry
  } = useCreatorData()
  const channelEditing = useChannelEditing(channelData)
  const contentManagement = useContentManagement(recentContent)

  // Manejador para guardar cambios del canal con notificaciones
  const handleSaveChannel = async () => {
    const successResult = await channelEditing.saveChanges()
    if (successResult) {
      success(t('creator.channel.saveSuccess') || 'Cambios guardados exitosamente')
      // Esperar 2 segundos para que el usuario vea el toast antes de recargar
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      showError(t('creator.channel.saveError') || 'Error al guardar los cambios')
    }
  }

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="creator-page">
        <div className="creator-container">
          <LoadingState message={t('creatorPage.loading')} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="creator-page">
        <div className="creator-container">
          <ErrorState message={error} onRetry={retry} />
        </div>
      </div>
    )
  }

  // Si no hay datos, no renderizar nada
  if (!channelData || !metrics) {
    return null
  }

  return (
    <div className="creator-page">
      <div className="creator-container">
        <div className="creator-header">
          <h1>{t('creator.dashboard.title')}</h1>
          <p>{t('creator.dashboard.welcome')}</p>
        </div>

        <div className="creator-top-section">
          <ChannelInfoCard
            channelData={channelData}
            isEditing={channelEditing.isEditing}
            editingData={channelEditing.editingData}
            validationErrors={channelEditing.validationErrors}
            onEdit={channelEditing.startEditing}
            onSave={handleSaveChannel}
            onCancel={channelEditing.cancelEditing}
            onDataChange={channelEditing.updateData}
          />

          <UploadButton channelData={channelData} />
        </div>

        <MetricsCard metrics={metrics} />
        <ContentList
          content={contentManagement.content}
          showVisibilityToggle={true}
        />
      </div>
    </div>
  )
}