import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Configuración base para todas las notificaciones
 */
const BASE_TOAST_OPTIONS = {
  position: "bottom-center" as const,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as const,
}

/**
 * Configuraciones específicas por tipo de notificación
 */
const NOTIFICATION_CONFIGS = {
  success: { ...BASE_TOAST_OPTIONS, autoClose: 3000 },
  error: { ...BASE_TOAST_OPTIONS, autoClose: 5000 },
  warning: { ...BASE_TOAST_OPTIONS, autoClose: 4000 },
  info: { ...BASE_TOAST_OPTIONS, autoClose: 3000 },
} as const

/**
 * Tipos de notificación disponibles
 */
export type NotificationType = keyof typeof NOTIFICATION_CONFIGS

/**
 * Opciones para notificaciones personalizadas
 */
export interface CustomNotificationOptions {
  type: NotificationType
  message: string
  duration?: number
}

/**
 * Contexto para el servicio de notificaciones
 */
interface NotificationContextType {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
  custom: (options: CustomNotificationOptions) => void
  dismissAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

/**
 * Hook para usar el servicio de notificaciones
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

/**
 * Servicio simplificado de notificaciones
 */
const createNotificationService = () => {
  const showNotification = (type: NotificationType, message: string, duration?: number) => {
    const config = duration
      ? { ...NOTIFICATION_CONFIGS[type], autoClose: duration }
      : NOTIFICATION_CONFIGS[type]

    switch (type) {
      case 'success':
        toast.success(message, config)
        break
      case 'error':
        toast.error(message, config)
        break
      case 'warning':
        toast.warning(message, config)
        break
      case 'info':
        toast.info(message, config)
        break
    }
  }

  return {
    success: (message: string) => showNotification('success', message),
    error: (message: string) => showNotification('error', message),
    warning: (message: string) => showNotification('warning', message),
    info: (message: string) => showNotification('info', message),
    custom: ({ type, message, duration }: CustomNotificationOptions) =>
      showNotification(type, message, duration),
    dismissAll: () => toast.dismiss(),
  }
}

/**
 * Props del NotificationProvider
 */
interface NotificationProviderProps {
  children: ReactNode
}

/**
 * Provider del servicio de notificaciones
 * Proporciona el contexto de notificaciones a toda la aplicación
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notificationService = createNotificationService()

  return (
    <NotificationContext.Provider value={notificationService}>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        containerId="notification-root"
        style={{ zIndex: 2147483647 }}
      />
    </NotificationContext.Provider>
  )
}