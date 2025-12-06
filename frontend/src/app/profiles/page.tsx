'use client';

import { Suspense } from 'react';
import ProfileManager from '@/components/ProfileManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profiles</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your professional profiles
                </p>
              </div>
              <a
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            <ProfileManager />
          </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
}
