import { useI18n } from '../hooks/useI18n'
import CreatorRequestItem from './CreatorRequestItem'
import type { CreatorRequest } from '../services/adminService'

interface CreatorRequestsListProps {
  readonly requests: CreatorRequest[]
  readonly onApprove: (id: string) => void
  readonly onReject: (id: string) => void
}

export default function CreatorRequestsList({
  requests,
  onApprove,
  onReject
}: CreatorRequestsListProps) {
  const { t } = useI18n()

  return (
    <div className="card card-lg">
      <div className="content-header">
        <h2>{t('admin.requests.title')}</h2>
      </div>

      <div className="requests-scroll-container">
        <div className="content-list">
          {requests.length === 0 ? (
            <p className="no-data">{t('admin.requests.empty')}</p>
          ) : (
            requests.map((request) => (
              <CreatorRequestItem
                key={request.id}
                request={request}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
