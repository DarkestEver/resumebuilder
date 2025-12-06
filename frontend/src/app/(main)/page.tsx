'use client';

import Link from 'next/link';
import { authStore } from '@/stores/authStore';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Users, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  Target,
  Award
} from 'lucide-react';

export default function HomePage() {
  const { user } = authStore();

  if (user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Welcome Hero */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user.name}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Continue building your professional presence with our AI-powered tools
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Link
                href="/profile"
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Build Your Profile
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your personal info, experience, education, and skills
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/resume"
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Create Resumes
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Choose from 20+ professional templates and customize
                  </p>
                  <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                    Explore Templates <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard"
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    View Dashboard
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Manage your resumes, track stats, and view insights
                  </p>
                  <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-2 transition-transform">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section */}
            <AnimatedSection className="mt-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Powerful Features at Your Fingertips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="AI-Powered Content"
                  description="Get AI-assisted resume content and personalized suggestions"
                  color="blue"
                />
                <FeatureCard
                  icon={<FileText className="w-6 h-6" />}
                  title="20+ Templates"
                  description="Professional designs for every career and industry"
                  color="purple"
                />
                <FeatureCard
                  icon={<Shield className="w-6 h-6" />}
                  title="ATS Optimized"
                  description="Pass through Applicant Tracking Systems easily"
                  color="emerald"
                />
                <FeatureCard
                  icon={<Zap className="w-6 h-6" />}
                  title="Instant Export"
                  description="Export to PDF or share your public profile link"
                  color="orange"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Resume Builder</span>
              <Award className="w-4 h-4" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Your Perfect<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Professional Resume
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Build stunning resumes in minutes with AI-powered content suggestions,
              20+ professional templates, and ATS optimization
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <AnimatedSection className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to create professional resumes that stand out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI-Powered Content"
              description="Get intelligent suggestions for resume content, keywords, and formatting tailored to your industry"
              color="blue"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="20+ Professional Templates"
              description="Choose from a wide variety of modern, classic, and creative designs for every profession"
              color="purple"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="ATS Optimization"
              description="Ensure your resume passes Applicant Tracking Systems with our optimized formatting"
              color="emerald"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="One-Click Export"
              description="Download your resume as PDF or share a public link instantly"
              color="orange"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Public Profile"
              description="Create a beautiful online profile to share with recruiters and networking contacts"
              color="pink"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Analytics & Insights"
              description="Track views, downloads, and engagement on your shared resumes"
              color="indigo"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Your Resume in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes, no experience needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Build Your Profile"
              description="Enter your work experience, education, skills, and achievements. Our AI helps you write compelling content."
              icon={<Briefcase className="w-10 h-10" />}
            />
            <StepCard
              number="2"
              title="Choose a Template"
              description="Select from 20+ professional templates designed for different industries and career levels."
              icon={<FileText className="w-10 h-10" />}
            />
            <StepCard
              number="3"
              title="Export & Share"
              description="Download as PDF, share your public profile, or get a custom URL for networking."
              icon={<Zap className="w-10 h-10" />}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Resumes Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-blue-100">Templates</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Support</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of professionals who have landed their dream jobs
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-lg"
          >
            Start Building Now - It's Free
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink' | 'indigo';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 group-hover:shadow-blue-200',
    purple: 'from-purple-500 to-purple-600 group-hover:shadow-purple-200',
    emerald: 'from-emerald-500 to-emerald-600 group-hover:shadow-emerald-200',
    orange: 'from-orange-500 to-orange-600 group-hover:shadow-orange-200',
    pink: 'from-pink-500 to-pink-600 group-hover:shadow-pink-200',
    indigo: 'from-indigo-500 to-indigo-600 group-hover:shadow-indigo-200',
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {number}
        </div>
        <div className="text-blue-600 mb-4 mt-4">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
