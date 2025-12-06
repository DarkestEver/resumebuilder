/**
 * Protected Route Middleware
 * Redirects unauthenticated users to login
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore } from '@/stores/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, accessToken } = authStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for store to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only check auth after store has hydrated
    if (isHydrated && !isLoading && !isAuthenticated && !accessToken) {
      // Store intended destination
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, accessToken, isHydrated, router, pathname]);

  // Show loading spinner while checking auth or hydrating
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && !accessToken) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
