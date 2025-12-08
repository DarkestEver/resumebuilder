'use client';

/**
 * Modern Dashboard Page
 * Main dashboard with stats, resumes, and quick actions
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { useUser, authStore } from '@/stores/authStore';
import { userApi } from '@/lib/api/user';
import { resumeApi, type Resume } from '@/lib/api/resume';
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  TrendingUp, 
  Lock, 
  Globe, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit,
  Upload,
  Sparkles,
  Target,
  User,
  ArrowRight,
  Share2,
  Link as LinkIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SubscriptionWidget } from '@/components/billing/SubscriptionWidget';
import { SlugManagerDialog } from '@/components/SlugManagerDialog';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();
  const isWelcome = searchParams.get('welcome') === 'true';

  const [stats, setStats] = useState({
    totalResumes: 0,
    publicResumes: 0,
    privateResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    profileCompletion: 0,
  });
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [slugManagerOpen, setSlugManagerOpen] = useState(false);
  const [selectedResumeForSlug, setSelectedResumeForSlug] = useState<Resume | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, resumesResponse] = await Promise.all([
        userApi.getUserStats(),
        resumeApi.getAllResumes(),
      ]);

      // Backend returns: { success, data: { resumeCount, publicResumeCount, totalViews, totalDownloads, profileCompletion } }
      const backendStats = statsResponse.data as any;
      setStats({
        totalResumes: backendStats.resumeCount || 0,
        publicResumes: backendStats.publicResumeCount || 0,
        privateResumes: (backendStats.resumeCount || 0) - (backendStats.publicResumeCount || 0),
        totalViews: backendStats.totalViews || 0,
        totalDownloads: backendStats.totalDownloads || 0,
        profileCompletion: backendStats.profileCompletion || 0,
      });
      
      // Backend returns: { success, data: { resumes: [] } }
      setResumes(resumesResponse.data.resumes || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await resumeApi.createResume({
        title: 'Untitled Resume',
        templateId: 'default',
      });
      toast.success('Resume created successfully');
      router.push(`/resume/${response.data.resume._id}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
      toast.error('Failed to create resume');
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeApi.deleteResume(id);
      setResumes(resumes.filter((r) => r._id !== id));
      toast.success('Resume deleted successfully');
      setActiveMenu(null);
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const handleDuplicateResume = async (id: string) => {
    try {
      const response = await resumeApi.duplicateResume(id);
      setResumes([response.data.resume, ...resumes]);
      toast.success('Resume duplicated successfully');
      setActiveMenu(null);
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  const openSlugManager = (resume: Resume) => {
    setSelectedResumeForSlug(resume);
    setSlugManagerOpen(true);
    setActiveMenu(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Email Verification Banner */}
        <EmailVerificationBanner />

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isWelcome ? `Welcome, ${user?.name}!` : 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isWelcome
                    ? 'Let\'s create your first professional resume'
                    : 'Manage your resumes and profile'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/profiles"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  My Profiles
                </Link>
                <Link
                  href="/upload-cv"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload CV
                </Link>
                <button
                  onClick={() => authStore.getState().logout()}
                  className="text-sm text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="mb-8">
            <SubscriptionWidget />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Total Resumes"
                  value={stats.totalResumes}
                  icon={<FileText className="w-5 h-5" />}
                  color="blue"
                />
                <StatCard
                  title="Public"
                  value={stats.publicResumes}
                  icon={<Globe className="w-5 h-5" />}
                  color="green"
                />
                <StatCard
                  title="Private"
                  value={stats.privateResumes}
                  icon={<Lock className="w-5 h-5" />}
                  color="purple"
                />
                <StatCard
                  title="Views"
                  value={stats.totalViews}
                  icon={<Eye className="w-5 h-5" />}
                  color="indigo"
                />
                <StatCard
                  title="Downloads"
                  value={stats.totalDownloads}
                  icon={<Download className="w-5 h-5" />}
                  color="pink"
                />
                <StatCard
                  title="Profile"
                  value={`${stats.profileCompletion}%`}
                  icon={<TrendingUp className="w-5 h-5" />}
                  color="orange"
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={handleCreateResume}
              className="group relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <Plus className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Create New Resume</h3>
              <p className="text-white/90">Start from scratch or use a template</p>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
            </button>

            <Link
              href="/upload-cv"
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <Upload className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload CV</h3>
              <p className="text-gray-600">Extract data from existing resume</p>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
            </Link>

            <Link
              href="/profile"
              className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
            >
              <Target className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Build Profile</h3>
              <p className="text-gray-600">Complete your professional profile</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-purple-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/profile"
                className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-purple-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Profile</h3>
                <p className="text-sm text-gray-600">Complete your professional profile</p>
              </Link>

              <Link
                href="/upload-cv"
                className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-green-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CV</h3>
                <p className="text-sm text-gray-600">Import profile data from your existing CV</p>
              </Link>

              <Link
                href="/templates"
                className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-blue-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Templates</h3>
                <p className="text-sm text-gray-600">Choose from 20+ professional designs</p>
              </Link>
            </div>
          </div>

          {/* All Features Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Features</h2>
                <p className="text-sm text-gray-600 mt-1">Explore all available tools and features</p>
              </div>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/templates"
                className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-purple-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-purple-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-purple-200 text-purple-700 rounded-full">Popular</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Templates</h3>
                <p className="text-sm text-gray-600">20+ professional resume designs</p>
              </Link>

              <Link
                href="/cv-upload"
                className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-blue-300"
              >
                <div className="p-3 bg-blue-500 text-white rounded-xl group-hover:scale-110 transition-transform mb-3 inline-block">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">CV Upload</h3>
                <p className="text-sm text-gray-600">Extract data from existing resume</p>
              </Link>

              <Link
                href="/optimize"
                className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-green-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-green-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-200 text-green-700 rounded-full">AI</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Optimizer</h3>
                <p className="text-sm text-gray-600">Score & improve your resume</p>
              </Link>

              <Link
                href="/video-profile"
                className="group p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-red-300"
              >
                <div className="p-3 bg-red-500 text-white rounded-xl group-hover:scale-110 transition-transform mb-3 inline-block">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Video Profile</h3>
                <p className="text-sm text-gray-600">Add video introduction</p>
              </Link>

              <Link
                href="/cover-letter"
                className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-yellow-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-yellow-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-200 text-yellow-700 rounded-full">AI</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cover Letter</h3>
                <p className="text-sm text-gray-600">AI-powered cover letters</p>
              </Link>

              <Link
                href="/advanced"
                className="group p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-indigo-500 text-white rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-200 text-indigo-700 rounded-full">Pro</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Job Matcher</h3>
                <p className="text-sm text-gray-600">Match resume to job descriptions</p>
              </Link>
            </div>
          </div>

          {/* Resumes Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Each resume is a separate document. Create multiple versions for different jobs.
                </p>
              </div>
              <button
                onClick={handleCreateResume}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Resume</span>
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Start by creating your first resume. You can create multiple resumes with different templates and customizations for different job applications.
                </p>
                <div className="mb-6 max-w-lg mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your profile data (experience, education, skills) is stored once</li>
                    <li>• Each resume uses that profile data with different templates & styles</li>
                    <li>• Edit your profile in "Build Profile" to update all resumes</li>
                  </ul>
                </div>
                <button
                  onClick={handleCreateResume}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume._id}
                    resume={resume}
                    onDelete={handleDeleteResume}
                    onDuplicate={handleDuplicateResume}
                    onManageSlug={openSlugManager}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Slug Manager Dialog */}
        {selectedResumeForSlug && (
          <SlugManagerDialog
            resume={selectedResumeForSlug}
            isOpen={slugManagerOpen}
            onClose={() => {
              setSlugManagerOpen(false);
              setSelectedResumeForSlug(null);
            }}
            onUpdate={fetchDashboardData}
          />
        )}        {/* Slug Manager Dialog */}
        {selectedResumeForSlug && (
          <SlugManagerDialog
            resume={selectedResumeForSlug}
            isOpen={slugManagerOpen}
            onClose={() => {
              setSlugManagerOpen(false);
              setSelectedResumeForSlug(null);
            }}
            onUpdate={fetchDashboardData}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'pink' | 'orange';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

// Resume Card Component
interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onManageSlug: (resume: Resume) => void;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}

function ResumeCard({ resume, onDelete, onDuplicate, onManageSlug, activeMenu, setActiveMenu }: ResumeCardProps) {
  const router = useRouter();

  const copyShareLink = () => {
    if (resume.shortId && resume.visibility === 'public') {
      const link = `${window.location.origin}/r/${resume.shortId}`;
      navigator.clipboard.writeText(link);
      toast.success('Share link copied!');
      setActiveMenu(null);
    } else {
      toast.error('Resume must be public to share');
    }
  };

  return (
    <div className="group bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Resume Preview */}
      <div className="bg-white p-6 h-48 flex items-center justify-center border-b border-gray-200">
        <FileText className="w-16 h-16 text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>

      {/* Resume Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === resume._id ? null : resume._id || '')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {activeMenu === resume._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                <button
                  onClick={() => resume._id && router.push(`/resume/${resume._id}`)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => resume._id && onDuplicate(resume._id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => onManageSlug(resume)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Manage Links
                </button>
                {resume.visibility === 'public' && resume.shortId && (
                  <button
                    onClick={copyShareLink}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Copy Share Link
                  </button>
                )}
                <button
                  onClick={() => resume._id && onDelete(resume._id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{resume.viewCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{resume.downloadCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            {resume.visibility === 'public' ? (
              <Globe className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        <button
          onClick={() => resume._id && router.push(`/resume/${resume._id}`)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit Resume
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
