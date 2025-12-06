/**
 * Activity Feed Component - Displays user notifications and activities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useNotificationSocket } from '@/hooks/useNotificationSocket';
import apiClient from '@/lib/api/auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Activity {
  _id: string;
  type: string;
  title: string;
  description?: string;
  read: boolean;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function ActivityFeedPage() {
  const { unreadCount, requestActivityFeed, markAsRead, markAllAsRead } = useNotificationSocket();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [filter, page]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const limit = 20;
      const skip = (page - 1) * limit;

      const response = await apiClient.get(`/activities/feed`, {
        params: { limit, skip },
      });

      const newActivities = response.data.data.activities;
      setActivities((prev) => (page === 1 ? newActivities : [...prev, ...newActivities]));
      setHasMore(newActivities.length === limit);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (activityId: string) => {
    markAsRead(activityId);
    setActivities((prev) =>
      prev.map((a) => (a._id === activityId ? { ...a, read: true } : a))
    );
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return '👁️';
      case 'like':
        return '❤️';
      case 'share':
        return '📤';
      case 'comment':
        return '💬';
      case 'download':
        return '⬇️';
      case 'message':
        return '💌';
      case 'follow':
        return '👥';
      default:
        return '📌';
    }
  };

  const filteredActivities = filter === 'unread' ? activities.filter((a) => !a.read) : activities;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Activity Feed</h1>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Activities
            </button>
            <button
              onClick={() => {
                setFilter('unread');
                setPage(1);
              }}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                filter === 'unread'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread {unreadCount > 0 && <span className="ml-2 badge">{unreadCount}</span>}
            </button>
          </div>

          {/* Activities List */}
          {loading && page === 1 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-lg h-24"></div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No activities yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity._id}
                  onClick={() => !activity.read && handleMarkAsRead(activity._id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    activity.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                      )}
                      {activity.user && (
                        <p className="text-xs text-gray-500 mt-2">
                          From: <span className="font-medium">{activity.user.name}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!activity.read && (
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
