# Resume Builder - Frontend

Modern, AI-powered resume builder with 20+ templates, CV extraction, video profiles, and public sharing.

## 🚀 Features Implemented

### ✅ Authentication System (Phase 11.1)
- **Email/Password Login**: Traditional authentication with JWT tokens
- **OTP Login**: Passwordless login with 6-digit OTP (5-minute expiry)
- **User Registration**: Email verification, password strength validation
- **Forgot Password**: Password reset via email with 1-hour token
- **Email Verification**: Verification banner + resend option
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Token Refresh**: Automatic access token refresh on 401 errors

### ✅ Dashboard (Phase 11.2)
- **User Stats**: Total resumes, views, downloads, profile completion
- **Resume Management**: Create, edit, delete, duplicate resumes
- **Quick Actions**: One-click resume creation
- **Profile Alerts**: Prompts for <50% profile completion
- **Resume Cards**: Visual grid with visibility badges

### 🔜 Coming Soon
- Profile Builder UI (13 sections)
- Resume Editor with templates
- CV Upload & Parsing
- AI-powered content enhancement
- PDF export
- Public profile pages

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.0 | React framework with App Router |
| React | 18.3.0 | UI library |
| TypeScript | 5.3.3 | Type safety |
| TailwindCSS | 3.4.1 | Styling |
| Zustand | 4.5.0 | State management |
| React Hook Form | 7.50.0 | Form handling |
| Zod | 3.22.4 | Schema validation |
| Axios | 1.6.5 | HTTP client |
| ShadCN UI | Latest | Component library |

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Resume Builder
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages group
│   │   │   ├── login/           # Login page (password + OTP)
│   │   │   ├── register/        # Registration page
│   │   │   ├── forgot-password/ # Forgot password page
│   │   │   ├── reset-password/  # Reset password page
│   │   │   ├── verify-email/    # Email verification page
│   │   │   └── layout.tsx       # Auth layout with branding
│   │   ├── dashboard/           # Protected dashboard
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   └── auth/                # Auth components
│   │       ├── ProtectedRoute.tsx
│   │       └── EmailVerificationBanner.tsx
│   ├── lib/
│   │   └── api/                 # API clients
│   │       ├── auth.ts          # 11 auth endpoints
│   │       ├── user.ts          # User management
│   │       ├── resume.ts        # Resume CRUD
│   │       └── profile.ts       # Profile management
│   └── stores/
│       └── authStore.ts         # Zustand auth store
├── .env.local                   # Environment variables
└── package.json                 # Dependencies
```

---

## 🔐 Authentication Flow

### 1. Login with Email/Password
```typescript
import { authStore } from '@/stores/authStore';

// In your component
const handleLogin = async (email: string, password: string) => {
  await authStore.getState().login(email, password);
  router.push('/dashboard');
};
```

### 2. Login with OTP
```typescript
// Request OTP
await authApi.requestOTP({ email });

// Verify OTP (6-digit code)
await authStore.getState().loginWithOTP(email, otp);
```

### 3. Protected Routes
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### 4. Accessing User Data
```typescript
import { useUser, useIsAuthenticated } from '@/stores/authStore';

function ProfileHeader() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  return <div>Welcome, {user?.name}!</div>;
}
```

---

## 🌐 API Integration

### Authentication API Client
Located at `src/lib/api/auth.ts`

**Available Methods:**
- `authApi.register(data)` - Register new user
- `authApi.login(data)` - Login with email/password
- `authApi.requestOTP(data)` - Request OTP for email
- `authApi.verifyOTP(data)` - Verify OTP and login
- `authApi.refreshToken(token)` - Refresh access token
- `authApi.logout()` - Logout user
- `authApi.forgotPassword(data)` - Request password reset
- `authApi.resetPassword(data)` - Reset password with token
- `authApi.verifyEmail(token)` - Verify email address
- `authApi.resendVerification()` - Resend verification email
- `authApi.getCurrentUser()` - Get current user data

### User API Client
Located at `src/lib/api/user.ts`

**Available Methods:**
- `userApi.getCurrentUser()` - Get user with profile
- `userApi.updateUser(data)` - Update user profile
- `userApi.getUserStats()` - Get user statistics
- `userApi.deleteAccount()` - Delete user account
- `userApi.uploadProfilePhoto(file)` - Upload profile photo

### Resume API Client
Located at `src/lib/api/resume.ts`

**Available Methods:**
- `resumeApi.getAllResumes()` - Get all user resumes
- `resumeApi.getResume(id)` - Get single resume
- `resumeApi.createResume(data)` - Create new resume
- `resumeApi.updateResume(id, data)` - Update resume
- `resumeApi.deleteResume(id)` - Delete resume
- `resumeApi.duplicateResume(id)` - Duplicate resume
- `resumeApi.updateVisibility(id, visibility)` - Change visibility
- `resumeApi.getPublicResume(shortId)` - Get public resume
- `resumeApi.generatePDF(id)` - Export to PDF (Phase 7)
- `resumeApi.tailorResume(id, jobDescription)` - Tailor for job (Phase 6)

### Profile API Client
Located at `src/lib/api/profile.ts`

**Available Methods:**
- `profileApi.getProfile()` - Get user profile
- `profileApi.createProfile(data)` - Create profile
- `profileApi.updateProfile(data)` - Update entire profile
- `profileApi.deleteProfile()` - Delete profile
- `profileApi.updateSection(section, data)` - Update specific section
- `profileApi.getCompletion()` - Get completion percentage

---

## 🎨 UI Components

### ProtectedRoute
Redirects unauthenticated users to login page

```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

