/**
 * Notification Socket Hook - Manages real-time socket connections
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface NotificationEvent {
  type: string;
  data: any;
  timestamp: string;
}

export const useNotificationSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get auth data from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

    if (!token || !userId) return;

    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token,
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current?.emit('request:unread-count');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for unread count updates
    socketRef.current.on('unread:count', (data: any) => {
      setUnreadCount(data.unread);
    });

    // Listen for activity updates
    socketRef.current.on('activity:updated', () => {
      socketRef.current?.emit('request:unread-count');
    });

    socketRef.current.on('activity:all-read', () => {
      setUnreadCount(0);
    });

    socketRef.current.on('activity:new', (event: NotificationEvent) => {
      // Trigger browser notification if available
      if (typeof window !== 'undefined' && Notification.permission === 'granted') {
        new Notification(event.data.title || 'New Activity', {
          body: event.data.description || '',
          icon: '/favicon.ico',
        });
      }
      socketRef.current?.emit('request:unread-count');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const requestActivityFeed = (limit?: number, skip?: number) => {
    socketRef.current?.emit('request:activity-feed', { limit, skip });
  };

  const markAsRead = (activityId: string) => {
    socketRef.current?.emit('activity:mark-read', { activityId });
  };

  const markAllAsRead = () => {
    socketRef.current?.emit('activity:mark-all-read');
  };

  return {
    isConnected,
    unreadCount,
    requestActivityFeed,
    markAsRead,
    markAllAsRead,
  };
};
