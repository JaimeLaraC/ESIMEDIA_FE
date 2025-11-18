import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/passwordService";
import { useI18n } from "../hooks/useI18n";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateEmail } from "../utils/fieldValidator";
import LanguageSelector from "../customcomponents/LanguageSelector";
import { log } from "../config/logConfig";
import "../styles/pages/RequestPasswordPage.css";
import Textbox from "../customcomponents/Textbox";

interface FormData {
  email: string;
}

export default function RequestPasswordPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Form validation hook
  const { errors, validateAndSetField, validateAll } = useFormValidation<FormData>({
    email: validateEmail
  }, t);

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (touched) {
      validateAndSetField('email', value);
    }
  }, [touched, validateAndSetField]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    validateAndSetField('email', email);
  }, [email, validateAndSetField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const isValid = validateAll({ email });
    if (!isValid) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await requestPasswordReset(email);
      if (result && typeof result === 'object') {
        setMessage(result.message || t("auth.password.error"));
        setSuccess(result.success || false);
        if (result.success) setSent(true);
      } else {
        setMessage(t("auth.password.error"));
        setSuccess(false);
      }
    } catch (err) {
      log('error', 'Error requesting password reset:', err);
      setMessage(t("auth.password.error"));
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-password-page">
      <div className="request-password-container">
        <div className="request-password-content">
          <h1 className="request-password-title">
            {t("auth.password.resetTitle") || "Recuperar contraseña"}
          </h1>
          <p className="request-password-message">
            {t("auth.password.resetMessage") ||
              "Introduce tu correo electrónico para recibir un enlace de restablecimiento."}
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <Textbox
              type="email"
              label={t("auth.forms.email") || "Correo electrónico"}
              name="email"
              placeholder={t("auth.forms.placeholders.email") || "ejemplo@correo.com"}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEmailChange(e.target.value)}
              onBlur={handleBlur}
              disabled={isLoading || sent}
              autoComplete="email"
              validationState={touched && errors.email ? "error" : undefined}
            />
            {touched && errors.email && (
              <div className="hint hint-error">{errors.email}</div>
            )}
          </div>

          {/* Mensaje de éxito o error */}
          {message && (
            <div
              className={`hint hint-inline ${success ? "hint-success" : "hint-error"}`}
            >
              {message}
            </div>
          )}

          {/* Solo mostrar el botón si aún no se ha enviado */}
          {!sent && (
            <button
              type="submit"
              className="btn-secondary"
              disabled={isLoading || !email || !!errors.email}
            >
              {isLoading
                ? t("auth.loading") || "Enviando..."
                : t("auth.password.sendLink") || "Enviar enlace"}
            </button>
          )}

          {/* Botón de regreso al login (siempre visible) */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/auth")}
          >
            {t("auth.verify.goLogin") || "Volver al inicio"}
          </button>
        </form>

          <div className="request-password-language-selector">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
