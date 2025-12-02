import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { notificationsApi } from "@/api/notifications";
import { useSignalR } from "@/hooks/useSignalR";
import type { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";
import styles from "./NotificationsDropdown.module.css";

/**
 * NotificationsDropdown component that displays a bell icon with unread count badge
 * and a dropdown list of notifications.
 * 
 * @component
 * @description
 * Features:
 * - Real-time notification updates via SignalR
 * - Badge showing unread notification count
 * - Dropdown list with notification items
 * - Mark as read and delete actions
 * - Click outside to close dropdown
 * 
 * @returns {JSX.Element} Notification bell with dropdown
 */
function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const { onNotification } = useSignalR();

    /**
     * Fetch unread notifications
     */
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: ({ signal }) => notificationsApi.getNotifications({ signal })
    });

    /**
     * Subscribe to real-time notifications
     */
    useEffect(() => {
        const cleanup = onNotification?.((notification) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });
        return cleanup;
    }, [onNotification, queryClient]);

    /**
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    /**
     * Mutation for marking notification as read
     */
    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => notificationsApi.markAsRead({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    /**
     * Mutation for deleting notification
     */
    const deleteMutation = useMutation({
        mutationFn: (id: string) => notificationsApi.deleteNotification({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = (id: string) => {
        markAsReadMutation.mutate(id);
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                type="button"
                className={styles.bellButton}
                onClick={handleToggle}
                aria-label="Notificações"
            >
                <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                        <h3>Notificações</h3>
                        {notifications.length > 0 && (
                            <span className={styles.count}>
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    <div className={styles.dropdownContent}>
                        {notifications.length === 0 ? (
                            <p className={styles.emptyState}>
                                Sem notificações
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                    isLoading={
                                        markAsReadMutation.isPending ||
                                        deleteMutation.isPending
                                    }
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationsDropdown;
