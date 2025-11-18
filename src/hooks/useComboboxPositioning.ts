import { useState, useRef } from 'react'

export interface ComboboxPositioningState {
  shouldOpenUp: boolean
  menuAlignment: 'left' | 'right'
}

export function useComboboxPositioning() {
  const [shouldOpenUp, setShouldOpenUp] = useState(false)
  const [menuAlignment, setMenuAlignment] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement | null>(null)

  const checkSpaceAndPosition = () => {
    if (!containerRef.current) return

    // Función helper para verificar si algún ancestro tiene position fixed o absolute
    const hasFixedOrAbsoluteAncestor = (element: HTMLElement): boolean => {
      let current = element.parentElement
      while (current) {
        const position = window.getComputedStyle(current).position
        if (position === 'fixed' || position === 'absolute') {
          return true
        }
        current = current.parentElement
      }
      return false
    }

    const computedStyle = window.getComputedStyle(containerRef.current)
    const position = computedStyle.position

    // Determinar alineación horizontal del menú
    const rect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const buttonCenter = rect.left + (rect.width / 2)
    const isLeftHalf = buttonCenter < viewportWidth / 2
    setMenuAlignment(isLeftHalf ? 'left' : 'right')

    // Si el botón NO es flotante (position: static, relative) Y ningún ancestro es flotante, abrir hacia abajo por defecto
    const isFloating = position === 'fixed' || position === 'absolute' || hasFixedOrAbsoluteAncestor(containerRef.current)
    if (!isFloating) {
      setShouldOpenUp(false)
      return
    }

    // Para elementos flotantes, aplicar lógica inteligente con márgenes de seguridad
    const viewportHeight = window.innerHeight
    const menuHeight = 280 // max-height del menú
    const safetyMargin = viewportHeight * 0.05 // margen de seguridad del 5% del viewport
    const minSpaceNeeded = menuHeight + safetyMargin // espacio mínimo necesario

    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    // Para elementos flotantes, ser más conservador:
    // - Si hay menos espacio del necesario abajo, ir hacia arriba
    // - Si el espacio de arriba es significativamente mejor, preferir arriba
    // - Si está muy cerca del borde inferior (menos de 80px), forzar apertura hacia arriba
    const isNearBottom = rect.bottom > viewportHeight - 80
    const hasEnoughSpaceBelow = spaceBelow >= minSpaceNeeded
    const hasEnoughSpaceAbove = spaceAbove >= minSpaceNeeded
    const aboveIsBetter = spaceAbove > spaceBelow * 1.2 // arriba tiene al menos 20% más espacio

    // Abrir hacia arriba si:
    // 1. No hay suficiente espacio abajo, o
    // 2. Está muy cerca del borde inferior, o
    // 3. Arriba tiene significativamente más espacio
    setShouldOpenUp(!hasEnoughSpaceBelow || isNearBottom || (hasEnoughSpaceAbove && aboveIsBetter))
  }

  const getContainerClassName = (baseClassName: string = '') => {
    return `combobox-container ${shouldOpenUp ? 'combobox-float' : ''} ${baseClassName}`.trim()
  }

  const getMenuClassName = () => {
    return `combobox-menu combobox-menu-${menuAlignment}`
  }

  return {
    shouldOpenUp,
    menuAlignment,
    containerRef,
    checkSpaceAndPosition,
    getContainerClassName,
    getMenuClassName
  }
}