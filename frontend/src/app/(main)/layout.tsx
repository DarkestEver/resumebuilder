/**
 * Main App Layout
 * Layout for main application pages with header navigation
 */

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
