"use client";

import { useState, useEffect, useCallback } from "react";

export type NotificationPermissionStatus = "granted" | "denied" | "default" | "unsupported";

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermissionStatus>("default");
    const [isSupported, setIsSupported] = useState(true);
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (!("Notification" in window)) {
            setIsSupported(false);
            setPermission("unsupported");
            return;
        }

        setPermission(Notification.permission);

        // Register Service Worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    setSwRegistration(registration);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!isSupported) return "unsupported";

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        } catch (error) {
            console.error("Error requesting permission:", error);
            return "denied";
        }
    }, [isSupported]);

    const sendNotification = useCallback(
        (title: string, options?: NotificationOptions) => {
            if (permission !== "granted") return;

            // Use Service Worker for notification if available (better mobile support)
            if (swRegistration) {
                swRegistration.showNotification(title, {
                    icon: '/favicon.ico',
                    ...options
                });
            } else {
                // Fallback to standard API
                const notification = new Notification(title, {
                    icon: '/favicon.ico',
                    ...options
                });

                notification.onclick = () => {
                    window.focus();
                    notification.close();
                }
            }
        },
        [permission, swRegistration]
    );

    return {
        permission,
        requestPermission,
        sendNotification,
        isSupported,
    };
}
