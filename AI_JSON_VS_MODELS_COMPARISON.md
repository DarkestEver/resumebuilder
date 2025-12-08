# AI JSON Response vs Profile/Resume Models - Comparison

## Summary

**AI Extraction Output** (ExtractedData) → **Profile Model** (IProfile) → **Resume Data**

---

## 1. AI JSON Response Structure

```typescript
interface ExtractedData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    photo?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: { street, city, state, zipCode, country };
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience?: Array<{
    title?: string;        // Job title
    company?: string;
    location?: string;
    startDate?: string;    // "YYYY-MM" format
    endDate?: string;      // "YYYY-MM" or "Present"
    current?: boolean;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: Array<{
    name?: string;
    category?: string;
    level?: string;        // "Beginner", "Intermediate", "Advanced", "Expert"
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string; // Comma-separated
    link?: string;
    github?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
  }>;
  languages?: Array<{
    name?: string;
    proficiency?: string; // "Native", "Fluent", "Professional", "Basic"
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
}
```

---

## 2. Profile Model Structure

```typescript
interface IProfile {
  userId: ObjectId;
  
  personalInfo: {
    firstName: string;         // ✅ From AI
    lastName: string;          // ✅ From AI
    title?: string;            // ✅ From AI
    photo?: string;            // ✅ From AI
    dateOfBirth?: Date;        // ❌ NOT from AI
    nationality?: string;      // ❌ NOT from AI
    placeOfBirth?: string;     // ❌ NOT from AI
  };
  
  contact: {
    email: string;             // ✅ From AI
    phone?: string;            // ✅ From AI
    alternatePhone?: string;   // ❌ NOT from AI
    address?: {
      street?: string;         // ✅ From AI
      apartment?: string;      // ❌ NOT from AI
      city?: string;           // ✅ From AI
      state?: string;          // ✅ From AI
      country?: string;        // ✅ From AI
      zipCode?: string;        // ✅ From AI
    };
    website?: string;          // ✅ From AI
    linkedin?: string;         // ✅ From AI
    github?: string;           // ✅ From AI
    portfolio?: string;        // ❌ NOT from AI
  };
  
  summary?: string;            // ✅ From AI
  
  experience: Array<{
    company: string;           // ✅ From AI (as "company")
    role: string;              // ✅ From AI (as "title") ⚠️ MISMATCH
    location?: string;         // ✅ From AI
    startDate: Date;           // ✅ From AI (need conversion)
    endDate?: Date;            // ✅ From AI (need conversion)
    current: boolean;          // ✅ From AI
    description?: string;      // ✅ From AI
    achievements: string[];    // ⚠️ From AI description (need parsing)
  }>;
  
  education: Array<{
    institution: string;       // ✅ From AI
    degree: string;            // ✅ From AI
    field: string;             // ❌ NOT from AI ⚠️ MISSING
    location?: string;         // ✅ From AI
    startDate: Date;           // ✅ From AI (need conversion)
    endDate?: Date;            // ✅ From AI (need conversion)
    current: boolean;          // ❌ NOT from AI (can infer)
    gpa?: number;              // ✅ From AI (need conversion string→number)
    honors?: string;           // ❌ NOT from AI
  }>;
  
  skills: Array<{
    name: string;              // ✅ From AI
    category?: string;         // ✅ From AI
    proficiency?: string;      // ✅ From AI (as "level") ⚠️ MISMATCH
    yearsOfExperience?: number;// ❌ NOT from AI
  }>;
  
  projects: Array<{
    name: string;              // ✅ From AI
    description: string;       // ✅ From AI
    technologies: string[];    // ✅ From AI (need split comma-separated)
    link?: string;             // ✅ From AI
    startDate?: Date;          // ❌ NOT from AI
    endDate?: Date;            // ❌ NOT from AI
  }>;
  
  certifications: Array<{
    name: string;              // ✅ From AI
    issuer: string;            // ✅ From AI
    date: Date;                // ✅ From AI (need conversion)
    expiryDate?: Date;         // ✅ From AI (need conversion)
    credentialId?: string;     // ❌ NOT from AI
    verificationUrl?: string;  // ❌ NOT from AI
  }>;
  
  achievements: Array<{
    title: string;             // ✅ From AI
    description: string;       // ✅ From AI
    date?: Date;               // ✅ From AI (need conversion)
  }>;
  
  languages: Array<{
    language: string;          // ✅ From AI (as "name") ⚠️ MISMATCH
    proficiency: string;       // ✅ From AI ⚠️ ENUM MISMATCH
  }>;
  
  courses: Array<...>;         // ❌ NOT from AI ⚠️ MISSING
  links: {...};                // ✅ Partially from AI (linkedin, github)
  interests: string[];         // ❌ NOT from AI
  publications: Array<...>;    // ❌ NOT from AI ⚠️ MISSING
}
```

---

## 3. Resume Model (data field)

Resume just stores extracted data as-is in the `data` field:
```typescript
interface IResume {
  userId: ObjectId;
  profileId: ObjectId;  // Links to Profile
  title: string;
  templateId: string;
  data: any;            // ← AI ExtractedData goes here directly
  customizations: any;
  visibility: string;
}
```

