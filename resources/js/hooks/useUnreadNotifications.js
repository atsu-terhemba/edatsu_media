import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function useUnreadNotifications(auth, { pollMs = 30000 } = {}) {
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    const isSubscriber = !!auth?.id && auth?.role === 'subscriber';

    const fetchCounts = useCallback(async () => {
        if (!isSubscriber) return;
        try {
            const [notifRes, msgRes] = await Promise.all([
                axios.get('/api/notifications?filter=unread'),
                axios.get('/messages?type=inbox'),
            ]);
            const notifCount = Array.isArray(notifRes.data) ? notifRes.data.length : 0;
            const unreadMessages = Array.isArray(msgRes.data)
                ? msgRes.data.filter((m) => !m.is_read)
                : [];
            setNotificationCount(notifCount);
            setMessageCount(unreadMessages.length);
        } catch {
            setNotificationCount(0);
            setMessageCount(0);
        }
    }, [isSubscriber]);

    useEffect(() => {
        if (!isSubscriber) return;
        fetchCounts();
        const id = setInterval(fetchCounts, pollMs);
        return () => clearInterval(id);
    }, [isSubscriber, fetchCounts, pollMs]);

    return { notificationCount, messageCount, refresh: fetchCounts };
}
