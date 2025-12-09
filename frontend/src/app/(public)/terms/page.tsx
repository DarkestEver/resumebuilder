import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">Resume Builder</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-gray-600 mt-2">Last updated: December 9, 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing or using Resume Builder ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">Resume Builder provides:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>AI-powered resume creation and enhancement tools</li>
              <li>32+ professional resume templates</li>
              <li>ATS optimization and scoring</li>
              <li>CV upload and data extraction</li>
              <li>Public profile sharing capabilities</li>
              <li>Video profile integration</li>
              <li>Cover letter generation</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">3. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-gray-600 mb-4">To use certain features, you must:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 16 years of age</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Termination</h3>
            <p className="text-gray-600 mb-6">
              We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent 
              activity, or abuse our services.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">4. Subscription Plans and Payments</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Plan Types</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Free Plan:</strong> Limited features, 3 basic templates, watermarked exports</li>
              <li><strong>Pro Plan:</strong> All templates, unlimited AI credits, advanced features</li>
              <li><strong>Enterprise Plan:</strong> Team features, custom branding, priority support</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Billing</h3>
            <p className="text-gray-600 mb-6">
              Subscription fees are billed in advance on a monthly or annual basis. You authorize us to charge your payment 
              method for all fees. Prices are subject to change with 30 days' notice.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Refund Policy</h3>
            <p className="text-gray-600 mb-6">
              We offer a 7-day money-back guarantee for first-time subscribers. Refund requests must be submitted within 
              7 days of initial purchase. Subsequent renewals are non-refundable.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">5. User Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Your Content</h3>
            <p className="text-gray-600 mb-6">
              You retain ownership of all content you upload (resumes, photos, videos). By using our Service, you grant 
              us a license to use, store, and process your content solely to provide our services.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Public Content</h3>
            <p className="text-gray-600 mb-6">
              Content you choose to share publicly (via public profile links) may be viewed by others. You are responsible 
              for ensuring you have the right to share such content.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Our Intellectual Property</h3>
            <p className="text-gray-600 mb-6">
              The Service, including templates, software, logos, and design, is protected by copyright and other intellectual 
              property laws. You may not copy, modify, or distribute our content without permission.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">6. Acceptable Use Policy</h2>
            <p className="text-gray-600 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Use the Service for illegal purposes</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Attempt to bypass security measures</li>
              <li>Scrape, harvest, or collect user data</li>
              <li>Impersonate others or provide false information</li>
              <li>Abuse AI features (e.g., generating spam content)</li>
              <li>Share account credentials with unauthorized users</li>
              <li>Reverse engineer or decompile our software</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">7. AI-Generated Content</h2>
            <p className="text-gray-600 mb-6">
              Our AI features provide suggestions and enhancements. While we strive for accuracy, AI-generated content may 
              contain errors. You are responsible for reviewing and verifying all content before use. We do not guarantee 
              job placement or interview success.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">8. Privacy and Data Protection</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> explains 
              how we collect, use, and protect your personal information. By using the Service, you consent to our data practices.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">9. Third-Party Services</h2>
            <p className="text-gray-600 mb-6">
              Our Service integrates with third-party providers (payment processors, AI APIs, OAuth providers). We are not 
              responsible for the availability, accuracy, or practices of third-party services.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RESUME BUILDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION. 
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE PAST 12 MONTHS.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">11. Disclaimers</h2>
            <p className="text-gray-600 mb-6">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE UNINTERRUPTED ACCESS, 
              ERROR-FREE OPERATION, OR THAT THE SERVICE MEETS YOUR REQUIREMENTS. WE MAKE NO WARRANTIES ABOUT JOB PLACEMENT 
              OR CAREER SUCCESS.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">12. Indemnification</h2>
            <p className="text-gray-600 mb-6">
              You agree to indemnify and hold harmless Resume Builder from any claims, damages, losses, or expenses arising 
              from your use of the Service, violation of these Terms, or infringement of any rights.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">13. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may modify these Terms at any time. Material changes will be communicated via email or platform notification. 
              Continued use after changes constitutes acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">14. Governing Law and Disputes</h2>
            <p className="text-gray-600 mb-6">
              These Terms are governed by the laws of the State of New York, USA. Any disputes will be resolved through 
              binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">15. Severability</h2>
            <p className="text-gray-600 mb-6">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain 
              in full force and effect.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">16. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms, please contact:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600"><strong>Email:</strong> legal@resumebuilder.com</p>
              <p className="text-gray-600 mt-2"><strong>Address:</strong> 123 Business Ave, Suite 100, New York, NY 10001</p>
              <p className="text-gray-600 mt-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mt-8">
              <p className="text-gray-700">
                <strong>By using Resume Builder, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms of Service.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
