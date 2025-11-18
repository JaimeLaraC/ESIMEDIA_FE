import { useI18n } from '../hooks/useI18n'

interface SearchPaginationProps {
  readonly currentPage: number
  readonly totalPages: number
  readonly onPageChange: (page: number) => void
}

export default function SearchPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: SearchPaginationProps) {
  const { t } = useI18n()

  if (totalPages <= 1) {
    return null
  }

  let ellipsisKey = 0

  const getPageNumbers = (): (number | string)[] => {
    const maxVisibleNumbers = 8 // Máximo 8 números en las columnas centrales

    if (totalPages <= maxVisibleNumbers) {
      // Mostrar todas las páginas si caben en los espacios disponibles
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Si estamos en la última página o quedan menos de 6 páginas para la última,
    // mostrar patrón con elipsis entre 1 y las páginas cercanas al final
    if (currentPage === totalPages || currentPage >= totalPages - 5) {
      const pages: (number | string)[] = [1, '...'] // 1 con elipsis
      
      // Calcular qué páginas mostrar después del elipsis
      const remainingSlots = maxVisibleNumbers - 2 // 2 slots usados por 1 y ...
      const startPage = Math.max(2, totalPages - remainingSlots + 1)
      
      for (let i = startPage; i <= totalPages; i++) {
        pages.push(i)
      }
      
      return pages
    }

    // Si hay más páginas, mostrar patrón específico con elipsis
    const pages: (number | string)[] = [1] // Primera página siempre visible

    if (currentPage <= 4) {
      // Cerca del inicio: páginas 2-6
      const middlePages = Array.from({ length: Math.min(5, totalPages - 2) }, (_, i) => i + 2)
      pages.push(...middlePages)
    } else {
      // En el medio: centrar la página actual
      const start = currentPage - 2
      const end = currentPage + 2
      const middlePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
      pages.push(...middlePages)
    }

    // Siempre añadir "..." en la antepenúltima posición y la última página
    pages.push('...', totalPages)

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav 
      className="search-pagination" 
      aria-label={t('search.pagination.label') || 'Paginación'}
    >
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label={t('search.pagination.previous') || 'Página anterior'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
        {t('search.pagination.previous') || 'Anterior'}
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page) => {
          if (page === '...') {
            ellipsisKey++
            return (
              <button
                key={`ellipsis-${ellipsisKey}`}
                className="pagination-ellipsis"
                disabled
                aria-label="Más páginas"
              >
                ...
              </button>
            )
          }

          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page as number)}
              aria-label={`${t('search.pagination.page') || 'Página'} ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label={t('search.pagination.next') || 'Página siguiente'}
      >
        {t('search.pagination.next') || 'Siguiente'}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </button>
    </nav>
  )
}