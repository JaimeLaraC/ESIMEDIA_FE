import { type ReactNode } from 'react'
import '../styles/customcomponents/ScrollbarStyles.css'

interface ScrollableContainerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly maxHeight?: string
  readonly style?: React.CSSProperties
}

/**
 * ScrollableContainer - Componente reutilizable para contenedores con scroll discreto
 *
 * Proporciona una barra de scroll personalizada con estilo de la aplicación:
 * - Ancho de 8px (6px en móviles)
 * - Color del thumb: var(--accent-2)
 * - Color del track: var(--panel-2)
 * - Efectos hover suaves
 * - Compatible con Firefox (scrollbar-width: thin)
 *
 * Uso:
 * ```tsx
 * <ScrollableContainer maxHeight="400px">
 *   <div>Contenido largo que necesita scroll...</div>
 * </ScrollableContainer>
 * ```
 *
 * @param children - Contenido del contenedor
 * @param className - Clases CSS adicionales
 * @param maxHeight - Altura máxima del contenedor (por defecto: '100%')
 * @param style - Estilos inline adicionales
 */
export default function ScrollableContainer({
  children,
  className = '',
  maxHeight = '100%',
  style = {}
}: ScrollableContainerProps) {
  const containerStyle: React.CSSProperties = {
    maxHeight,
    overflowY: 'auto',
    ...style
  }

  return (
    <div
      className={`scrollable-container ${className}`}
      style={containerStyle}
    >
      {children}
    </div>
  )
}