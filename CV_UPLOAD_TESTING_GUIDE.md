# CV Upload Testing Guide

## ✅ Changes Completed

### Backend Simplification
- ✅ Removed `ProfileCollection` multi-profile support
- ✅ Profile target **always updates** user's single `Profile` document
- ✅ Resume target can **create** or **update** multiple resumes
- ✅ Simplified `UploadOptions` interface (removed unnecessary fields)
- ✅ Updated controller to use `Profile.findOne({ userId })` instead of profile selection

### Frontend Simplification
- ✅ Removed profile selection dropdown
- ✅ Removed "Create New Profile" option
- ✅ Profile upload automatically updates the user's single profile
- ✅ Resume upload shows create/update options (users can have multiple resumes)
- ✅ Cleaner UI with helpful note about profile updates

---

## 🧪 Testing Instructions

### Prerequisites
1. **OpenAI API Key** configured in `backend/.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

2. **Servers Running**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Test Cases

#### Test 1: Upload PDF to Update Profile ✅
**Scenario**: First-time user uploads CV to populate their profile

**Steps**:
1. Go to http://localhost:3000/cv-upload
2. Select **Profile** target
3. Upload a sample PDF resume
4. Wait for AI extraction (2-5 seconds)
5. Verify success message: "Profile updated successfully from CV!"
6. Go to Profile Builder page
7. Verify extracted data is populated

**Expected Result**:
- ✅ Personal info filled (name, title)
- ✅ Contact details filled (email, phone)
- ✅ Work experience added
- ✅ Education added
- ✅ Skills added
- ✅ Projects/certifications/languages/achievements added (if present in CV)

---

#### Test 2: Upload PDF to Create New Resume ✅
**Scenario**: User wants to create a tailored resume from CV

**Steps**:
1. Go to http://localhost:3000/cv-upload
2. Select **Resume** target
3. Click **Create New Resume** button
4. Enter resume title: "Software Engineer Resume"
5. Upload PDF
6. Wait for AI extraction
7. Verify success message: "Resume created successfully from CV!"
8. Go to Resume Dashboard
9. Verify new resume appears in list

**Expected Result**:
- ✅ New resume created with extracted data
- ✅ Resume linked to user's profile
- ✅ Template: modern-professional (default)
- ✅ Visibility: private (default)

---

#### Test 3: Upload PDF to Update Existing Resume ✅
**Scenario**: User wants to update an existing resume with new CV data

**Steps**:
1. Create a resume first (or use existing)
2. Go to CV Upload page
3. Select **Resume** target
4. Click **Update Existing Resume** button
5. Select resume from dropdown
6. Upload different PDF
7. Wait for AI extraction
8. Verify success message: "Resume updated successfully from CV!"
9. Go to Resume Editor
10. Verify data merged/updated

**Expected Result**:
- ✅ Selected resume updated with new CV data
- ✅ Existing customizations preserved
- ✅ lastSyncedAt timestamp updated

---

#### Test 4: AI Extraction Accuracy ⭐
**Scenario**: Test OpenAI extraction quality

**Test PDFs** (use various formats):
- Simple single-page resume
- Multi-page detailed CV
- Resume with multiple jobs
- Resume with projects section
- Resume with certifications
- Resume with languages
- Resume with awards/achievements

**Verification Checklist**:
- [ ] Personal info extracted correctly (name, title)
- [ ] Email extracted correctly
- [ ] Phone number extracted correctly
- [ ] Work experience with dates (YYYY-MM format)
- [ ] Job descriptions extracted
- [ ] Education with degrees
- [ ] Skills categorized properly
- [ ] Projects with tech stack (if present)
- [ ] Certifications with dates (if present)
- [ ] Languages with proficiency (if present)
- [ ] Achievements/awards (if present)

**Accuracy Target**: 85-95%

---

#### Test 5: Error Handling 🛡️

**Test 5a: Invalid File Type**
- Upload .docx or .txt file
- Expected: "Only PDF files are supported"

**Test 5b: File Too Large**
- Upload PDF > 10MB
- Expected: "File size exceeds 10MB limit"

**Test 5c: Empty Resume Title (Create Mode)**
- Select Resume → Create New
- Don't enter title
- Upload PDF
- Expected: "Please enter a resume title"

**Test 5d: No Resume Selected (Update Mode)**
- Select Resume → Update Existing
- Don't select resume
- Upload PDF
- Expected: "Please select a resume to update"

**Test 5e: AI Extraction Failure**
- Temporarily invalidate OpenAI key or disconnect internet
- Upload PDF
- Expected: Falls back to regex extraction (~40% accuracy)
- User should still see success message (graceful degradation)

---

## 📊 Expected AI Extraction Output

### Sample Input (Resume Text):
```
John Doe
Senior Software Engineer

Email: john.doe@example.com
Phone: +1-555-0123

