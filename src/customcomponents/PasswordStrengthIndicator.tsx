import { useI18n } from '../hooks/useI18n'
import { PasswordHints } from '../components/PasswordHints'

interface PasswordStrengthIndicatorProps {
  strength: { score: number; feedback: { suggestions: string[]; warning: string } } | null
  password?: string
  showHints?: boolean
  personalData?: {
    firstName?: string
    lastName?: string
    alias?: string
    birthDate?: string
  }
  t?: (key: string) => string // Optional custom translation function
}

// Componente helper para mostrar fortaleza de contraseña
export const PasswordStrengthIndicator = ({
  strength,
  password = '',
  showHints = false,
  personalData,
  t: customT
}: PasswordStrengthIndicatorProps) => {
  const { t: defaultT } = useI18n()
  const t = customT || defaultT

  if (!strength) return null

  const strengthLabels = {
    0: t('profile.cards.security.passwordStrength.veryWeak'),
    1: t('profile.cards.security.passwordStrength.weak'),
    2: t('profile.cards.security.passwordStrength.fair'),
    3: t('profile.cards.security.passwordStrength.good'),
    4: t('profile.cards.security.passwordStrength.strong')
  }

  return (
    <div className="password-strength-indicator">
      <div className="strength-meter">
        <div
          className={`strength-bar strength-${strength.score}`}
          style={{ width: `${(strength.score + 1) * 20}%` }}
        />
      </div>
      <div className="strength-text">
        {strengthLabels[strength.score as keyof typeof strengthLabels]}
      </div>
      <PasswordHints
        password={password}
        showHints={showHints}
        personalData={personalData}
      />
    </div>
  )
}