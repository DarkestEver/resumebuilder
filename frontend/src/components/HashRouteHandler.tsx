'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PublicResumeView to avoid SSR issues
const PublicResumeView = dynamic(() => import('./PublicResumeView'), { ssr: false });

export default function HashRouteHandler() {
  const [mounted, setMounted] = useState(false);
  const [resumeParams, setResumeParams] = useState<{ username?: string; slug: string } | null>(null);
  const [isHashRoute, setIsHashRoute] = useState(false);

  // Check for hash route immediately on mount (before hydration)
  useEffect(() => {
    // Quick check to hide content while loading
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/') && window.location.hash.length > 2) {
      setIsHashRoute(true);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Check if hash is a slug route (e.g., #/username/slug or #/slug)
      if (hash.startsWith('#/') && hash.length > 2) {
        const path = hash.substring(2); // Remove #/
        
        // Check if it's username/slug format or just slug
        const parts = path.split('/');
        
        setIsHashRoute(true);
        
        if (parts.length === 2) {
          // Format: #/username/slug
          const [username, slug] = parts;
          setResumeParams({ username, slug });
        } else {
          // Format: #/slug (backward compatibility)
          setResumeParams({ slug: path });
        }
      } else {
        setIsHashRoute(false);
        setResumeParams(null);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [mounted]);

  // If we have resume params, render the public resume view as full-screen overlay
  if (isHashRoute && resumeParams) {
    return (
      <>
        <div id="hash-route-active" style={{ display: 'none' }} />
        <PublicResumeView username={resumeParams.username} slug={resumeParams.slug} />
      </>
    );
  }

  // If checking for hash route, show nothing to prevent flash
  if (isHashRoute && !resumeParams) {
    return (
      <>
        <div id="hash-route-active" style={{ display: 'none' }} />
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return null;
}
