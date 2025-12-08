'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to single profile page
    router.replace('/profile');
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to Profile...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
