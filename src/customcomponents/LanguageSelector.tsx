import { useEffect, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { useComboboxPositioning } from '../hooks/useComboboxPositioning'
import '../styles/components/Combobox.css'

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, availableLanguages, isLoading } = useI18n()
  const [open, setOpen] = useState(false)
  const { containerRef, checkSpaceAndPosition, getContainerClassName, getMenuClassName } = useComboboxPositioning()

  // Mapeo de idiomas a códigos de flag-icons
  const languageFlags: Record<string, string> = {
    es: 'fi fi-es',
    en: 'fi fi-gb',
    fr: 'fi fi-fr',
    de: 'fi fi-de',
    it: 'fi fi-it'
  }

  const currentFlag = languageFlags[currentLanguage] || 'fi fi-es'

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
    if (isLoading) return
    if (!open) {
      checkSpaceAndPosition()
    }
    setOpen((s) => !s)
  }

  const selectLanguage = (code: string) => {
    const lang = availableLanguages.find(l => l.code === code)
    if (lang) {
      changeLanguage(lang)
      setOpen(false)
    }
  }

  return (
    <div className={getContainerClassName()} ref={containerRef}>
      <button
        type="button"
        className="combobox-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        disabled={isLoading}
      >
        <span className={`combobox-flag ${currentFlag}`}></span>
        <svg className="combobox-dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isLoading && (
        <div className="combobox-loading">
          <span className="loading-spinner">⏳</span>
        </div>
      )}

      {open && (
        <div
          className={getMenuClassName()}
          role="menu"
          tabIndex={0}
        >
          {availableLanguages.map((lang) => (
            <div
              key={lang.code}
              id={`lang-${lang.code}`}
            >
              <button
                type="button"
                role="menuitemradio"
                aria-checked={currentLanguage === lang.code}
                className={`combobox-item ${currentLanguage === lang.code ? 'selected' : ''}`}
                onClick={() => selectLanguage(lang.code)}
              >
                <span className={`combobox-flag ${languageFlags[lang.code] ?? 'fi fi-unk'}`}></span>
                <span className="combobox-name">{lang.name}</span>
                {currentLanguage === lang.code && <span className="combobox-check">✓</span>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
