import { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { Notification } from "@/types/notification";

/**
 * SignalR connection state
 */
export const ConnectionState = {
    Disconnected: "Disconnected",
    Connecting: "Connecting",
    Connected: "Connected",
    Reconnecting: "Reconnecting",
    Disconnecting: "Disconnecting"
} as const;

export type ConnectionState = typeof ConnectionState[keyof typeof ConnectionState];

/**
 * Hook for managing SignalR connection to NotificationHub
 * 
 * @returns {Object} SignalR connection utilities
 * @property {ConnectionState} connectionState - Current connection state
 * @property {Notification | null} lastNotification - Last received notification
 * @property {(callback: (notification: Notification) => void) => void} onNotification - Subscribe to notifications
 * 
 * @example
 * const { connectionState, onNotification } = useSignalR();
 * 
 * useEffect(() => {
 *   onNotification((notification) => {
 *     console.log("New notification:", notification);
 *   });
 * }, [onNotification]);
 */
export function useSignalR() {
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        ConnectionState.Disconnected
    );
    const [lastNotification, setLastNotification] = useState<Notification | null>(null);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const accessToken = useAuthStore((s) => s.tokens?.accessToken);

    /**
     * Initialize SignalR connection
     */
    useEffect(() => {
        // Only connect if user is authenticated
        if (!accessToken) {
            return;
        }

        const baseURL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
        const hubUrl = `${baseURL}/notificationHub`;

        // Create connection with authentication
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => accessToken
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Connection state handlers
        newConnection.onclose(() => {
            setConnectionState(ConnectionState.Disconnected);
        });

        newConnection.onreconnecting(() => {
            setConnectionState(ConnectionState.Reconnecting);
        });

        newConnection.onreconnected(() => {
            setConnectionState(ConnectionState.Connected);
        });

        // Listen for notifications
        newConnection.on("ReceiveNotification", (notification: Notification) => {
            setLastNotification(notification);
        });

        // Start connection
        setConnectionState(ConnectionState.Connecting);
        newConnection
            .start()
            .then(() => {
                setConnectionState(ConnectionState.Connected);
                console.log("SignalR Connected");
            })
            .catch((err) => {
                console.error("SignalR Connection Error:", err);
                setConnectionState(ConnectionState.Disconnected);
            });

        setConnection(newConnection);

        // Cleanup on unmount
        return () => {
            if (newConnection) {
                setConnectionState(ConnectionState.Disconnecting);
                newConnection.stop().then(() => {
                    setConnectionState(ConnectionState.Disconnected);
                    console.log("SignalR Disconnected");
                });
            }
        };
    }, [accessToken]);

    /**
     * Subscribe to notification events
     * Returns a callback to invoke when new notifications arrive
     */
    const onNotification = useCallback(
        (callback: (notification: Notification) => void) => {
            if (connection) {
                connection.on("ReceiveNotification", callback);
                
                // Return cleanup function
                return () => {
                    connection.off("ReceiveNotification", callback);
                };
            }
        },
        [connection]
    );

    return {
        connectionState,
        lastNotification,
        onNotification
    };
}