// src/components/ContentList.tsx
import { useI18n } from '../hooks/useI18n'
import ContentItem from './ContentItem'

interface Content {
  id: string
  title: string
  thumbnail: string
  views: number
  duration: string
  publishedAt: string
  rating: number
  isVisible: boolean
  isPremium: boolean
}

interface ContentListProps {
  readonly content: Content[]
  readonly showVisibilityToggle?: boolean
}

export default function ContentList({ 
  content,
  showVisibilityToggle = false
}: ContentListProps) {
  const { t } = useI18n()

  return (
    <div className="card card-lg">
      <div className="content-header">
        <h2>{t('creator.content.recent.title')}</h2>
        {content.length > 0 && (
          <button className="btn btn-secondary btn-sm">
            {t('creator.content.recent.viewAll')}
          </button>
        )}
      </div>

      <div className="content-list">
        {content.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-secondary)'
          }}>
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              style={{ margin: '0 auto 1rem', opacity: 0.5 }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              Aún no has publicado contenido
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Sube tu primer video o audio para empezar a construir tu canal
            </p>
          </div>
        ) : (
          content.map((item) => (
            <ContentItem
              key={item.id}
              content={item}
              showVisibilityToggle={showVisibilityToggle}
            />
          ))
        )}
      </div>
    </div>
  )
}