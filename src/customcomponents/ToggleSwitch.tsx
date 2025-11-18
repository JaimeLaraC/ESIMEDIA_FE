// src/customcomponents/ToggleSwitch.tsx

interface ToggleSwitchProps {
  readonly label: string
  readonly leftLabel: string
  readonly rightLabel: string
  readonly isActive: boolean
  readonly onToggle: (active: boolean) => void
  readonly rightLabelPremium?: boolean
  readonly disabled?: boolean
  readonly className?: string
}

export default function ToggleSwitch({
  label,
  leftLabel,
  rightLabel,
  isActive,
  onToggle,
  rightLabelPremium = false,
  disabled = false,
  className = ''
}: ToggleSwitchProps) {
  const handleLeftClick = () => {
    if (!disabled) {
      onToggle(false)
    }
  }

  const handleRightClick = () => {
    if (!disabled) {
      onToggle(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, isRight: boolean) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(isRight)
    }
  }

  return (
    <div className={`toggle-group ${className}`}>
      <label className="toggle-label">
        {label}
      </label>
      <div className="toggle-switch-container">
        <button
          type="button"
          className={`toggle-option-button ${isActive ? '' : 'active'} ${disabled ? 'disabled' : ''}`}
          onClick={handleLeftClick}
          onKeyDown={(e) => handleKeyDown(e, false)}
          disabled={disabled}
          aria-pressed={!isActive}
        >
          <span className="toggle-option-text">
            {leftLabel}
          </span>
        </button>

        <div className={`toggle-slider ${isActive ? 'active' : ''} ${rightLabelPremium && isActive ? 'premium' : ''} ${disabled ? 'disabled' : ''}`}>
          <div className="toggle-indicator"></div>
        </div>

        <button
          type="button"
          className={`toggle-option-button ${isActive ? 'active' : ''} ${rightLabelPremium && isActive ? 'premium' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleRightClick}
          onKeyDown={(e) => handleKeyDown(e, true)}
          disabled={disabled}
          aria-pressed={isActive}
        >
          <span className="toggle-option-text">
            {rightLabel}
          </span>
        </button>
      </div>
    </div>
  )
}