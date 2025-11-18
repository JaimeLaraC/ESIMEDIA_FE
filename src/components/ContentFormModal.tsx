// src/components/ContentFormModal.tsx
import { useState, useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'
import { log } from '../config/logConfig'
import Modal from '../customcomponents/Modal'
import Textbox from '../customcomponents/Textbox'
import ToggleSwitch from '../customcomponents/ToggleSwitch'
import Combobox, { type ComboboxOption } from '../customcomponents/Combobox'
import ScrollableContainer from '../customcomponents/ScrollableContainer'
import {
  validateContentForm,
  type ContentFormData
} from '../utils/fieldValidator'
import {
  createEmptyFormData,
  createEmptyErrors,
  hasValidationErrors,
  parseNumberInput,
  getFirstFile,
  getContentSourceLabel,
  shouldDisableAvailableUntil,
  getSubmitButtonText,
  getQualityOptions
} from '../utils/contentFormUtils'

interface ContentFormModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSubmit: (data: ContentFormData) => void
  readonly contentSource: string
  readonly contentType: 'audio' | 'video'
  readonly initialData?: Partial<ContentFormData>
  readonly isLoading?: boolean
}

export default function ContentFormModal({
  isOpen,
  onClose,
  onSubmit,
  contentSource,
  contentType,
  initialData,
  isLoading = false
}: ContentFormModalProps) {
  const { t } = useI18n()

  // Estado del formulario
  const [formData, setFormData] = useState<ContentFormData>(createEmptyFormData(initialData))
  const [errors, setErrors] = useState<Partial<Record<keyof ContentFormData, string>>>(createEmptyErrors())

  // Resetear formulario cuando se abre
  useEffect(() => {
    if (isOpen) {
      setFormData(createEmptyFormData(initialData))
      setErrors(createEmptyErrors())
    }
  }, [isOpen, initialData])

  // Handler genérico para inputs de texto
  const handleInputChange = (field: keyof ContentFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handler para inputs numéricos
  const handleNumberChange = (field: 'minimumAge') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseNumberInput(e.target.value)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handler para archivos
  const handleFileChange = (field: 'thumbnailImage') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = getFirstFile(e.target.files)
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  // Limpiar fecha cuando se oculta el contenido
  const clearAvailableUntilDate = () => {
    setFormData(prev => ({ ...prev, availableUntil: '' }))
    setErrors(prev => ({ ...prev, availableUntil: undefined }))
  }

  // Handler para toggle de visibilidad
  const handleVisibilityToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isVisible: checked }))
    
    if (!checked) {
      clearAvailableUntilDate()
    }
  }

  // Handler para toggle de premium
  const handlePremiumToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPremium: checked }))
  }

  // Handler para marcar campo como tocado
  const handleBlur = () => () => {
    // Campo marcado como tocado para validación futura
  }

  // Validar formulario completo
  const validateForm = (): boolean => {
    const rawErrors = validateContentForm(formData)
    
    // Traducir las claves de validación a mensajes
    const translatedErrors: Partial<Record<keyof ContentFormData, string>> = {}
    for (const [field, errorKey] of Object.entries(rawErrors)) {
      if (errorKey) {
        translatedErrors[field as keyof ContentFormData] = t(errorKey) || errorKey
      }
    }
    
    setErrors(translatedErrors)
    
    return !hasValidationErrors(translatedErrors)
  }

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) {
      log('error', 'Formulario inválido, no se puede enviar')
      return
    }

    log('info', 'Enviando formulario de contenido:', formData)
    onSubmit(formData)
  }

  // Obtener textos traducidos con fallbacks
  const getTranslation = (key: string, fallback: string): string => {
    return t(key) || fallback
  }

  const contentSourceLabel = getContentSourceLabel(contentType)
  const submitButtonText = getSubmitButtonText(
    isLoading,
    getTranslation('common.loading', 'Cargando...'),
    getTranslation('creator.upload.publish', 'Publicar Contenido')
  )

  // Opciones para el combobox de calidad máxima
  const qualityOptions: ComboboxOption[] = getQualityOptions()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTranslation('creator.upload.completeInfo', 'Completar Información del Contenido')}
      size="large"
    >
      <ScrollableContainer maxHeight="60vh" className="content-form-container">
        <form onSubmit={handleSubmit} className="content-form">
        {/* FUENTE DEL CONTENIDO (NO EDITABLE) */}
        <div className="form-section">
          <h3>{getTranslation('creator.upload.contentSource', 'Fuente del Contenido')}</h3>
          <div className="content-source-display">
            <div className="source-info">
              <span className="source-label">{contentSourceLabel}</span>
              <span className="source-value">{contentSource}</span>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DEL CONTENIDO */}
        <div className="form-section">
          <h3>{getTranslation('creator.upload.contentInfo', 'Información del Contenido')}</h3>

          <div className="form-row">
            <Textbox
              label={getTranslation('creator.upload.title', 'Título')}
              value={formData.title}
              onChange={handleInputChange('title')}
              onBlur={handleBlur()}
              error={errors.title}
              placeholder={getTranslation('creator.upload.titlePlaceholder', 'Ingresa un título atractivo')}
              required
            />
          </div>

          <div className="form-row">
            <Textbox
              as="textarea"
              label={getTranslation('creator.upload.description', 'Descripción')}
              value={formData.description}
              onChange={handleInputChange('description')}
              onBlur={handleBlur()}
              error={errors.description}
              placeholder={getTranslation('creator.upload.descriptionPlaceholder', 'Describe brevemente el contenido...')}
            />
          </div>

          <div className="form-row">
            <Combobox
              label={getTranslation('creator.upload.maxQuality', 'Calidad máxima')}
              value={formData.maxQuality}
              options={qualityOptions}
              onChange={(value) => {
                setFormData(prev => ({ 
                  ...prev, 
                  maxQuality: value,
                }))
              }}
              placeholder={getTranslation('creator.upload.selectQuality', 'Seleccionar calidad')}
              error={errors.maxQuality}
              required
            />
          </div>

          <div className="form-row">
            <Textbox
              type="number"
              label={getTranslation('creator.upload.minimumAge', 'Edad mínima')}
              value={formData.minimumAge?.toString() || ''}
              onChange={handleNumberChange('minimumAge')}
              onBlur={handleBlur()}
              error={errors.minimumAge}
              placeholder={getTranslation('creator.upload.minimumAgePlaceholder', 'Edad mínima (opcional)')}
              min="0"
              max="99"
            />
          </div>

          <div className="form-row">
            <Textbox
              label={getTranslation('creator.upload.tags', 'Tags')}
              value={formData.tags}
              onChange={handleInputChange('tags')}
              onBlur={handleBlur()}
              error={errors.tags}
              placeholder={getTranslation('creator.upload.tagsPlaceholder', 'Ej: música, rock, indie')}
              required
            />
          </div>

          <ThumbnailUploadField
            formData={formData}
            errors={errors}
            onFileChange={handleFileChange('thumbnailImage')}
            onBlur={handleBlur()}
            t={t}
          />
        </div>

        {/* CONFIGURACIÓN DEL CONTENIDO */}
        <div className="form-section">
          <h3>{getTranslation('creator.upload.contentSettings', 'Configuración del Contenido')}</h3>

          <div className="form-row">
            <ToggleSwitch
              label={getTranslation('creator.upload.contentType', 'Tipo de Contenido')}
              leftLabel={getTranslation('creator.upload.standard', 'Estándar')}
              rightLabel={getTranslation('creator.upload.premium', 'Premium')}
              isActive={formData.isPremium}
              onToggle={handlePremiumToggle}
              rightLabelPremium={true}
              className="content-type-toggle"
            />
          </div>

          <div className="form-row">
            <ToggleSwitch
              label={getTranslation('creator.upload.visibility', 'Visibilidad')}
              leftLabel={getTranslation('creator.upload.visible', 'Visible')}
              rightLabel={getTranslation('creator.upload.hidden', 'Oculto')}
              isActive={!formData.isVisible}
              onToggle={(active) => handleVisibilityToggle(!active)}
              className="visibility-toggle"
            />
          </div>

          <div className="form-row">
            <Textbox
              type="date"
              label={getTranslation('creator.upload.availableUntil', 'Disponible Hasta')}
              value={formData.availableUntil}
              onChange={handleInputChange('availableUntil')}
              onBlur={handleBlur()}
              error={errors.availableUntil}
              disabled={shouldDisableAvailableUntil(formData.isVisible)}
              required={false}
            />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {submitButtonText}
          </button>
        </div>
      </form>
      </ScrollableContainer>
    </Modal>
  )
}

