/**
 * Notification Bell Component - Shows unread notification count
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';

export default function NotificationBell() {
  const { unreadCount } = useNotificationSocket();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">{unreadCount} unread</p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unreadCount === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <p className="p-4 text-sm text-gray-600">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4">
            <Link
              href="/activity"
              className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All Activities
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
