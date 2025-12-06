# Multi-Profile System Implementation

## Overview
Implemented a comprehensive multi-profile system that allows users to create and manage multiple professional profiles (e.g., "Software Engineer", "Marketing Specialist", "Freelancer") and build tailored resumes from each profile.

## What Was Implemented

### 1. Backend Infrastructure ✅

#### New Models
- **ProfileCollection Model** (`backend/src/models/ProfileCollection.model.ts`)
  - Stores multiple profiles per user
  - Fields: `userId`, `profileName`, `isDefault`, all standard profile fields
  - Pre-save hook ensures only one default profile per user
  - Indexes on `userId`, `isDefault`, `profileName`

#### API Endpoints (`/api/profile-collections`)
- `GET /` - Get all profiles for current user
- `GET /default` - Get user's default profile
- `GET /:id` - Get single profile by ID
- `POST /` - Create new profile
- `PUT /:id` - Update profile
- `DELETE /:id` - Soft delete profile (with resume validation)
- `POST /:id/set-default` - Set profile as default
- `GET /:id/resumes` - Get all resumes for a profile
- `POST /:id/duplicate` - Duplicate a profile

#### Updated Models
- **Resume Model**: Changed `profileId` reference from `Profile` to `ProfileCollection`

#### Updated Controllers
- **CV Upload Controller**: Now supports:
  - `profileId` - Upload to existing profile
  - `createNew` - Create new profile from CV
  - `profileName` - Name for new profile
  - Maintains backward compatibility with legacy Profile model

### 2. Frontend Components ✅

#### Profile Manager (`frontend/src/components/ProfileManager.tsx`)
- Grid view of all user profiles
- Create new profile modal with basic info form
- Edit/Delete/Duplicate profile actions
- Set default profile functionality
- View resumes per profile
- Shows profile stats (jobs, degrees, skills)
- Default profile badge (star icon)

#### Profiles Page (`frontend/src/app/profiles/page.tsx`)
- Dedicated route at `/profiles`
- Displays ProfileManager component
- Integrated with dashboard navigation

#### Updated CV Upload (`frontend/src/components/CVUpload.tsx`)
- Radio button selection: Upload to existing profile OR create new profile
- Dropdown to select existing profile (shows default indicator)
- Text input for new profile name
- Fetches profiles on mount
- Sends `profileId`, `createNew`, `profileName` with upload
- Toast notifications for success/error
- Refreshes profile list after successful upload

#### Dashboard Navigation
- Added "My Profiles" button to dashboard header
- Links to `/profiles` page

### 3. Data Migration ✅

#### Migration Script (`scripts/migrate-to-multi-profile.js`)
- Converts existing `Profile` documents to `ProfileCollection`
- Sets migrated profiles as `isDefault: true`
- Updates all Resume references from old Profile ID to new ProfileCollection ID
- Maintains legacy Profile model for backward compatibility
- Detailed logging and error handling
- Run with: `node scripts/migrate-to-multi-profile.js`

## How It Works

### User Workflow

1. **View Profiles**: Navigate to `/profiles` or click "My Profiles" on dashboard
2. **Create Profile**: Click "New Profile" → Enter name, basic info → Save
3. **Upload CV to Profile**: 
   - Go to `/upload-cv`
   - Choose: Update existing profile OR Create new profile from CV
   - Upload CV file → Auto-populates selected/new profile
4. **Manage Profiles**:
   - Edit: Opens profile builder with profile data
   - Duplicate: Creates copy for similar roles
   - Set as Default: Used for new resumes by default
   - Delete: Only if no resumes reference it
5. **Create Resume from Profile**: Resume editor will show profile selector (pending implementation)

### Technical Flow

```
User uploads CV with profileId=xyz
    ↓
Backend: cvUploadController.uploadAndParseCv()
    ↓
Parse CV → Extract data
    ↓
Update ProfileCollection (xyz) with extracted data
    ↓
Also update legacy Profile for backward compatibility
    ↓
Return profile data to frontend
    ↓
ProfileManager refreshes list
```

