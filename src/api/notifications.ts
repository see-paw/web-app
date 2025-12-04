import type { Notification } from "@/types/notification";
import { api } from "./api";

/**
 * API client for notification endpoints.
 * 
 * Provides functions to retrieve, mark as read, and delete notifications.
 * 
 * @namespace notificationsApi
 */
export const notificationsApi = {
    /**
     * Fetch all notifications for the authenticated user.
     * 
     * @function getNotifications
     * @memberof notificationsApi
     * 
     * @param {Object} params - Request parameters
     * @param {boolean} [params.unreadOnly] - Filter to only unread notifications
     * @param {AbortSignal} [params.signal] - Abort signal for cancelling the request
     * 
     * @returns {Promise<Notification[]>} List of notifications
     * 
     * @throws {Error} When the request fails or user is not authenticated
     * 
     * @example
     * const notifications = await notificationsApi.getNotifications({ 
     *   unreadOnly: true,
     *   signal 
     * });
     */
    getNotifications: async ({ unreadOnly, signal }: {
        unreadOnly?: boolean;
        signal?: AbortSignal;
    } = {}): Promise<Notification[]> => {
        const params: Record<string, string> = {};
        
        if (unreadOnly !== undefined) {
            params.unreadOnly = unreadOnly.toString();
        }

        const { data } = await api.get<Notification[]>("/notifications", {
            params,
            signal
        });

        return data;
    },

    /**
     * Fetch only unread notifications for the authenticated user.
     * Method that uses the dedicated /unread endpoint.
     * 
     * @function getUnreadNotifications
     * @memberof notificationsApi
     * 
     * @param {Object} params - Request parameters
     * @param {AbortSignal} [params.signal] - Abort signal for cancelling the request
     * 
     * @returns {Promise<Notification[]>} List of unread notifications
     * 
     * @throws {Error} When the request fails or user is not authenticated
     * 
     * @example
     * const unread = await notificationsApi.getUnreadNotifications({ signal });
     */
    getUnreadNotifications: async ({ signal }: {
        signal?: AbortSignal;
    } = {}): Promise<Notification[]> => {
        const { data } = await api.get<Notification[]>("/notifications/unread", {
            signal
        });

        return data;
    },

    /**
     * Mark a notification as read.
     * 
     * @function markAsRead
     * @memberof notificationsApi
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.id - Notification ID
     * 
     * @returns {Promise<void>} No content response
     * 
     * @throws {Error} When the request fails or notification doesn't exist
     * 
     * @example
     * await notificationsApi.markAsRead({ id: "abc123" });
     */
    markAsRead: async ({ id }: { id: string }): Promise<void> => {
        await api.put(`/notifications/${id}/read`);
    },

    /**
     * Delete a notification.
     * 
     * @function deleteNotification
     * @memberof notificationsApi
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.id - Notification ID
     * 
     * @returns {Promise<void>} No content response
     * 
     * @throws {Error} When the request fails or notification doesn't exist
     * 
     * @example
     * await notificationsApi.deleteNotification({ id: "abc123" });
     */
    deleteNotification: async ({ id }: { id: string }): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    }
};