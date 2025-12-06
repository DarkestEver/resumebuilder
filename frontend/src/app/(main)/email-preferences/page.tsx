/**
 * Email Preferences Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api/auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface EmailPreferences {
  _id?: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  paymentReceipts: boolean;
  weeklyDigest: boolean;
  shares: boolean;
  comments: boolean;
}

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await apiClient.get('/email/preferences');
      setPreferences(response.data.data.preferences);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load email preferences' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof EmailPreferences) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [key]: !preferences[key],
      });
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await apiClient.put('/email/preferences', preferences);
      setMessage({ type: 'success', text: 'Email preferences updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences' });
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!confirm('Are you sure? You will unsubscribe from all emails except payment receipts.')) {
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/email/unsubscribe');
      await loadPreferences();
      setMessage({ type: 'success', text: 'Unsubscribed from all emails successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to unsubscribe' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Email Preferences</h1>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Preferences Form */}
          {preferences && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive notifications about your account activity
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={() => handleChange('emailNotifications')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">
                      {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive updates about new features and offers
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={() => handleChange('marketingEmails')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">
                      {preferences.marketingEmails ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Payment Receipts */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Receipts</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive invoices and payment confirmations
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.paymentReceipts}
                      onChange={() => handleChange('paymentReceipts')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">
                      {preferences.paymentReceipts ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Weekly Digest */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive a weekly summary of activity on your profile
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyDigest}
                      onChange={() => handleChange('weeklyDigest')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">
                      {preferences.weeklyDigest ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                {/* Resume Shares */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Resume Shares</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Be notified when someone shares your resume
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.shares}
                      onChange={() => handleChange('shares')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">{preferences.shares ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>

                {/* Comments */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Comments & Feedback</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive notifications about comments on your profile
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.comments}
                      onChange={() => handleChange('comments')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">
                      {preferences.comments ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
                <button
                  onClick={handleUnsubscribeAll}
                  disabled={saving}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 disabled:opacity-50 transition-colors font-semibold"
                >
                  Unsubscribe from All
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Note:</span> Payment receipts will be sent regardless of your notification settings, as they are essential for your account.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
