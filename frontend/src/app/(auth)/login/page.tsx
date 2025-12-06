'use client';

/**
 * Modern Login Page
 * Supports email/password and OTP login methods
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api/auth';

// Validation schemas
const emailPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type EmailPasswordForm = z.infer<typeof emailPasswordSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email/Password form
  const passwordForm = useForm<EmailPasswordForm>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // OTP form
  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // Handle email/password login
  const handlePasswordLogin = async (data: EmailPasswordForm) => {
    setGeneralError(null);
    setIsLoading(true);

    try {
      await authStore.getState().login(data.email, data.password);
      toast.success('Welcome back!');
      
      // Small delay to ensure store hydration completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setGeneralError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Request OTP
  const handleRequestOTP = async () => {
    const email = otpForm.getValues('email');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      otpForm.setError('email', { message: 'Please enter a valid email address' });
      return;
    }

    setGeneralError(null);
    setIsLoading(true);

    try {
      await authApi.requestOTP({ email });
      setOtpSent(true);
      setOtpEmail(email);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      setGeneralError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP login
  const handleOTPLogin = async (data: OTPForm) => {
    setGeneralError(null);
    setIsLoading(true);

    try {
      await authStore.getState().loginWithOTP(data.email, data.otp);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setGeneralError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset OTP flow
  const resetOTPFlow = () => {
    setOtpSent(false);
    setOtpEmail('');
    otpForm.reset();
  };

  // Handle LinkedIn OAuth
  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/linkedin');
      if (response.data.success && response.data.data.authUrl) {
        // Redirect to LinkedIn authorization URL
        window.location.href = response.data.data.authUrl;
      } else {
        throw new Error('Failed to get LinkedIn authorization URL');
      }
    } catch (error: any) {
      toast.error('LinkedIn login is currently unavailable');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue building your profile
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                loginMethod === 'password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                loginMethod === 'otp'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              OTP
            </button>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
              {generalError}
            </div>
          )}

          {/* Password Login Form */}
          {loginMethod === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...passwordForm.register('email')}
                      type="email"
                      id="email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  {passwordForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...passwordForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Login Form */}
          {loginMethod === 'otp' && (
            <form onSubmit={otpForm.handleSubmit(handleOTPLogin)} className="space-y-6">
              {!otpSent ? (
                <>
                  <div>
                    <label htmlFor="email-otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...otpForm.register('email')}
                        type="email"
                        id="email-otp"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    {otpForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{otpForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    OTP sent to <span className="font-semibold">{otpEmail}</span>. Please check your email.
                  </div>

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      {...otpForm.register('otp')}
                      type="text"
                      id="otp"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold"
                      placeholder="000000"
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="mt-1 text-sm text-red-600">{otpForm.formState.errors.otp.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetOTPFlow}
                      className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Social Login Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* LinkedIn OAuth Button */}
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 border-2 border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow"
          >
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <span>Sign in with LinkedIn</span>
          </button>

          {/* Footer Links */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image/Design */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -right-48 animate-pulse-slow" />
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-48 -left-48 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Build Your Perfect<br />Professional Resume
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-md">
            Create stunning resumes in minutes with AI-powered content suggestions and 20+ professional templates
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="text-lg">AI-powered content suggestions</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="text-lg">20+ professional templates</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="text-lg">ATS-optimized formatting</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="text-lg">Export & share instantly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
