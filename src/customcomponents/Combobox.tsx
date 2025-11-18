// src/customcomponents/Combobox.tsx
import { useEffect, useState } from 'react'
import { useComboboxPositioning } from '../hooks/useComboboxPositioning'
import '../styles/components/Combobox.css'

export interface ComboboxOption {
  readonly value: string
  readonly label: string
  readonly disabled?: boolean
}

interface ComboboxProps {
  readonly label?: string
  readonly value: string
  readonly options: ComboboxOption[]
  readonly onChange: (value: string) => void
  readonly placeholder?: string
  readonly error?: string
  readonly required?: boolean
  readonly disabled?: boolean
  readonly className?: string
}

export default function Combobox({
  label,
  value,
  options,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  required = false,
  disabled = false,
  className = ''
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const { containerRef, checkSpaceAndPosition, getContainerClassName, getMenuClassName } = useComboboxPositioning()

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
  }, [containerRef])

  const toggleOpen = () => {
    if (disabled) return
    if (!open) {
      checkSpaceAndPosition()
    }
    setOpen((s) => !s)
  }

  const selectOption = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && !open) {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleOpen()
    }
  }

  return (
    <div className={`combobox-wrapper ${className}`}>
      {label && (
        <label className="combobox-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div
        className={getContainerClassName()}
        ref={containerRef}
      >
        <button
          type="button"
          className={`combobox-button ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        >
          <span className="combobox-selected-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`combobox-dropdown-icon ${open ? 'open' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {open && (
          <div
            className={getMenuClassName()}
            role="listbox"
            tabIndex={-1}
          >
            {options.map((option) => (
              <div key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className={`combobox-item ${value === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                  onClick={() => !option.disabled && selectOption(option.value)}
                  disabled={option.disabled}
                >
                  <span className="combobox-item-text">{option.label}</span>
                  {value === option.value && (
                    <span className="combobox-check" aria-hidden>✓</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}