### Profile Selection in CV Upload

```jsx
<!-- User sees: -->
Upload to Profile:
  ○ [Select existing profile ▼] Default Profile (Default)
  ○ [New profile name...] _______

<!-- FormData sent: -->
{
  file: <PDF blob>,
  profileId: "xyz123",  // if existing selected
  createNew: "true",     // if new profile selected
  profileName: "DevOps Engineer Profile"  // if new profile
}
```

## API Routes Summary

### Profile Collections
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile-collections` | Get all profiles | ✅ |
| GET | `/api/profile-collections/default` | Get default profile | ✅ |
| GET | `/api/profile-collections/:id` | Get single profile | ✅ |
| POST | `/api/profile-collections` | Create profile | ✅ |
| PUT | `/api/profile-collections/:id` | Update profile | ✅ |
| DELETE | `/api/profile-collections/:id` | Delete profile | ✅ |
| POST | `/api/profile-collections/:id/set-default` | Set as default | ✅ |
| GET | `/api/profile-collections/:id/resumes` | Get profile resumes | ✅ |
| POST | `/api/profile-collections/:id/duplicate` | Duplicate profile | ✅ |

### CV Upload (Updated)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/cv/upload` | `file, profileId?, createNew?, profileName?` | Upload CV to profile |

## Files Created/Modified

### Created
- `backend/src/models/ProfileCollection.model.ts` - New multi-profile model
- `backend/src/controllers/profileCollection.controller.ts` - CRUD operations
- `backend/src/routes/profileCollection.routes.ts` - API routes
- `frontend/src/components/ProfileManager.tsx` - Profile management UI
- `frontend/src/app/profiles/page.tsx` - Profiles page
- `scripts/migrate-to-multi-profile.js` - Data migration script

### Modified
- `backend/src/models/Resume.model.ts` - Changed profileId reference
- `backend/src/controllers/cvUploadController.ts` - Added profile selection logic
- `backend/src/routes/cvUpload.routes.ts` - Added profile params
- `backend/src/app.ts` - Added profile-collections routes
- `frontend/src/components/CVUpload.tsx` - Added profile selection UI
- `frontend/src/app/(main)/dashboard/page.tsx` - Added "My Profiles" button

## Pending Implementation

### Resume Editor Profile Selector
**Status**: Not yet implemented

**What's needed**:
1. Add profile dropdown to resume creation/edit flow
2. Fetch profile data when profile is selected
3. Pre-populate resume fields from selected profile
4. Allow switching profiles during editing
5. Save `profileId` reference when saving resume

**Suggested implementation**:
```tsx
// In ResumeEditor component
const [profiles, setProfiles] = useState<Profile[]>([]);
const [selectedProfileId, setSelectedProfileId] = useState('');

useEffect(() => {
  // Fetch profiles
  fetchProfiles();
}, []);

const handleProfileChange = async (profileId: string) => {
  setSelectedProfileId(profileId);
  // Fetch profile data
  const profile = await fetchProfileById(profileId);
  // Pre-populate form fields
  setFormData({ ...profile, templateId: selectedTemplate });
};
```

## Testing Steps

### 1. Test Profile Management
```bash
1. Login to application
2. Navigate to /profiles
3. Click "New Profile" → Create "Software Engineer Profile"
4. Click "New Profile" → Create "Marketing Profile"
5. Set "Software Engineer Profile" as default (star icon)
6. Edit profile → Should open profile builder
7. Duplicate profile → Should create copy
8. Try to delete profile with resumes → Should show error
9. Create profile without resumes → Delete should succeed
```

### 2. Test CV Upload
```bash
1. Go to /upload-cv
2. Select "Software Engineer Profile" from dropdown
3. Upload PDF CV → Should update that profile
4. Go back to /upload-cv
5. Select "Create new profile"
6. Enter "DevOps Profile" as name
7. Upload CV → Should create new profile
8. Check /profiles → Should see new profile
```