// Componente extraído para el campo de thumbnail
interface ThumbnailUploadFieldProps {
  readonly formData: ContentFormData
  readonly errors: Partial<Record<keyof ContentFormData, string>>
  readonly onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readonly onBlur: () => void
  readonly t: (key: string) => string | undefined
}

function ThumbnailUploadField({
  formData,
  errors,
  onFileChange,
  onBlur,
  t
}: ThumbnailUploadFieldProps) {
  const hasThumbnail = Boolean(formData.thumbnailImage)
  const hasError = Boolean(errors.thumbnailImage)

  return (
    <div className="form-row">
      <div className="file-upload-group">
        <label className="file-upload-label">
          {t('creator.upload.thumbnailImage') || 'Imagen de Portada'}
        </label>
        <div className="thumbnail-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            onBlur={onBlur}
            className="file-upload-input"
            id="thumbnail-upload"
          />
          <label htmlFor="thumbnail-upload" className="thumbnail-upload-zone">
            {hasThumbnail && formData.thumbnailImage ? (
              <ThumbnailPreview file={formData.thumbnailImage} />
            ) : (
              <div className="thumbnail-upload-placeholder">
                <svg className="thumbnail-upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span className="thumbnail-upload-text">
                  {t('creator.upload.selectThumbnail') || 'Seleccionar imagen'}
                </span>
                <span className="thumbnail-upload-hint">
                  {t('creator.upload.thumbnailHint') || 'Formato 16:9 recomendado, máximo 5MB'}
                </span>
              </div>
            )}
          </label>
        </div>
        {hasError && (
          <span className="error-message">{errors.thumbnailImage}</span>
        )}
      </div>
    </div>
  )
}

// Componente para preview del thumbnail
interface ThumbnailPreviewProps {
  readonly file: File
}

function ThumbnailPreview({ file }: ThumbnailPreviewProps) {
  return (
    <div className="thumbnail-preview-container">
      <img
        src={URL.createObjectURL(file)}
        alt="Vista previa de la portada"
        className="thumbnail-preview-image"
      />
      <div className="thumbnail-preview-overlay">
        <span className="thumbnail-preview-filename">{file.name}</span>
      </div>
    </div>
  )
}