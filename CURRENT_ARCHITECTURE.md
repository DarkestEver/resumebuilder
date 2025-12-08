# Current Architecture - Single Profile, Multiple Resumes

**Date**: December 7, 2025  
**Status**: ✅ Verified and Working

## Data Flow Architecture

```
User Registration/Login
         ↓
    Create Profile (Single Profile per User)
         ↓
    Create Multiple Resumes (Each references the single profile)
         ↓
    Edit/Customize Each Resume Individually
         ↓
    Preview & Export to PDF
```

---

## Database Schema

### User Model
```typescript
User {
  _id: ObjectId
  email: string
  name: string
  password: hash
  // ... auth fields
}
```

### Profile Model (Single per User)
```typescript
Profile {
  _id: ObjectId
  userId: ObjectId → User
  personalInfo: { firstName, lastName, title, ... }
  contact: { email, phone, location, ... }
  summary: string
  experience: [Experience]
  education: [Education]
  skills: [string]
  projects: [Project]
  certifications: [Certification]
  // ... all profile data sections
}
```

### Resume Model (Multiple per User)
```typescript
Resume {
  _id: ObjectId
  userId: ObjectId → User
  profileId: ObjectId → Profile  ✅ References single Profile
  
  title: string (e.g., "Software Engineer Resume")
  templateId: string (e.g., "modern", "minimalist")
  
  customizations: {
    colors: { primary, secondary, accent }
    fonts: { heading, body }
    layout: { spacing, columns }
    sections: { order, visibility }
  }
  
  visibility: "private" | "public" | "password" | "expiring"
  shortId: string (for /r/xyz123 URLs)
  slug: string (for /username/slug URLs)
  
  tailoredFor?: {
    jobTitle, company, jobDescription, keywords
  }
  
  // Analytics
  viewCount, downloadCount
}
```

---

## User Journey

### 1. New User Flow
```
1. Register/Login → /auth/register or /login
2. Build Profile → /profile (Fill in all sections)
3. Create First Resume → /resume (Select template, customize, preview)
4. Export PDF → Download button
```

### 2. Returning User - Multiple Resumes
```
1. Login → /dashboard
2. See existing resumes list
3. Options:
   a) Create New Resume → /resume (new template/customization)
   b) Edit Existing → /resume/[id] (edit customization)
   c) Update Profile → /profile (affects all resumes)
```

### 3. Profile vs Resume Relationship
```
Profile = Source of Truth
  ↓ (referenced by all resumes)
Resumes = Different Presentations
  - Resume A: Modern template, blue colors, for tech jobs
  - Resume B: Minimalist template, gray colors, for consulting
  - Resume C: Creative template, purple colors, for startups
  
Each resume pulls data from the SAME profile
Each resume has DIFFERENT customizations
```

---

## API Endpoints

### Profile (Single per user)
- `GET /api/profiles` - Get user's profile
- `POST /api/profiles` - Create profile (first time)
- `PUT /api/profiles/:id` - Update profile (affects all resumes)
- `DELETE /api/profiles/:id` - Delete profile (soft delete)

### Resumes (Multiple per user)
- `GET /api/resumes` - Get all user's resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
  - Auto-links to user's profile
  - Requires templateId