---

## 4. Key Mismatches & Issues

### 🔴 Critical Issues:

1. **Experience: `title` → `role`**
   - AI returns: `experience[].title`
   - Profile expects: `experience[].role`
   - **FIX NEEDED**: Rename field during save

2. **Experience: `achievements` missing**
   - Profile expects: `experience[].achievements: string[]`
   - AI returns: `experience[].description: string`
   - **FIX NEEDED**: Either split description by bullets OR omit achievements

3. **Education: `field` missing**
   - Profile REQUIRES: `education[].field: string`
   - AI doesn't extract this
   - **FIX NEEDED**: Extract from degree string OR make optional

4. **Skills: `proficiency` enum mismatch**
   - AI returns: "Beginner", "Intermediate", "Advanced", "Expert"
   - Profile enum: 'beginner' | 'intermediate' | 'advanced' | 'expert' (lowercase)
   - **FIX NEEDED**: Convert to lowercase

5. **Languages: field name & enum**
   - AI returns: `languages[].name` and proficiency (Native/Fluent/Professional/Basic)
   - Profile expects: `languages[].language` and enum (elementary/limited/professional/fluent/native)
   - **FIX NEEDED**: Rename `name` → `language`, map proficiency values

6. **Date formats**
   - AI returns: `"YYYY-MM"` strings
   - Profile expects: `Date` objects
   - **FIX NEEDED**: Convert all date strings to Date objects

7. **Projects: `technologies`**
   - AI returns: `"MongoDB, Express, React, Node.js"` (string)
   - Profile expects: `["MongoDB", "Express", "React", "Node.js"]` (array)
   - **FIX NEEDED**: Split comma-separated string

---

## 5. Data Transformation Required

When saving AI response to Profile, we need:

```typescript
// Transform AI data to Profile format
const transformedData = {
  personalInfo: extractedData.personalInfo, // ✅ Direct
  contact: extractedData.contact,          // ✅ Direct
  summary: extractedData.summary,           // ✅ Direct
  
  experience: extractedData.experience?.map(exp => ({
    company: exp.company,
    role: exp.title,                        // ⚠️ Rename: title → role
    location: exp.location,
    startDate: new Date(exp.startDate),     // ⚠️ Convert to Date
    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    current: exp.current || false,
    description: exp.description,
    achievements: []                         // ⚠️ Extract from description or empty
  })),
  
  education: extractedData.education?.map(edu => ({
    institution: edu.institution,
    degree: edu.degree,
    field: edu.degree?.split('in')[1]?.trim() || 'General', // ⚠️ Extract or default
    location: edu.location,
    startDate: new Date(edu.startDate),
    endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    current: !edu.endDate,                   // ⚠️ Infer from endDate
    gpa: parseFloat(edu.gpa)                 // ⚠️ Convert to number
  })),
  
  skills: extractedData.skills?.map(skill => ({
    name: skill.name,
    category: skill.category,
    proficiency: skill.level?.toLowerCase()  // ⚠️ Convert to lowercase enum
  })),
  
  projects: extractedData.projects?.map(proj => ({
    name: proj.name,
    description: proj.description,
    technologies: proj.technologies?.split(',').map(t => t.trim()), // ⚠️ Split string
    link: proj.link || proj.github
  })),
  
  certifications: extractedData.certifications?.map(cert => ({
    name: cert.name,
    issuer: cert.issuer,
    date: new Date(cert.date),               // ⚠️ Convert to Date
    expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined
  })),
  
  languages: extractedData.languages?.map(lang => ({
    language: lang.name,                     // ⚠️ Rename: name → language
    proficiency: mapProficiency(lang.proficiency) // ⚠️ Map to enum
  })),
  
  achievements: extractedData.achievements?.map(ach => ({
    title: ach.title,
    description: ach.description,
    date: ach.date ? new Date(ach.date) : undefined
  }))
};

function mapProficiency(aiProf?: string): string {
  const map: Record<string, string> = {
    'Native': 'native',
    'Fluent': 'fluent',
    'Professional': 'professional',
    'Professional Working Proficiency': 'professional',
    'Basic': 'limited',
    'Conversational': 'limited',
    'Elementary': 'elementary'
  };
  return map[aiProf || ''] || 'professional';
}
```

---

## 6. Recommendation

**You need to add a transformation layer** in `cvUploadController.ts`:

```typescript
// After AI extraction
const extractedData = await cvParsingService.parsePDF(fileContent, filePath);

// Transform for Profile model
const profileData = transformExtractedDataForProfile(extractedData);

// Save to Profile
const profile = new Profile({
  userId,
  ...profileData  // ← Use transformed data
});
```

Should I implement this transformation layer now?

---

## Current Status

❌ **Direct assignment breaks** because of field mismatches  
❌ **Date strings not converted** to Date objects  
❌ **Enum values don't match** (case sensitivity, different values)  
❌ **Required fields missing** (education.field, experience.achievements)

**This is why your CV upload might be failing or saving incorrect data!**
