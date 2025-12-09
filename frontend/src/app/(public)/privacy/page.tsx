import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Last updated: December 9, 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-6">
              Welcome to Resume Builder ("we," "our," or "us"). We are committed to protecting your personal information 
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our resume building platform.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Personal Information</h3>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Name, email address, and username</li>
              <li>Resume content (work experience, education, skills, etc.)</li>
              <li>Profile photo and video profile (if provided)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">When you use our services, we automatically collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>IP address and location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide, maintain, and improve our resume building services</li>
              <li>Process your transactions and manage your account</li>
              <li>Generate AI-powered resume enhancements and suggestions</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Service Providers:</strong> Third-party companies that help us provide our services (e.g., payment processors, AI providers, hosting services)</li>
              <li><strong>Public Profiles:</strong> Information you choose to make public through shared resume links</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">5. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure file upload and virus scanning</li>
            </ul>
            <p className="text-gray-600 mb-6">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, 
              we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">6. Your Rights and Choices</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your resume data in PDF or JSON format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 mt-8">7. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. 
              You can control cookies through your browser settings, but disabling them may affect functionality.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">8. Third-Party Services</h2>
            <p className="text-gray-600 mb-4">Our platform integrates with third-party services:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>AI providers (OpenAI, Anthropic, Google Gemini) for content enhancement</li>
              <li>Payment processors (Stripe) for subscription management</li>
              <li>OAuth providers (Google, LinkedIn, GitHub) for authentication</li>
              <li>Cloud storage providers for file hosting</li>
            </ul>
            <p className="text-gray-600 mb-6">
              These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not intended for users under 16 years of age. We do not knowingly collect personal information 
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">10. International Data Transfers</h2>
            <p className="text-gray-600 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">11. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain your personal information for as long as your account is active or as needed to provide services. 
              After account deletion, we may retain certain information for legal and business purposes.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">12. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through 
              our platform. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">13. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600"><strong>Email:</strong> privacy@resumebuilder.com</p>
              <p className="text-gray-600 mt-2"><strong>Address:</strong> 123 Business Ave, Suite 100, New York, NY 10001</p>
              <p className="text-gray-600 mt-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
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
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
