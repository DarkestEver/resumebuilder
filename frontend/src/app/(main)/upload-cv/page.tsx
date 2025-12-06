'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CVUpload from '@/components/CVUpload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CVUploadPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to profiles page after successful upload
    setTimeout(() => {
      router.push('/profiles');
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>
              </div>
              <Link
                href="/profiles"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View My Profiles →
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CVUpload onSuccess={handleSuccess} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
