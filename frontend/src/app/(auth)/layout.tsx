/**
 * Auth Layout
 * Layout for authentication pages (login, register, etc.)
 */

import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header with Logo */}
      <header className="p-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Resume Builder</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="p-6">
        <div className="text-center text-sm text-gray-500">
          © 2025 Resume Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
