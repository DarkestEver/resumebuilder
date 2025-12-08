'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authStore } from '@/stores/authStore';
import { activityApi } from '@/lib/api/activity';
import { Bell, ChevronDown, FileText, Upload, Sparkles, Video, LayoutTemplate, Target, User, Settings, Menu, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = authStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const count = await activityApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Resume Builder</span>
            </Link>

            {/* Main Navigation - Desktop */}
            {user && (
              <div className="hidden lg:flex items-center space-x-1">
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">
                  Dashboard
                </Link>
                <Link href="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">
                  Profile
                </Link>
                <Link href="/resume" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">
                  Resumes
                </Link>
                
                {/* Tools Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
                  >
                    Tools
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showToolsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowToolsMenu(false)} />
                      <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <Link href="/templates" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <LayoutTemplate className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Templates</div>
                            <div className="text-xs text-gray-500">20+ professional designs</div>
                          </div>
                        </Link>
                        <Link href="/cv-upload" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <Upload className="w-4 h-4" />
                          <div>
                            <div className="font-medium">CV Upload</div>
                            <div className="text-xs text-gray-500">Extract data from existing CV</div>
                          </div>
                        </Link>
                        <Link href="/optimize" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <Target className="w-4 h-4" />
                          <div>
                            <div className="font-medium">ATS Optimizer</div>
                            <div className="text-xs text-gray-500">Score & improve your resume</div>
                          </div>
                        </Link>
                        <Link href="/video-profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <Video className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Video Profile</div>
                            <div className="text-xs text-gray-500">Add video introduction</div>
                          </div>
                        </Link>
                        <Link href="/cover-letter" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <FileText className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Cover Letter</div>
                            <div className="text-xs text-gray-500">AI-powered cover letters</div>
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 my-2" />
                        <Link href="/pricing" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setShowToolsMenu(false)}>
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <div>
                            <div className="font-medium">Upgrade to Pro</div>
                            <div className="text-xs text-gray-500">Unlock all features</div>
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notification Bell */}
                <Link href="/activity" className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu - Desktop */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowProfileMenu(false)}>
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowProfileMenu(false)}>
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-200 my-2" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition"
                >
                  {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <>
                <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Pricing
                </Link>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && user && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <Link href="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                My Profile
              </Link>
              <Link href="/resume" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                Resumes
              </Link>
              
              <div className="pt-2 pb-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
                <Link href="/templates" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <LayoutTemplate className="w-4 h-4" />
                  Templates
                </Link>
                <Link href="/cv-upload" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Upload className="w-4 h-4" />
                  CV Upload
                </Link>
                <Link href="/optimize" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Target className="w-4 h-4" />
                  ATS Optimizer
                </Link>
                <Link href="/video-profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Video className="w-4 h-4" />
                  Video Profile
                </Link>
                <Link href="/cover-letter" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <FileText className="w-4 h-4" />
                  Cover Letter
                </Link>
                <Link href="/advanced" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Sparkles className="w-4 h-4" />
                  Job Matcher
                </Link>
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link href="/activity" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={closeMobileMenu}>
                  <Bell className="w-4 h-4" />
                  Activity
                  {unreadCount > 0 && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 text-left rounded-lg">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
