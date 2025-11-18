import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, validateResetToken } from "../services/passwordService";
import { useI18n } from "../hooks/useI18n";
import { usePasswordRecovery } from "../hooks/usePasswordRecovery";
import { PasswordStrengthIndicator } from "../customcomponents/PasswordStrengthIndicator";
import "../styles/pages/VerifyPage.css";
import "../styles/components/Forms.css";
import "../styles/components/Hint.css";
import "../styles/components/RegistrationStep1.css";
import LanguageSelector from "../customcomponents/LanguageSelector";
import Textbox from "../customcomponents/Textbox";

export default function RecoverPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { t } = useI18n();

  // Token validation state
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Form submission state
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  // Use password recovery hook for password validation logic
  const passwordRecovery = usePasswordRecovery();

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      setValidating(false);
      return;
    }

    validateResetToken(token).then((result) => {
      setIsValid(result.success);
      setValidating(false);
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    // Validate password using hook
    const validation = passwordRecovery.validatePassword();
    if (!validation.isValid) {
      setMessage(t(validation.errorKey!));
      setSuccess(false);
      return;
    }

    setIsSubmitting(true);
    const result = await confirmPasswordReset(token, passwordRecovery.password);
    setMessage(result.message);
    setSuccess(result.success);
    setIsSubmitting(false);

    // Redirect to auth page on success
    if (result.success) {
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
  };

  const handlePasswordFocus = () => {
    setShowPasswordHints(true);
  };

  const handlePasswordBlur = () => {
    // Only hide if there's no content
    if (!passwordRecovery.password) {
      setShowPasswordHints(false);
    }
  };

  const canSubmit = passwordRecovery.canSubmit && !isSubmitting;
  const showMismatchError = passwordRecovery.password && passwordRecovery.repeatPassword && !passwordRecovery.passwordsMatch;

  if (validating) {
    return (
      <div className="verify-page">
        <div className="verify-container">
          <p>{t("auth.verify.loading.message") || "Verificando token..."}</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="verify-page">
        <div className="verify-container">
          <h1>{t("auth.verify.error.title") || "Token inválido o expirado"}</h1>
          <p>{t("auth.verify.error.message") || "El enlace ha expirado o no es válido."}</p>
          <button className="btn btn-primary" onClick={() => navigate("/auth")}>
            {t("auth.verify.goLogin") || "Volver al inicio de sesión"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-content">
          <h1 className="verify-title">
            {t("auth.password.newTitle") || "Restablecer contraseña"}
          </h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <Textbox
                type="password"
                label={t("auth.forms.password") || "Nueva contraseña"}
                name="password"
                value={passwordRecovery.password}
                placeholder={t("auth.forms.placeholders.password") || "••••••••"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => passwordRecovery.handlePasswordChange(e.target.value)}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator
                strength={passwordRecovery.strength}
                password={passwordRecovery.password}
                showHints={showPasswordHints}
                t={t}
              />
              {passwordRecovery.isCompromised && (
                <div className="hint hint-error">
                  {t("auth.password.compromised") || "Esta contraseña ha sido vulnerada."}
                </div>
              )}
            </div>

            <div className="form-group">
              <Textbox
                type="password"
                label={t("auth.forms.repeatPassword") || "Confirmar contraseña"}
                name="repeatPassword"
                value={passwordRecovery.repeatPassword}
                placeholder={t("auth.forms.placeholders.repeatPassword") || "••••••••"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => passwordRecovery.handleRepeatPasswordChange(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {showMismatchError && (
                <div className="hint hint-error">
                  {t("auth.password.mismatch") || "Las contraseñas no coinciden."}
                </div>
              )}
            </div>

            {message && (
              <div className={`hint hint-inline ${success ? "hint-success" : "hint-error"}`}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-secondary" disabled={!canSubmit}>
              {isSubmitting
                ? t("auth.loading") || "Cambiando..."
                : t("auth.password.changeButton") || "Cambiar contraseña"}
            </button>
          </form>

          <div className="verify-language-selector">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}