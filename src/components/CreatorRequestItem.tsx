// src/components/CreatorRequestItem.tsx
import { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import type { CreatorRequest } from '../services/adminService'

interface CreatorRequestItemProps {
  readonly request: CreatorRequest
  readonly onApprove: (id: string) => void
  readonly onReject: (id: string) => void
}

export default function CreatorRequestItem({
  request,
  onApprove,
  onReject
}: CreatorRequestItemProps) {
  const { t } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const [processing, setProcessing] = useState(false)

  const normalizedStatus = request.status?.toLowerCase() ?? 'pending'
  const isPending =
    normalizedStatus.includes('pending') || normalizedStatus.includes('active')

  const normalizeSpecialty = (specialty: string): string => {
    if (!specialty) return 'undefined'
    
    // Normalizar a lowercase y quitar acentos/caracteres especiales
    return specialty
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]/g, '') // Solo letras y números
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('approved')) return 'status-approved'
    if (s.includes('rejected')) return 'status-rejected'
    return 'status-pending'
  }

  const handleApproveClick = async () => {
    setProcessing(true)
    onApprove(request.id)
    setProcessing(false)
  }

  const handleRejectClick = async () => {
    setProcessing(true)
    onReject(request.id)
    setProcessing(false)
  }

  return (
    <div className="content-list-item">
      <div className="request-info">
        <div className="request-header">
          <h4 className="request-user">
            {isExpanded ? `${request.firstName} ${request.lastName}` : request.userName}
          </h4>
          <button
            className="btn-collapse"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? t('admin.requests.collapse') : t('admin.requests.expand')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            >
              <path d="M7,10L12,15L17,10H7Z" />
            </svg>
          </button>
        </div>

        <div className="request-metadata">
          <span className="request-email">{request.email}</span>
          <span className={`request-status ${getStatusColor(request.status)}`}>
            {t(`admin.requests.status.${normalizedStatus}`)}
          </span>
        </div>

        {isExpanded && (
          <div className="request-expanded-content">
            <div className="request-details-grid">
              <div className="request-detail">
                <label>{t('creator.form.fields.alias')}</label>
                <span>{request.channelAlias}</span>
              </div>
              <div className="request-detail">
                <label>{t('creator.form.fields.channelDescription')}</label>
                <span>{request.channelDescription}</span>
              </div>
              <div className="request-detail">
                <label>{t('creator.form.fields.contentType')}</label>
                <span>{request.contentType ? t(`creator.channel.contentTypes.${request.contentType.toLowerCase()}`) : t('common.notSpecified')}</span>
              </div>
              <div className="request-detail">
                <label>{t('creator.form.fields.specialty')}</label>
                <span>{request.specialty ? t(`creator.channel.specialties.${normalizeSpecialty(request.specialty)}`) : t('common.notSpecified')}</span>
              </div>
            </div>

            <div className="request-profile-image">
              <img
                src={request.profileImage}
                alt={t('creator.form.photo.placeholder')}
                className="profile-image-preview"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botones visibles solo si está pendiente */}
      {isExpanded && isPending && (
        <div className="content-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={processing}
            onClick={handleApproveClick}
          >
            {processing ? t('common.loading') : t('admin.requests.approve')}
          </button>
          <button
            className="btn btn-cancel btn-sm"
            disabled={processing}
            onClick={handleRejectClick}
          >
            {processing ? t('common.loading') : t('admin.requests.reject')}
          </button>
        </div>
      )}
    </div>
  )
}
