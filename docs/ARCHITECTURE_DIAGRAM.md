# Architecture Flow Diagram

## System Overview: 1 User → 1 Profile → N Resumes

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER REGISTRATION                          │
│                     email, password, name, etc.                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CREATE PROFILE (Once)                         │
│  Personal Info | Contact | Summary | Experience | Education |      │
│  Skills | Projects | Certifications | Achievements | etc.          │
│                                                                     │
│  ✓ ONE Profile per User                                            │
│  ✓ Central Source of Truth                                         │
│  ✓ Update Once, Reflects Everywhere                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ profileId reference
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │  RESUME #1    │ │  RESUME #2    │ │  RESUME #3    │
    ├───────────────┤ ├───────────────┤ ├───────────────┤
    │ Template:     │ │ Template:     │ │ Template:     │
    │  Modern       │ │  Minimalist   │ │  Creative     │
    │               │ │               │ │               │
    │ Colors:       │ │ Colors:       │ │ Colors:       │
    │  Blue theme   │ │  Gray theme   │ │  Purple theme │
    │               │ │               │ │               │
    │ Sections:     │ │ Sections:     │ │ Sections:     │
    │  All visible  │ │  Hide hobbies │ │  Reordered    │
    │               │ │               │ │               │
    │ Visibility:   │ │ Visibility:   │ │ Visibility:   │
    │  Public       │ │  Private      │ │  Public       │
    └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
            │                 │                 │
            ▼                 ▼                 ▼
        ┌───────┐        ┌───────┐        ┌───────┐
        │  PDF  │        │  PDF  │        │  PDF  │
        └───────┘        └───────┘        └───────┘
```

---

## Data Flow: Creating a Resume

```
User clicks "Create Resume"
        │
        ▼
┌────────────────────┐
│ Select Template    │ ← Choose from 20+ templates
│  • Modern          │
│  • Minimalist      │
│  • Creative        │
│  • Professional    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Customize Design   │ ← Personalize appearance
│  • Colors          │
│  • Fonts           │
│  • Layout          │
│  • Spacing         │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Configure Sections │ ← Show/hide/reorder
│  • Experience      │
│  • Education       │
│  • Skills          │
│  • Projects        │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Preview Resume     │ ← Live preview
│  [Resume Preview]  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Export to PDF      │ ← Download
│  ✓ ATS-friendly    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Save & Share       │ ← Public/Private
│  • yourdomain.com/ │
│    r/xyz123        │
└────────────────────┘
```

---

## Data Flow: Updating Profile

```
User updates profile (adds new job, skill, etc.)
        │
        ▼
┌────────────────────────────────────┐
│  Profile Model Updated             │
│  • New experience added            │
│  • New skill added                 │
│  • Education updated               │
└────────┬───────────────────────────┘
         │
         │ All resumes reference this profile
         │
    ┌────┴─────┬─────────┐
    │          │         │
    ▼          ▼         ▼
Resume #1  Resume #2  Resume #3
    │          │         │
    ▼          ▼         ▼
All resumes automatically show new data
(each with their own colors/fonts/layout)
```

---

## Data Flow: Editing a Resume

```
User clicks "Edit Resume"
        │
        ▼
┌────────────────────────────────────┐
│  Resume Editor (/resume/[id])      │
│                                    │
│  Left Sidebar:                     │
│  ┌──────────────┐                  │
│  │ Customizer   │                  │
│  │ • Colors     │                  │
│  │ • Fonts      │                  │
│  │ • Layout     │                  │
│  │ • Sections   │                  │
│  └──────────────┘                  │
│                                    │
│  Right Panel:                      │
│  ┌──────────────┐                  │
│  │ Live Preview │                  │
│  │              │                  │
│  │  [Resume]    │                  │
│  │              │                  │
│  └──────────────┘                  │
└────────────────────────────────────┘
        │
        │ Changes saved to Resume.customizations
        ▼
┌────────────────────────────────────┐
│  Database Update                   │
│  Resume {                          │
│    customizations: {               │
│      colors: { primary: '#007bff' }│
│      fonts: { heading: 'Roboto' }  │
│      layout: { columns: 2 }        │
│    }                               │
│  }                                 │
└────────────────────────────────────┘
        │
        │ Other resumes unchanged
        ▼
    Only THIS resume reflects changes
```

---

## Database Schema Relationships

```
┌─────────────────┐
│     Users       │
│─────────────────│
│ _id             │◄──┐
│ email           │   │
│ password        │   │
│ name            │   │
└─────────────────┘   │
                      │ userId reference
                      │
                      │
┌─────────────────┐   │
│    Profiles     │   │
│─────────────────│   │
│ _id             │◄──┼───┐
│ userId          │───┘   │
│ personalInfo    │       │
│ contact         │       │ profileId reference
│ summary         │       │
│ experience[]    │       │
│ education[]     │       │
│ skills[]        │       │
│ projects[]      │       │
└─────────────────┘       │
                          │
                          │
