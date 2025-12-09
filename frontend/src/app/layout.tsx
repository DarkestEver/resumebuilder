import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/print.css';
import { Toaster } from 'sonner';
import HashRouteHandler from '@/components/HashRouteHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProfileBuilder - AI-Powered Resume Builder',
  description: 'Create professional resumes with AI assistance, 20+ templates, and ATS optimization',
  keywords: ['resume builder', 'CV maker', 'AI resume', 'ATS optimization', 'job application'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.9,
  maximumScale: 1.0,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <HashRouteHandler />
        <div id="main-content">
          {children}
        </div>
        <Toaster position="top-right" richColors expand={true} />
      </body>
    </html>
  );
}