EXPERIENCE
Software Engineer at Tech Corp
Jan 2020 - Present
- Developed microservices using Node.js
- Improved system performance by 40%

EDUCATION
BS Computer Science
MIT | 2016-2020 | GPA: 3.8

SKILLS
JavaScript, Python, React, Node.js

PROJECTS
E-commerce Platform
Built full-stack app with MERN stack
GitHub: github.com/johndoe/ecommerce
```

### Expected Extracted Data (JSON):
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Senior Software Engineer"
  },
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1-555-0123"
  },
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "startDate": "2020-01",
      "endDate": "Present",
      "current": true,
      "description": "Developed microservices using Node.js. Improved system performance by 40%."
    }
  ],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "MIT",
      "startDate": "2016-01",
      "endDate": "2020-01",
      "gpa": "3.8"
    }
  ],
  "skills": [
    { "name": "JavaScript", "level": "intermediate" },
    { "name": "Python", "level": "intermediate" },
    { "name": "React", "level": "intermediate" },
    { "name": "Node.js", "level": "intermediate" }
  ],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Built full-stack app with MERN stack",
      "github": "github.com/johndoe/ecommerce"
    }
  ]
}
```

---

## 🔍 Monitoring & Debugging

### Backend Logs
Watch terminal for:
```
CV parsed with AI (2847 tokens)  ✅ Success
AI CV extraction failed, falling back to regex  ⚠️ Fallback
```

### Check Database
```javascript
// MongoDB console
db.profiles.find({ userId: "your-user-id" })
db.resumes.find({ userId: "your-user-id" })
```

### Token Usage Tracking
- Each extraction logs token count
- Monitor costs: ~$0.001-$0.003 per CV
- Monthly estimate: 1000 CVs = ~$2-3

---

## 📝 Sample Test PDFs

### Where to Get Test Resumes:
1. **Your own resume** (best for real-world testing)
2. **Generate fake resume**: https://www.resume.com/templates
3. **Download samples**: Search "sample software engineer resume PDF"
4. **Use online resume builders**: Canva, Zety, etc.

### Recommended Test Suite:
1. **Simple 1-page** - Basic info, 1-2 jobs
2. **Detailed 2-page** - Multiple jobs, projects, certifications
3. **Academic CV** - Heavy on education, research, publications
4. **Executive resume** - Leadership roles, achievements
5. **Technical resume** - Lots of skills, projects, GitHub links

---

## ✅ Success Criteria

After testing, verify:

- [ ] Profile upload works (updates single profile)
- [ ] Resume create works (links to profile)
- [ ] Resume update works (preserves customizations)
- [ ] AI extraction accuracy ≥ 85%
- [ ] All 10+ field categories extracted
- [ ] Date formats normalized (YYYY-MM)
- [ ] Skills categorized properly
- [ ] Error handling graceful
- [ ] File cleanup after upload
- [ ] No API key leaks in logs
- [ ] Token usage logged correctly

---

## 🐛 Known Issues / Edge Cases

### Issue 1: Very Long Resumes (>10 pages)
- **Symptom**: Text truncated at 8000 chars
- **Impact**: Later sections may not extract
- **Workaround**: Use summary or split into sections

### Issue 2: Non-English Resumes
- **Symptom**: Lower extraction accuracy
- **Impact**: Names/skills may be misinterpreted
- **Future**: Add language detection + multilingual models

### Issue 3: Scanned/Image PDFs
- **Symptom**: No text extracted with pdf-parse
- **Solution**: Tesseract OCR kicks in (already implemented)
- **Note**: OCR takes 5-10 seconds longer

### Issue 4: Complex Layouts (Tables, Columns)
- **Symptom**: Text order scrambled
- **Impact**: Sections may merge incorrectly
- **Mitigation**: AI prompt handles various formats well

---

## 🚀 Next Steps After Testing

1. **Gather Metrics**:
   - Track extraction accuracy (user corrections)
   - Monitor token costs
   - Identify common failure patterns

2. **Improve Prompt**:
   - Add examples for edge cases
   - Refine JSON schema based on failures
   - Add confidence scores per field

3. **Add Features**:
   - Show extraction confidence to user
   - Highlight low-confidence fields for review
   - Add "Review Extracted Data" step before save
   - Allow manual corrections with feedback loop

4. **Optimize Costs**:
   - Implement Redis caching (hash-based)
   - Use cheaper models for simple resumes
   - Batch processing for bulk uploads

---

## 📞 Support

If AI extraction fails or produces incorrect results:

1. Check OpenAI API key is valid
2. Verify internet connectivity
3. Check backend logs for specific errors
4. Try with simpler PDF first
5. Report issue with PDF example for debugging

---

**Status**: Ready for Testing 🎉  
**Git Commit**: `caa09a2`  
**Next**: Upload a PDF and test AI extraction!
