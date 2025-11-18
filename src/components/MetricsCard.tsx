// src/components/MetricsCard.tsx
import { useI18n } from '../hooks/useI18n'
import { formatNumber } from '../utils/creatorUtils'

interface ChannelMetrics {
  totalViews: number
  publishedContent: number
  averageRating: number
}

interface MetricsCardProps {
  readonly metrics: ChannelMetrics
}

export default function MetricsCard({ metrics }: MetricsCardProps) {
  const { t } = useI18n()

  return (
    <div className="card card-lg">
      <div className="metrics-header">
        <h2>{t('creator.metrics.title')}</h2>
        <span className="metrics-period">{t('creator.metrics.period')}</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-icon views">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5Z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">{formatNumber(metrics.totalViews)}</span>
            <span className="metric-label">{t('creator.metrics.views')}</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">{metrics.publishedContent}</span>
            <span className="metric-label">{t('creator.metrics.content')}</span>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon rating">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.46,13.97L5.82,21L12,17.27Z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">{metrics.averageRating}</span>
            <span className="metric-label">{t('creator.metrics.rating')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}