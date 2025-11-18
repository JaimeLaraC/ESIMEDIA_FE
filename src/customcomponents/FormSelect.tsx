import { useEffect, useState, useRef } from 'react'
import '../styles/components/Combobox.css'

interface FormSelectOption {
  readonly value: string
  readonly label: string
  readonly icon?: string
}

interface FormSelectProps {
  readonly id?: string
  readonly name?: string
  readonly value: string
  readonly options: FormSelectOption[]
  readonly placeholder?: string
  readonly onChange: (value: string) => void
  readonly className?: string
  readonly disabled?: boolean
}

export default function FormSelect({
  id,
  name,
  value,
  options,
  placeholder = 'Seleccionar...',
  onChange,
  className = '',
  disabled = false
}: FormSelectProps) {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const calculateDropdownPosition = () => {
    if (!containerRef.current) return {}

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 280 // max-height del menú

    // Calcular si hay espacio suficiente abajo
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    let top = rect.bottom + 4 // Por defecto abajo
    let left = rect.left
    let width = rect.width

    // Si no hay suficiente espacio abajo, abrir hacia arriba
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - 4
    }

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      zIndex: 1000
    }
  }

  const toggleOpen = () => {
    if (disabled) return
    if (!open) {
      setDropdownStyle(calculateDropdownPosition())
    }
    setOpen((s) => !s)
  }

  const selectOption = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleOpen()
    }
  }

  return (
    <div className={`combobox-container-full ${className}`} ref={containerRef}>
      <button
        type="button"
        id={id}
        name={name}
        className="combobox-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span className="combobox-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className="combobox-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="combobox-menu"
          style={dropdownStyle}
          role="menu"
          tabIndex={0}
        >
          {options.map((option) => (
            <div
              key={option.value}
              id={`${id}-option-${option.value}`}
            >
              <button
                type="button"
                role="menuitemradio"
                aria-checked={value === option.value}
                className={`combobox-item ${value === option.value ? 'selected' : ''}`}
                onClick={() => selectOption(option.value)}
              >
                <span className="combobox-text">{option.label}</span>
                {value === option.value && <span className="combobox-check">✓</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}