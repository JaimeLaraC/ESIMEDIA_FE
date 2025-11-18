// src/components/search/SearchResultsGrid.tsx
import MediaCard from './MediaCard'
import type { SearchResult } from '../services/searchService'
import { CONTENT_API_URL } from '../services/contentListService'
import defaultAudioImage from '../assets/default_audio.png'
import defaultVideoImage from '../assets/default_video.png'

interface SearchResultsGridProps {
  readonly results: SearchResult[]
  readonly isLoading?: boolean
}

export default function SearchResultsGrid({ results, isLoading = false }: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className="search-results-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="skeleton-card">
            <div className="skeleton-thumb"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  // Función para arreglar URL de thumbnail
  const getFullThumbnailUrl = (thumbnail: string | null, kind: 'audio' | 'video'): string => {
    // Si no hay thumbnail o está vacío, usar imagen por defecto local (NO llamar al proxy)
    if (!thumbnail || thumbnail.trim() === '') {
      return kind === 'audio' ? defaultAudioImage : defaultVideoImage
    }
    
    // Si el thumbnail es una ruta relativa (ej: /content/thumbnail/{id})
    if (thumbnail.startsWith('/')) {
      // Transformar a ruta del API Gateway: /api/content/thumbnail/{id}
      const apiPath = thumbnail.startsWith('/content/') ? `/api${thumbnail}` : thumbnail
      return `${CONTENT_API_URL}${apiPath}`
    }
    
    // Si ya es una URL completa, devolver tal cual
    return thumbnail
  }


return (
    <div className="search-results-grid">
      {results.map((result) => (
        <MediaCard 
          key={result.id} 
          item={{
            id: result.id,
            title: result.title,
            thumbnail: getFullThumbnailUrl(result.thumbnail, result.type),
            addedAt: result.addedAt,
            rating: result.rating
          }} 
          kind={result.type}
          isPremium={result.isPremium}
          creator={result.creator}
          rating={result.rating}
          ratingCount={result.ratingCount}
          duration={result.duration}
        />
      ))}
    </div>
)
}