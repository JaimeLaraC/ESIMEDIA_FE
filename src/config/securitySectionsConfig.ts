/**
 * securitySectionsConfig.ts
 * Configuración de secciones de seguridad para ProfilePage
 * Excluido del scanner de SonarQube
 */

export interface SecuritySection {
  readonly key: string
  readonly title: string
  readonly description: string
  readonly buttonText: string
  readonly onClick: () => void
}

/**
 * Genera la configuración de secciones de seguridad
 * @param t - Función de traducción
 * @param handlers - Objeto con manejadores de eventos para cada sección
 * @returns Array de configuraciones de secciones de seguridad
 */
export const getSecuritySections = (
  t: (key: string) => string,
  handlers: {
    onPasswordClick: () => void
    on2FAClick: () => void
    on3FAClick: () => void
  }
): SecuritySection[] => [
  {
    key: 'password',
    title: t('profile.cards.security.changePassword'),
    description: t('profile.cards.security.changePasswordDescription'),
    buttonText: t('profile.cards.security.startChangePasswordProcess'),
    onClick: handlers.onPasswordClick
  },
  {
    key: '2fa',
    title: t('profile.cards.security.twoFactor.title'),
    description: t('profile.cards.security.twoFactor.description'),
    buttonText: t('profile.cards.security.twoFactor.enable'),
    onClick: handlers.on2FAClick
  },
  {
    key: '3fa',
    title: t('profile.cards.security.threeFactor.title'),
    description: t('profile.cards.security.threeFactor.description'),
    buttonText: t('profile.cards.security.threeFactor.enable'),
    onClick: handlers.on3FAClick
  }
]
