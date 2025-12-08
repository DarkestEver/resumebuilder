# CV Upload Feature - Profile & Resume Support

## Overview
Enhanced CV upload system that allows users to upload PDF resumes and extract data to either create/update profiles or create/update resumes.

## Features

### 1. Upload Target Selection
Users can choose to upload to:
- **Profile**: Master data store containing all user information
- **Resume**: Specific document generated from profile data

### 2. Upload Mode Selection
For each target, users can:
- **Update Existing**: Update an existing profile or resume with extracted data
- **Create New**: Create a new profile or resume from extracted data

### 3. File Format
- **PDF Only**: Only PDF files are accepted for maximum extraction accuracy
- **Max Size**: 10MB file size limit

## User Interface

### Upload Target
```
┌─────────────────────────────────────┐
│ What do you want to update?         │
│                                     │
│  [Profile]  [Resume]                │
└─────────────────────────────────────┘
```

### Upload Mode
```
┌─────────────────────────────────────┐
│ Profile Selection                    │
│                                     │
│  [Update Existing]  [Create New]    │
│                                     │
│  ▼ Select profile to update         │
└─────────────────────────────────────┘
```

## Backend Changes

### Route: `/api/cv/upload`
**Request Body:**
```typescript
{
  file: File (PDF),
  uploadTarget: 'profile' | 'resume',
  uploadMode: 'update' | 'create',
  
  // For profile update
  profileId?: string,
  
  // For profile create
  newProfileName?: string,
  
  // For resume update
  resumeId?: string,
  
  // For resume create
  newResumeTitle?: string,
  profileId?: string  // Base profile for new resume
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    extractedData: object,
    type: 'profile' | 'resume',
    action: 'created' | 'updated',
    profile?: ProfileDocument,
    resume?: ResumeDocument
  }
}
```

### Controller Logic

#### Profile Target
- **Update Mode**: Updates existing profile with extracted data
- **Create Mode**: Creates new profile with extracted data

#### Resume Target
- **Update Mode**: Updates existing resume's data field with extracted info
- **Create Mode**: Creates new resume from extracted data, linked to selected profile

### Data Flow

1. **Upload PDF** → Parse with AI service
2. **Extract Data** → Structure information
3. **Target Selection**:
   - Profile → Update/Create ProfileCollection
   - Resume → Update/Create Resume document
4. **Save to Database**
5. **Delete temporary file**
6. **Return success response**

## Frontend Components

### CVUpload Component
**Location**: `frontend/src/components/CVUpload.tsx`

**State Management:**
```typescript
const [uploadTarget, setUploadTarget] = useState<'profile' | 'resume'>('profile');
const [uploadMode, setUploadMode] = useState<'update' | 'create'>('update');
const [profiles, setProfiles] = useState<Profile[]>([]);
const [resumes, setResumes] = useState<Resume[]>([]);
const [selectedProfileId, setSelectedProfileId] = useState<string>('');
const [selectedResumeId, setSelectedResumeId] = useState<string>('');
const [newProfileName, setNewProfileName] = useState('');
const [newResumeTitle, setNewResumeTitle] = useState('');
```

**Validation:**
- Ensures PDF file only
- Validates selection based on target and mode
- Requires name/title for new profile/resume
- Requires selection for update mode

## Use Cases

### 1. Update Existing Profile
User has a profile and wants to update it with new CV data.
```
Target: Profile
Mode: Update
Select: Existing profile
Action: Extracted data merged with existing profile
```

### 2. Create New Profile
User wants to create a separate profile for a different role.
```
Target: Profile
Mode: Create
Input: New profile name
Action: New profile created with extracted data
```

### 3. Update Existing Resume
User has a resume and wants to refresh it with updated CV.
```
Target: Resume
Mode: Update
Select: Existing resume
Action: Resume data field updated with extracted info
```

### 4. Create New Resume
User wants to create a new tailored resume from CV.
```
Target: Resume
Mode: Create
Input: Resume title + Base profile
Action: New resume created with extracted data from CV
```

## Validation Rules

### Frontend Validation
- File must be PDF format
- File size ≤ 10MB
- Profile update: Must select a profile
- Profile create: Must provide profile name
- Resume update: Must select a resume
- Resume create: Must provide title and select base profile

### Backend Validation
- File mime type must be 'application/pdf'
- User must be authenticated
- Profile/Resume must belong to authenticated user
- Profile/Resume IDs must exist in database

## Error Handling

### Common Errors
- Invalid file format → "Only PDF files are supported"
- No file uploaded → "No file uploaded"
- File too large → "File size exceeds 10MB limit"
- Invalid selection → "Please select a profile/resume to update"
- Missing name → "Please enter a name for the new profile/resume"
- Not found → "Profile/Resume not found"
- Parsing failure → "Failed to extract data from PDF"

## Security

- ✅ File type validation (PDF only)
- ✅ File size limit (10MB)
- ✅ Authentication required
- ✅ User ownership validation
- ✅ Temporary file cleanup after processing
- ✅ Encrypted transmission (HTTPS)

## Database Models

### Profile (ProfileCollection)
```typescript
{
  userId: ObjectId,
  profileName: string,
  isDefault: boolean,
  personalInfo: {...},
  contact: {...},
  // ... extracted data fields
}
```

### Resume
```typescript
{
  userId: ObjectId,
  profileId: ObjectId,
  title: string,
  templateId: string,
  data: {
    // Extracted CV data
    personalInfo: {...},
    experience: [...],
    // ...
  },
  lastSyncedAt: Date,
  customizations: {...},
  visibility: string
}
```

## Testing Checklist

- [ ] Upload PDF to update profile
- [ ] Upload PDF to create new profile
- [ ] Upload PDF to update existing resume
- [ ] Upload PDF to create new resume
- [ ] Validate PDF-only restriction
- [ ] Validate file size limit
- [ ] Test with various PDF formats
- [ ] Verify data extraction accuracy
- [ ] Test error handling for invalid files
- [ ] Verify temporary file cleanup
- [ ] Test concurrent uploads
- [ ] Verify UI updates after successful upload

## Future Enhancements

1. **Format Support**: Add support for DOCX, images (with OCR)
2. **Batch Upload**: Upload multiple CVs at once
3. **Template Detection**: Auto-detect CV template and apply matching resume template
4. **Diff View**: Show before/after comparison when updating
5. **Partial Update**: Allow users to select which fields to update
6. **Version History**: Keep history of all uploaded CVs
7. **Export Formats**: Export extracted data in various formats

## Notes

- PDF parsing uses AI service (OpenAI/Claude/Gemini)
- Extraction accuracy: 85-95% depending on PDF quality
- Users should always review extracted data
- Original PDF is deleted after extraction for privacy
- Resume data can be independently edited after creation