### 3. Test Migration
```bash
1. Ensure test database has existing Profile documents
2. Run: node scripts/migrate-to-multi-profile.js
3. Check ProfileCollection collection → Should have migrated profiles
4. Check Resume documents → profileId should reference ProfileCollection
5. Verify no data loss
```

## Database Schema

### ProfileCollection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  profileName: String,
  isDefault: Boolean,
  personalInfo: {
    firstName, lastName, title, photo, dateOfBirth, nationality
  },
  contact: {
    email, phone, address, city, country, postalCode, website
  },
  summary: String,
  experience: [{company, role, location, startDate, endDate, current, description, achievements}],
  education: [{institution, degree, field, location, startDate, endDate, current, gpa, honors}],
  skills: [{name, category, proficiency, yearsOfExperience}],
  projects: [{name, description, technologies, link, startDate, endDate}],
  certifications: [{name, issuer, date, expiryDate, credentialId, verificationUrl}],
  achievements: [{title, description, date}],
  languages: [{language, proficiency}],
  courses: [{name, institution, completionDate, certificateUrl}],
  socialLinks: {linkedin, github, twitter, portfolio, other},
  interests: [String],
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Resume (Updated)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  profileId: ObjectId (ref: ProfileCollection),  // ← Changed from Profile
  title: String,
  templateId: String,
  customizations: Object,
  visibility: String,
  // ... other fields
}
```

## Benefits

1. **Multiple Professional Personas**: Users can maintain separate profiles for different career paths
2. **Tailored Resumes**: Create job-specific resumes from different profiles
3. **Easy Management**: Central hub to view, edit, duplicate profiles
4. **CV Upload Flexibility**: Choose which profile to update or create new from CV
5. **Default Profile**: Streamlines resume creation with auto-selected default
6. **Data Integrity**: Prevents profile deletion if resumes reference it
7. **Backward Compatible**: Legacy Profile model still works during transition

## Usage Examples

### Example 1: Software Engineer with Side Hustle
```
Profile 1: "Full-Stack Developer" (Default)
  - 5 years enterprise experience
  - Skills: React, Node.js, AWS
  - Resumes: Corporate job applications

Profile 2: "Freelance Consultant"
  - Freelance projects
  - Skills: System Architecture, Technical Writing
  - Resumes: Upwork/Fiverr proposals
```

### Example 2: Career Transition
```
Profile 1: "Data Analyst" (Current role)
  - SQL, Python, Tableau experience
  - Resumes: Data-focused applications

Profile 2: "Data Scientist" (Transitioning to)
  - ML, AI, Statistics projects
  - Online courses, certifications
  - Resumes: Entry-level ML positions
```

## Security Considerations

- ✅ All endpoints require authentication
- ✅ Users can only access their own profiles
- ✅ Soft delete instead of hard delete
- ✅ Validation prevents orphaned resumes (delete check)
- ✅ Profile name length limited to 100 chars
- ✅ Input sanitization on all text fields

## Performance Optimizations

- ✅ Indexes on frequently queried fields (userId, isDefault)
- ✅ Compound index on (userId, profileName) for uniqueness check
- ✅ Soft delete index for efficient filtering
- ✅ Pre-save hook optimized (only runs when isDefault changes)

## Next Steps (Optional Enhancements)

1. **Resume Editor Integration**: Add profile selector when creating resumes
2. **Profile Templates**: Provide starter templates for common roles
3. **Profile Analytics**: Track which profiles generate most views/applications
4. **Profile Sharing**: Export profile as JSON or share between accounts
5. **AI Profile Optimization**: Suggest improvements per profile type
6. **Profile Versioning**: Track profile changes over time
7. **Bulk Operations**: Import multiple profiles from LinkedIn, etc.

---

**Implementation Date**: December 7, 2025  
**Status**: ✅ Backend Complete | ✅ Frontend Complete | ⚠️ Resume Editor Integration Pending  
**Migration**: Ready to run (`node scripts/migrate-to-multi-profile.js`)
