import { useI18n } from '../hooks/useI18n'

interface NotificationItem {
    readonly id: string
    readonly title: string
    readonly time: string
}

interface NotificationsDropdownProps {
    readonly notifications: NotificationItem[]
    readonly isOpen: boolean
    readonly dropdownRef: React.RefObject<HTMLDivElement | null>
}

export default function NotificationsDropdown({
    notifications,
    isOpen,
    dropdownRef
}: NotificationsDropdownProps) {
    const { t } = useI18n()

    if (!isOpen) return null

    return (
        <div className="notifications-dropdown" ref={dropdownRef}>
            <h3>{t('header.notifications.title')}</h3>
            <div className="notifications-list">
                {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <span>{notification.title}</span>
                        <small>{notification.time}</small>
                    </div>
                ))}
            </div>
            <button className="see-all-notifications">
                {t('header.notifications.seeAll')}
            </button>
        </div>
    )
}