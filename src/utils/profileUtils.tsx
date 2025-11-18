import { useI18n } from '../hooks/useI18n'

// Componente helper para mostrar fortaleza de contraseña
export const PasswordStrengthIndicator = ({
  strength
}: {
  strength: { score: number; feedback: { suggestions: string[]; warning: string } } | null
}) => {
  const { t } = useI18n()

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
    </div>
  )
}