### EmailVerificationBanner
Shows banner when email is not verified

```tsx
<EmailVerificationBanner />
```

### Auth Layout
Provides consistent branding for auth pages
- Automatic wrapping for pages in `(auth)` group
- Logo/brand in top-left
- Footer at bottom

---

## 🧪 Form Validation

All forms use **React Hook Form** + **Zod** for validation.

### Example: Login Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const form = useForm<LoginForm>({
  resolver: zodResolver(loginSchema),
});
```

### Password Validation Rules
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

## 🔄 State Management

### Zustand Auth Store
Located at `src/stores/authStore.ts`

**State:**
- `user` - Current user object
- `accessToken` - JWT access token (15min)
- `refreshToken` - Refresh token (7 days)
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state
- `error` - Error message

**Actions:**
- `setUser(user)` - Update user
- `setTokens(access, refresh)` - Update tokens
- `login(email, password)` - Login user
- `register(name, email, password)` - Register user
- `loginWithOTP(email, otp)` - OTP login
- `logout()` - Logout and clear state
- `refreshAccessToken()` - Refresh token
- `fetchUser()` - Fetch current user

**Persistence:**
- Stored in localStorage as `auth-storage`
- Automatically rehydrated on page load

---

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing (future)
npm test                 # Run tests
npm run test:e2e         # Run E2E tests
```

---

## 🌍 Environment Variables

Create `.env.local` with these variables:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional
NEXT_PUBLIC_APP_NAME=Resume Builder
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_TRACKING_ID=your-google-analytics-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/stores/authStore'"
**Solution:** Ensure TypeScript paths are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: API requests failing with CORS error
**Solution:** Ensure backend CORS is configured for `http://localhost:3000`

### Issue: Token refresh not working
**Solution:** Check that refresh token is stored in Zustand and not expired (7-day limit)

### Issue: Login redirects to login again
**Solution:** Check that `accessToken` and `refreshToken` are persisted in localStorage

---

## 📝 Code Examples

### Creating a New Resume
```typescript
import { resumeApi } from '@/lib/api/resume';

const handleCreateResume = async () => {
  try {
    const response = await resumeApi.createResume({
      title: 'My Resume',
      templateId: 'modern-template',
    });
    console.log('Created:', response.data.resume);
  } catch (error) {
    console.error('Failed to create resume:', error);
  }
};
```

### Updating User Profile
```typescript
import { userApi } from '@/lib/api/user';

const handleUpdateProfile = async () => {
  try {
    await userApi.updateUser({
      name: 'John Doe',
      phone: '+1234567890',
    });
    console.log('Profile updated!');
  } catch (error) {
    console.error('Failed to update:', error);
  }
};
```

### Getting User Stats
```typescript
import { userApi } from '@/lib/api/user';

const fetchStats = async () => {
  const response = await userApi.getUserStats();
  const { totalResumes, totalViews, profileCompletion } = response.data.stats;
  console.log(`${totalResumes} resumes, ${totalViews} views, ${profileCompletion}% complete`);
};
```

---

## 🎯 Next Development Phase

### Phase 11.3: Profile Builder UI
**Sections to implement:**
1. Personal Info (name, title, photo)
2. Contact (email, phone, address, socials)
3. Summary (rich text editor)
4. Experience (array with add/remove)
5. Education (array with add/remove)
6. Skills (grouped by category)
7. Projects (with tech stack)
8. Certifications (with expiry dates)
9. Achievements (bullet points)
10. Languages (proficiency levels)
11. Courses (online/offline)
12. Publications (academic)
13. Patents (IP)

**Features:**
- Auto-save with 2-second debounce
- Progress indicator (% complete)
- Section reordering
- Drag-drop for array items
- Rich text for descriptions

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

**Development:** AI-Assisted Development Platform  
**Status:** Active Development (45% Complete)

---

**Last Updated:** December 4, 2025
