import { useEffect } from 'react'

/**
 * Hook to scroll to the top of the page when the component mounts
 * Useful for ensuring pages open at the top scroll position
 */
export function useScrollToTop() {
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [])
}