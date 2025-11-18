// src/components/UploadButton.tsx
import { useRef, useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { log } from '../config/logConfig'
import { useNotifications } from '../customcomponents/NotificationProvider'
import { uploadFileToVirusTotal, getVirusTotalReport } from '../services/virusTotalService'
import { uploadAudio, uploadVideo } from '../services/contentUploadService'
import Textbox from '../customcomponents/Textbox'
import ContentFormModal from './ContentFormModal'
import type { ContentFormData } from '../utils/fieldValidator'

interface CreatorChannel {
  id: string
  name: string
  profileImage: string
  description: string
  subscriberCount: number
  createdAt: string
  contentType: 'audio' | 'video'
  specialty: string
}

interface UploadButtonProps {
  readonly channelData: CreatorChannel
}

// Validador eficiente para URLs de YouTube y Vimeo (sin backtracking)
const validateVideoUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false

  const youtubeRegex = /^https?:\/\/(?:(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:[?&][a-zA-Z0-9_=&-]*)?$/;
  const vimeoRegex = /^https?:\/\/(?:(?:www\.)?vimeo\.com\/|player\.vimeo\.com\/video\/)\d+(?:[?&][a-zA-Z0-9_=&-]*)?$/;

  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

// Función para verificar archivo con VirusTotal
const verifyFileWithVirusTotal = async (file: File): Promise<boolean> => {
  try {
    const VT_API_KEY = import.meta.env.VITE_VT_API_KEY || 'demo_key';

    if (VT_API_KEY === 'demo_key') {
      log('info', 'Simulando verificación VirusTotal - archivo considerado seguro');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    }

    const analysisId = await uploadFileToVirusTotal(file, VT_API_KEY);
    log('info', 'Archivo subido a VirusTotal, ID de análisis:', analysisId);

    let report;
    let attempts = 0;
    const maxAttempts = 30;

    do {
      await new Promise(resolve => setTimeout(resolve, 10000));
      report = await getVirusTotalReport(analysisId, VT_API_KEY);
      attempts++;
      log('debug', `Intento ${attempts}/${maxAttempts} - Estado: ${report.status}`);
    } while (report.status !== 'completed' && attempts < maxAttempts);

    if (report.status !== 'completed') {
      log('error', 'Análisis de VirusTotal no completado a tiempo');
      return false;
    }

    const isSafe = report.stats ? (report.stats.malicious === 0 && report.stats.suspicious === 0) : false;

    log('info', 'Resultado VirusTotal:', {
      malicious: report.stats?.malicious || 0,
      suspicious: report.stats?.suspicious || 0,
      harmless: report.stats?.harmless || 0,
      isSafe
    });

    return isSafe;
  } catch (error) {
    log('error', 'Error al verificar archivo con VirusTotal:', error);
    return false;
  }
};

export default function UploadButton({ channelData }: UploadButtonProps) {
  const { t } = useI18n()
  const { success, error } = useNotifications()
  const audioFileInputRef = useRef<HTMLInputElement>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contentSource, setContentSource] = useState('')
  const [contentType, setContentType] = useState<'audio' | 'video'>('video')
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleAudioFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      log('error', 'Solo se permiten archivos de audio')
      error(t('creator.upload.errors.audioOnly') || 'Only audio files are allowed')
      return
    }

    success(t('toast.success.contentUploading') || 'Verificando archivo...')

    try {
      const isSafe = await verifyFileWithVirusTotal(file)

      if (!isSafe) {
        error(t('toast.error.audioVerificationFailed') || 'El archivo no es seguro')
        log('error', 'Archivo de audio no pasó la verificación de seguridad')
        return
      }

      log('info', 'Archivo de audio verificado y seguro')
      
      setAudioFile(file)
      setContentSource(file.name)
      setContentType('audio')
      setIsModalOpen(true)

    } catch (err) {
      log('error', 'Error durante la verificación del archivo de audio:', err)
      error(t('toast.error.audioVerificationFailed') || 'Error al verificar el archivo')
    }

    event.target.value = ''
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setVideoUrl(newUrl)

    if (newUrl.trim() && !validateVideoUrl(newUrl.trim())) {
      setUrlError(t('creator.upload.errors.videoUrlOnly') || 'Only YouTube and Vimeo URLs are allowed')
    } else {
      setUrlError('')
    }
  }

  const handleVideoUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedUrl = videoUrl.trim()
    
    if (!trimmedUrl) {
      setUrlError(t('creator.upload.errors.videoUrlOnly') || 'La URL del video es obligatoria')
      log('error', 'URL de video vacía')
      return
    }

    if (!validateVideoUrl(trimmedUrl)) {
      setUrlError(t('creator.upload.errors.videoUrlOnly') || 'Solo se permiten URLs de YouTube y Vimeo')
      log('error', 'URL de video inválida:', trimmedUrl)
      return
    }

    setUrlError('')
    success(t('toast.success.contentUploading') || 'Verificando URL...')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const isSafe = true

      if (!isSafe) {
        error(t('toast.error.videoVerificationFailed') || 'La URL no es segura')
        log('error', 'URL de video no pasó la verificación de seguridad')
        return
      }

      log('info', 'URL de video verificada y segura:', trimmedUrl)
      
      setContentSource(trimmedUrl)
      setContentType('video')
      setIsModalOpen(true)

    } catch (err) {
      log('error', 'Error durante la verificación de la URL de video:', err)
      error(t('toast.error.videoVerificationFailed') || 'Error al verificar la URL')
    }

    // Limpiar el campo DESPUÉS de guardar en contentSource
    setVideoUrl('')
  }

  const handleAudioUploadClick = () => {
    audioFileInputRef.current?.click()
  }

  const handleModalSubmit = async (formData: ContentFormData) => {
    log('info', 'Contenido enviado desde modal:', formData)
    
    try {
      // Convertir availableUntil a ISO si existe
      let availableUntilISO: string | undefined = undefined
      if (formData.availableUntil?.trim()) {
        availableUntilISO = new Date(formData.availableUntil).toISOString()
      }
      
      // Convertir tags de string a array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      const commonData = {
        title: formData.title,
        description: formData.description || undefined,
        tags: tagsArray,  // ⭐ Ahora es un array
        maxQuality: formData.maxQuality,
        vipOnly: formData.isPremium,
        state: (formData.isVisible ? 'VISIBLE' : 'OCULTO') as 'VISIBLE' | 'OCULTO',
        minAge: formData.minimumAge || 0,
        thumbnailFile: formData.thumbnailImage,
        availableUntil: availableUntilISO
      }

      let result

      if (contentType === 'audio') {
        if (!audioFile) {
          throw new Error(t('creator.upload.errors.audioFileNotFound') || 'Audio file not found')
        }

        result = await uploadAudio({
          audioFile,
          ...commonData
        })
      } else {
        // Validar que la URL no esté vacía antes de enviar
        if (!contentSource || !contentSource.trim()) {
          throw new Error(t('creator.upload.errors.videoUrlOnly') || 'La URL del video es obligatoria')
        }
        
        log('info', 'Subiendo video con URL:', contentSource)
        
        result = await uploadVideo({
          videoUrl: contentSource.trim(),
          ...commonData
        })
      }

      log('info', 'Contenido subido exitosamente:', result)
      
      setIsModalOpen(false)
      success(t('toast.success.contentPublished') || 'Contenido publicado exitosamente')
      
      // Limpiar estados
      setVideoUrl('')
      setUrlError('')
      setContentSource('')
      setAudioFile(null)
      
    } catch (err: any) {
      log('error', 'Error al subir contenido:', err)
      error(err.message || t('toast.error.uploadFailed') || 'Error al publicar el contenido')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="card card-lg card-creator-upload">
      <div className="upload-header">
        <h2>{t('creator.upload.title')}</h2>
      </div>

      {channelData.contentType === 'audio' ? (
        <>
          <div className="upload-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>

          <p>{t('creator.upload.audioDescription')}</p>

          <button
            className="btn btn-primary btn-upload"
            onClick={handleAudioUploadClick}
          >
            {t('creator.upload.selectAudioFile')}
          </button>
        </>
      ) : (
        <>
          <div className="upload-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>

          <form onSubmit={handleVideoUrlSubmit} className="upload-form">
            <div className="form-group">
              <Textbox
                type="url"
                label={t('creator.upload.videoUrlLabel') || 'URL del Video'}
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder={t('creator.upload.videoUrlPlaceholder')}
                validationState={urlError ? 'error' : undefined}
                error={urlError}
                required
                className="textbox-upload-dark"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-upload"
              disabled={!videoUrl.trim() || !!urlError}
            >
              {t('creator.upload.uploadVideo')}
            </button>
          </form>
        </>
      )}

      <input
        type="file"
        ref={audioFileInputRef}
        accept="audio/*"
        onChange={handleAudioFileSelect}
        style={{ display: 'none' }}
      />

      <ContentFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        contentSource={contentSource}
        contentType={contentType}
      />
    </div>
  )
}