┌─────────────────┐       │
│    Resumes      │       │
│─────────────────│       │
│ _id             │       │
│ userId          │───────┤
│ profileId       │───────┘
│ title           │
│ templateId      │
│ customizations  │
│ visibility      │
│ viewCount       │
│ downloadCount   │
└─────────────────┘
```

---

## Frontend Component Hierarchy

```
App
│
├── Header
│   ├── Dashboard
│   ├── Profile        ← Single profile link
│   ├── Resumes
│   └── Tools
│
├── Dashboard (/dashboard)
│   ├── Stats Cards
│   │   ├── Total Resumes
│   │   ├── Views
│   │   └── Downloads
│   │
│   ├── Quick Actions
│   │   ├── Build Profile
│   │   ├── Upload CV
│   │   └── Browse Templates
│   │
│   └── Resumes Section
│       ├── ResumeCard #1
│       │   ├── Preview
│       │   ├── Stats
│       │   └── Actions (Edit, Duplicate, Delete)
│       │
│       ├── ResumeCard #2
│       └── ResumeCard #3
│
├── Profile Builder (/profile)
│   ├── Personal Info Section
│   ├── Contact Section
│   ├── Summary Section
│   ├── Experience Section
│   ├── Education Section
│   ├── Skills Section
│   └── Save Button
│
├── Resume Editor (/resume)
│   ├── Template Selector
│   ├── Create Resume Form
│   └── Preview
│
└── Resume Detail Editor (/resume/[id])
    ├── ResumeCustomizer (Left)
    │   ├── Colors Panel
    │   ├── Fonts Panel
    │   ├── Layout Panel
    │   └── Sections Panel
    │
    └── ResumePreview (Right)
        └── Live Preview
```

---

## API Endpoints Summary

### Profile Endpoints
```
GET    /api/profiles          → Get user's profile
POST   /api/profiles          → Create profile
PUT    /api/profiles/:id      → Update profile
DELETE /api/profiles/:id      → Delete profile
```

### Resume Endpoints
```
GET    /api/resumes           → Get all user's resumes
GET    /api/resumes/:id       → Get specific resume
POST   /api/resumes           → Create new resume
PUT    /api/resumes/:id       → Update resume
DELETE /api/resumes/:id       → Delete resume
GET    /api/resumes/:id/pdf   → Export PDF
```

### Public Endpoints
```
GET    /api/public/r/:shortId      → Get public resume
GET    /api/public/:username/:slug → Get public resume by slug
```

---

## User Stories

### Story 1: Creating First Resume
```
1. New user "John" registers
2. John fills out his profile with experience, education, skills
3. John goes to "Create Resume"
4. John selects "Modern" template
5. John customizes with blue colors
6. John previews his resume
7. John exports to PDF
8. John has his first resume! ✓
```

### Story 2: Creating Second Resume for Different Industry
```
1. John wants to apply to consulting firms
2. John goes to Dashboard
3. John clicks "New Resume"
4. John selects "Professional" template (more conservative)
5. John customizes with gray colors
6. John hides his personal projects (not relevant for consulting)
7. John reorders sections (education first)
8. John previews his consulting resume
9. John exports to PDF
10. John now has TWO resumes from ONE profile! ✓
```

### Story 3: Updating Profile
```
1. John gets a new job
2. John goes to "Profile"
3. John adds new job to Experience section
4. John adds new skills learned
5. John saves profile changes
6. John goes to Dashboard
7. Both Resume #1 and Resume #2 now show the new job! ✓
8. Resume #1 still has blue colors
9. Resume #2 still has gray colors
10. Profile update reflected in all resumes! ✓
```

---

## Key Advantages

### ✅ Single Source of Truth
- Update your experience once
- Reflects in all resumes automatically
- No duplicate data entry

### ✅ Multiple Presentations
- One resume for tech jobs (blue, modern)
- One resume for finance jobs (gray, conservative)
- One resume for startups (colorful, creative)
- All from the same profile data

### ✅ Easy Maintenance
- Change your phone number once
- Update your latest job once
- Add a new skill once
- All resumes updated

### ✅ Flexibility
- Different templates
- Different colors
- Different fonts
- Different section visibility
- Different ordering

### ✅ Privacy Control
- Some resumes public
- Some resumes private
- Control per resume

---

## Summary

**The architecture enables:**
- **Efficiency**: Update once, apply everywhere
- **Flexibility**: Unlimited resume variations
- **Consistency**: Single source of truth
- **Control**: Customize each resume independently
- **Privacy**: Manage visibility per resume

**User benefit:**
"I maintain ONE profile with my work history, but I can create MULTIPLE resumes with different looks for different jobs!"

🎯 **Result**: Professional, maintainable, and powerful resume builder!