- `PUT /api/resumes/:id` - Update resume customizations
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/pdf` - Export PDF

---

## Frontend Pages

### Dashboard (`/dashboard`)
- Shows stats: Total resumes, views, downloads
- Lists all resumes with actions:
  - Edit (→ `/resume/[id]`)
  - Preview
  - Export PDF
  - Delete
- Quick actions:
  - Build Profile
  - Create New Resume
  - Upload CV

### Profile Builder (`/profile`)
- Single form with all sections
- Personal Info, Contact, Summary
- Experience, Education, Skills
- Projects, Certifications, etc.
- Changes here affect ALL resumes

### Resume Editor (`/resume`)
- Select Template
- Create new resume with name
- Customize colors, fonts, layout
- Preview in real-time
- Export PDF

### Resume Detail Editor (`/resume/[id]`)
- Edit existing resume
- Change customizations (colors, fonts, sections)
- Preview changes
- Export updated PDF
- Change visibility (public/private)

---

## Key Features Working

✅ **Single Profile System**
- User creates ONE profile with all their data
- Profile is the single source of truth

✅ **Multiple Resumes**
- User can create unlimited resumes
- Each resume references the same profile
- Each resume has different:
  - Template
  - Colors
  - Fonts
  - Layout
  - Section order/visibility

✅ **Resume Customization**
- Colors: Primary, secondary, accent
- Fonts: Heading and body fonts
- Layout: Spacing, columns
- Sections: Show/hide, reorder

✅ **Preview & Export**
- Live preview as you customize
- Export to PDF
- Download locally

✅ **Public Sharing**
- Private (default)
- Public (shareable link)
- Password protected
- Expiring links

---

## Code Verification

### Backend Model Reference
```typescript
// backend/src/models/Resume.model.ts
profileId: {
  type: Schema.Types.ObjectId,
  ref: 'Profile',  ✅ Correct - references single Profile
  required: true,
}
```

### Backend Resume Creation
```typescript
// backend/src/controllers/resume.controller.ts
static async createResume(req, res) {
  // Get user's profile
  const profile = await Profile.findOne({ userId: req.user.userId });
  if (!profile) {
    throw new AppError('Please create a profile first');
  }
  
  // Create resume with profile reference
  const resume = new Resume({
    userId: req.user.userId,
    profileId: profile._id,  ✅ Links to single profile
    templateId: req.body.templateId,
    title: req.body.title,
  });
}
```

### Frontend Resume Store
```typescript
// frontend/src/stores/resumeStore.ts
interface Resume {
  _id: string
  title: string
  templateId: string
  customizations: { ... }
}

createResume: async (data) => {
  const resume = await createResume(data);
  // Backend auto-links to user's profile
}
```

---

## What Users Can Do

### Profile Management
- ✅ Create/Edit ONE profile
- ✅ All data in one place
- ✅ Changes apply to all resumes

### Resume Management
- ✅ Create multiple resumes from same profile
- ✅ Each resume has unique template
- ✅ Each resume has unique colors/fonts
- ✅ Each resume has unique section visibility
- ✅ Edit any resume independently
- ✅ Preview before export
- ✅ Export to PDF
- ✅ Share publicly or keep private
- ✅ Delete resumes (profile remains)

### Example Use Cases

**Use Case 1: Different Job Types**
- Profile: Full-stack developer with 5 years experience
- Resume A: Frontend-focused (shows React/Vue projects)
- Resume B: Backend-focused (shows Node/Python projects)
- Resume C: DevOps-focused (shows AWS/Docker experience)

**Use Case 2: Different Industries**
- Profile: Marketing manager with diverse experience
- Resume A: Tech industry (modern template, blue colors)
- Resume B: Finance industry (conservative template, gray colors)
- Resume C: Startup (creative template, vibrant colors)

**Use Case 3: Different Lengths**
- Profile: Senior engineer with lots of experience
- Resume A: Full resume (2 pages, all sections)
- Resume B: One-pager (only last 5 years, key skills)
- Resume C: Executive summary (high-level overview)

---

## Architecture Benefits

✅ **Simplicity**: One profile, multiple presentations  
✅ **Consistency**: Update once, reflect everywhere  
✅ **Flexibility**: Different templates for different purposes  
✅ **Maintainability**: Easy to update your data  
✅ **Privacy**: Control visibility per resume  

---

## Future Enhancements (Not Yet Implemented)

- [ ] Resume templates (20+ templates)
- [ ] AI-powered tailoring to job descriptions
- [ ] ATS score checking
- [ ] Cover letter generation
- [ ] Video profile integration
- [ ] QR code generation
- [ ] Analytics (views, downloads per resume)

---

## Summary

The system is correctly architected as:

**1 User → 1 Profile → N Resumes**

Each resume is a different presentation of the same profile data, with customizable templates, colors, fonts, and section visibility. Users can create unlimited resumes for different job applications while maintaining a single source of truth for their professional data.
