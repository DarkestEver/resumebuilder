'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStore } from '@/stores/authStore';
import { toast } from '@/components/ui/use-toast';

/**
 * LinkedIn OAuth Callback Handler
 * Receives tokens from backend and saves to auth store
 */
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const isNewUser = searchParams.get('isNewUser') === 'true';

      if (!accessToken || !refreshToken) {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid authentication response',
        });
        router.push('/login');
        return;
      }

      try {
        // Set tokens in auth store
        authStore.getState().setTokens(accessToken, refreshToken);
        
        // Fetch user data
        await authStore.getState().fetchUser();

        toast({
          title: 'Success!',
          description: isNewUser 
            ? 'Account created successfully! Welcome aboard.' 
            : 'Logged in with LinkedIn successfully!',
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete authentication',
        });
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing LinkedIn authentication...</p>
      </div>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
