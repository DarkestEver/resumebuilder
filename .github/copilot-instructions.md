# Copilot Instructions - Resume Builder Portal

## Project Overview
AI-powered Resume Builder Portal with CV extraction, 20+ templates, video profiles, public sharing, and subscription tiers. Full-stack application with AI enhancement, ATS optimization, and tailored resume generation for job descriptions.

## Architecture

### Frontend (Next.js + React)
- **SSR for public resumes**: `/[username]` and `/r/[id]` routes use getServerSideProps for SEO
- **State management**: Zustand/Redux for resume editor, profile data, and template selection
- **UI**: TailwindCSS + ShadCN components for consistent design system
- **PDF rendering**: React-PDF or HTML-to-PDF engine for resume exports

### Backend (Node.js)
- **Primary API**: Express/NestJS with REST/GraphQL endpoints
- **AI microservice**: Python service for CV extraction, content enhancement, ATS scoring
- **Webhooks**: Async processing for file uploads, AI operations, template rendering

### Database
- **Primary DB**: MongoDB (flexible resume schemas) OR PostgreSQL (relational user/subscription data)
- **Cache layer**: Redis for sessions, JWT tokens, rate limiting, AI response caching
- **File storage**: S3/GCP Storage for CVs, videos, profile photos, generated PDFs

### Security
- JWT + Refresh Token pattern for auth
- ClamAV for uploaded file scanning
- Rate limiting on AI endpoints (per plan tier)
- Privacy settings enforcement on public profiles

## Key Modules & Data Flow

### 1. Resume Editor Flow
`Profile Builder` → `Template Selector` → `AI Enhancements` → `Export/Share`
- Profile data stored centrally, reused across all resumes
- Each resume references profile + has template + customization overrides

### 2. CV Upload → Extraction
`File Upload` → `OCR (if image/scan)` → `AI Section Detection` → `Auto-populate Profile`
- Supported: PDF, DOCX, DOC, RTF, TXT, JPG, PNG, LinkedIn exports, Europass
- AI extracts: experience, education, skills, summary, projects, certifications

### 3. Tailored Resume Generation
`Job Description Input` → `Keyword Extraction` → `Profile Matching` → `AI Rewrite` → `Tailored PDF`
- Inputs: CSV, JD text, screenshot (OCR), job URL
- Output: Keyword match report + ATS-optimized resume

### 4. Public Profile System
`user.com/username` OR `user.com/r/xyz123`
- Privacy: Public, Private, Password-protected, Expiring links
- Analytics: visits, downloads, location, device, section engagement
- QR code generation for physical resume distribution

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Required: DATABASE_URL, REDIS_URL, JWT_SECRET, AI_API_KEY, S3_BUCKET, STRIPE_KEY

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev              # Next.js frontend (port 3000)
npm run server:dev       # Backend API (port 5000)
python ai_service/main.py  # AI microservice (port 8000)
```

### Testing
```bash
npm test                 # Unit tests (Jest)
npm run test:e2e         # E2E tests (Playwright/Cypress)
npm run test:ai          # AI service tests
```

### Build & Deploy
```bash
npm run build            # Production build
npm run start            # Production server
```

## Code Conventions

### Resume Data Schema
```typescript
// Profile is central source of truth
Profile {
  personalInfo, contact, summary, experience[], education[], 
  skills[], projects[], certifications[], achievements[], 
  languages[], courses[], links{}, interests[]
}

