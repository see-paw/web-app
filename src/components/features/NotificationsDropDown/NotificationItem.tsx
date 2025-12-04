import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Notification } from "@/types/notification";
import styles from "./NotificationItem.module.css";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
}

/**
 * NotificationItem component that displays a single notification with actions.
 * 
 * @component
 * @param {NotificationItemProps} props - Component props
 * @returns {JSX.Element} A notification item with mark as read and delete buttons
 */
function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    isLoading
}: NotificationItemProps) {
    /**
     * Format date to relative time (e.g., "há 5 minutos")
     */
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return "agora mesmo";
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `há ${diffInMinutes} min`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `há ${diffInHours}h`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `há ${diffInDays}d`;
        }

        return date.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit"
        });
    };

    return (
        <div
            className={`${styles.item} ${
                notification.isRead ? styles.read : styles.unread
            }`}
        >
            <div className={styles.content}>
                <p className={styles.message}>{notification.message}</p>
                <span className={styles.time}>
                    {formatRelativeTime(notification.createdAt)}
                </span>
            </div>

            <div className={styles.actions}>
                {!notification.isRead && (
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => onMarkAsRead(notification.id)}
                        disabled={isLoading}
                        title="Marcar como lida"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                )}
                <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete(notification.id)}
                    disabled={isLoading}
                    title="Apagar"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}

export default NotificationItem;
