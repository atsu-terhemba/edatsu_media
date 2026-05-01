import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// `navigator.serviceWorker.ready` hangs indefinitely if the SW failed to
// install (e.g. a precached asset 404s). Race it against a timeout so the
// subscribe flow can fail loudly instead of leaving the UI stuck.
function readyWithTimeout(ms) {
    return Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(
            () => reject(new Error('Service worker did not become ready in time')),
            ms,
        )),
    ]);
}

export default function usePushNotifications(vapidPublicKey) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState('default');
    const registrationRef = useRef(null);

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window) || !vapidPublicKey) {
            return;
        }

        setPermission(Notification.permission);

        navigator.serviceWorker.register('/sw.js').then((registration) => {
            registrationRef.current = registration;
            return registration.pushManager.getSubscription();
        }).then((sub) => {
            setIsSubscribed(!!sub);
        }).catch((err) => {
            console.error('Service worker registration failed:', err);
        });
    }, [vapidPublicKey]);

    const subscribe = async () => {
        if (!vapidPublicKey) return false;

        try {
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') return false;

            const registration = registrationRef.current
                ?? await readyWithTimeout(10000);
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            const sub = subscription.toJSON();
            await axios.post('/api/push/subscribe', {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.keys.p256dh,
                    auth: sub.keys.auth,
                },
                content_encoding: PushManager.supportedContentEncodings
                    ? PushManager.supportedContentEncodings[0]
                    : 'aesgcm',
            });

            setIsSubscribed(true);
            return true;
        } catch (err) {
            console.error('Push subscription failed:', err);
            return false;
        }
    };

    const unsubscribe = async () => {
        try {
            const registration = registrationRef.current
                ?? await readyWithTimeout(10000);
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                const sub = subscription.toJSON();
                await axios.post('/api/push/unsubscribe', { endpoint: sub.endpoint });
                await subscription.unsubscribe();
            }
            setIsSubscribed(false);
            return true;
        } catch (err) {
            console.error('Push unsubscribe failed:', err);
            return false;
        }
    };

    return { isSubscribed, permission, subscribe, unsubscribe };
}