// Resume references profile + adds customization
Resume {
  profileId, templateId, customizations{}, 
  visibility: 'private'|'public'|'password'|'expiring',
  tailoredFor?: { jobDescription, keywords[] }
}
```

### AI Integration Pattern
```javascript
// Always cache AI responses (Redis)
// Use token counting for plan limits
// Handle rate limiting per subscription tier
const aiEnhance = async (text, operation, userId) => {
  const cacheKey = `ai:${operation}:${hash(text)}`;
  // Check cache → Call AI service → Store result → Update token usage
};
```

### Template System
- Templates in `/templates/{name}/` with `config.json` + React component
- Each template exports: `<TemplateComponent data={profile} customizations={} />`
- PDF generation: `generatePDF(templateId, resumeData, options)`

### Public Profile Routes
- Dynamic routes: `/pages/[username].tsx` and `/pages/r/[id].tsx`
- Check privacy settings in middleware
- Track analytics in async job (don't block response)

## Subscription Tiers

### Free Plan
- 3 basic templates, watermarked PDFs, 10 AI credits/month, no public profile customization

### Pro Plan
- All templates, unlimited AI, custom public profile themes, tailored resumes, cover letters

### Enterprise Plan
- Team branding, recruiter dashboard, bulk user management, priority support

**Enforce limits**: Middleware checks `user.plan` before allowing feature access

## Key Files & Directories
```
/pages/                    # Next.js routes (public profiles, dashboard, editor)
/components/resume/        # Resume editor components
/components/templates/     # 20+ resume templates
/lib/ai/                   # AI enhancement, ATS scoring, keyword matching
/lib/pdf/                  # PDF generation logic
/api/                      # Backend API routes
/services/cv-extraction/   # CV upload processing
/services/analytics/       # View tracking, engagement metrics
/hooks/useResumeEditor.ts  # Resume state management
/utils/ats-optimizer.ts    # ATS scoring algorithm
```

## External Dependencies
- **AI Providers** (Multi-provider setup with fallback):
  - **OpenAI**: GPT-4/GPT-4o for structured output, code generation, complex reasoning
  - **Anthropic**: Claude 3.5 Sonnet/Opus for long-context tasks, detailed analysis
  - **Google Gemini**: 1.5 Pro/Flash for cost-effective operations, multimodal tasks
  - Provider selection based on task complexity and cost optimization
- **OCR**: Tesseract.js or Google Cloud Vision API for scanned CV processing
- **Payments**: Stripe/Razorpay/PayPal webhooks for subscription management
- **Video**: FFmpeg for video processing, transcription API
- **Email**: SendGrid/AWS SES for OTP, notifications
- **Auth**: Passport.js (Google, LinkedIn, GitHub OAuth)

## Critical Patterns

### Role-based AI Optimization
When generating content, pass `roleType` to AI service:
```javascript
optimizeForRole(experience, 'developer') // Uses action verbs, quantifies impact
optimizeForRole(experience, 'marketing') // Focuses on campaigns, growth metrics
```

### ATS Optimization
- Single-column layouts score higher
- Avoid tables, images, headers/footers in ATS templates
- Parse job description for required keywords → highlight gaps → suggest additions

### Video Profile Integration
- Store video URL in profile
- Generate thumbnail + transcript on upload
- Option to include video QR code in PDF exports
- Embed video player in public profile page

### Analytics (Privacy-compliant)
```javascript
trackProfileView(resumeId, { region, device, referrer })
// Don't store IP, use aggregate location data
// Allow users to disable analytics
```

---

## 🤖 AI Agent Development Guidelines

### Critical Instructions for Autonomous Development

**⚠️ MANDATORY RULES - NEVER VIOLATE**

1. **DO NOT Kill Node Processes**
   - Never terminate running Node.js processes
   - Avoid commands like `taskkill`, `Stop-Process`, or `pkill node`
   - If ports are in use, use different ports instead

2. **DO NOT Start Node Processes**
   - Never run `npm start`, `npm run dev`, `node server.js`, or similar commands
   - Do not start development servers automatically
   - Do not launch background processes
   - The user will start servers manually when ready

3. **Complete All Tasks in One Go**
   - Implement entire features from start to finish
   - Don't stop midway through implementation
   - Create all necessary files (components, services, routes, models)
   - Write complete, production-ready code

4. **DO NOT Seek Manual Approval**
   - Proceed with implementation autonomously
   - Make technical decisions based on project architecture
   - Choose appropriate libraries and patterns
   - Fix errors and iterate without asking permission

5. **DO NOT Stop Until Complete**
   - Continue until both frontend and backend are fully implemented
   - Ensure all related files are created/updated
   - Implement error handling, validation, and edge cases
   - Add necessary tests, types, and documentation
   - Only stop when feature is 100% complete and functional

6. **ALWAYS Document Implementation Status**
   - Create/update `IMPLEMENTATION_STATUS.md` after completing features
   - Document what was implemented (files created, features added)
   - List remaining tasks and known issues
   - Update PROJECT_ROADMAP.md checkboxes for completed items
   - Include timestamps and feature completion notes
   - Track dependencies between features

### Development Workflow

**When implementing features:**
1. Analyze requirements completely
2. Design data models and API endpoints
3. Create backend (routes → controllers → services → models)
4. Create frontend (pages → components → hooks → API calls)
5. Add error handling and validation
6. Implement security measures
7. Add tests (if applicable)
8. Update related documentation
9. **Document completion status in IMPLEMENTATION_STATUS.md**

**File Organization Standards:**
- Backend: `/api/routes/`, `/api/controllers/`, `/api/services/`, `/api/models/`
- Frontend: `/pages/`, `/components/`, `/lib/`, `/hooks/`, `/utils/`
- Shared: `/types/`, `/constants/`, `/config/`

**Code Quality Standards:**
- Write TypeScript (strict mode)
- Include JSDoc comments for complex functions
- Add input validation on all API endpoints
- Implement proper error handling (try-catch)
- Use async/await (not callbacks)
- Follow REST conventions for API design

**Security Checklist:**
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)
- Implement authentication middleware where needed
- Rate limit sensitive endpoints
- Never expose secrets in code

---
*This is an AI-assisted development platform. Prioritize user privacy, secure file handling, and fair AI credit usage enforcement.*
