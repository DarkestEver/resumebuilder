# ATS PDF Scoring - Testing Guide

## Quick Test Checklist

### Prerequisites
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ User account with AI credits (minimum 150 credits)
- ✅ Sample PDF resume file

### Frontend UI Test

1. **Navigate to Optimize Page**
   ```
   http://localhost:3000/optimize
   ```

2. **Upload PDF (Method 1: Drag & Drop)**
   - Drag a PDF resume file
   - Drop onto the upload area
   - File name and size should appear
   - Click "Analyze Resume" button

3. **Upload PDF (Method 2: Browse)**
   - Click "Browse Files" button
   - Select a PDF from file picker
   - File name and size should appear
   - Click "Analyze Resume" button

4. **Verify Results Display**
   - Overall score (0-100) in circular progress
   - Four category scores with progress bars:
     - Format Score
     - Content Score
     - Keyword Score
     - Structure Score
   - Strengths section (green checkmarks)
   - Weaknesses section (red X marks)
   - Recommendations section (numbered steps)
   - Keyword analysis (found and missing)

5. **Test "Analyze Another Resume"**
   - Click button
   - Should return to upload screen
   - Upload form should be reset

### Error Scenarios to Test

1. **Upload Non-PDF File**
   - Try uploading .docx, .txt, or image file
   - Should show error: "Please upload a PDF file"

2. **Upload Large File**
   - Try uploading file > 10MB
   - Should show error about file size limit

3. **Upload with Insufficient Credits**
   - Test with account having < 150 credits
   - Should show error: "Insufficient AI credits"

4. **Upload Empty/Corrupted PDF**
   - Try uploading invalid PDF
   - Should show error: "Could not extract sufficient text from PDF"

### Backend API Test (using cURL)

**Note**: Replace `YOUR_JWT_TOKEN` with actual JWT from login

```bash
# Test PDF upload endpoint
curl -X POST http://localhost:5000/api/ai/score-resume-pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "pdf=@/path/to/your/resume.pdf"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "formatScore": 85,
    "contentScore": 72,
    "keywordScore": 75,
    "structureScore": 80,
    "sections": [...],
    "strengths": [...],
    "weaknesses": [...],
    "recommendations": [...],
    "keywords": {
      "found": [...],
      "missing": [...]
    },
    "credits_used": 150,
    "credits_remaining": 850
  }
}
```

### Manual Backend Test (Postman/Insomnia)

1. **Create New Request**
   - Method: POST
   - URL: `http://localhost:5000/api/ai/score-resume-pdf`
   - Headers: `Authorization: Bearer <token>`

2. **Add File**
   - Body type: form-data
   - Key: `pdf`
   - Type: File
   - Value: Select PDF file

3. **Send Request**
   - Should receive JSON response with scores
   - Check credits_used and credits_remaining

### Browser DevTools Verification

1. **Network Tab**
   - Look for POST request to `/api/ai/score-resume-pdf`
   - Check request payload (should include PDF file)
   - Check response status (200 OK)
   - Inspect response JSON structure

2. **Console Tab**
   - Should have no errors
   - Check for any warnings

3. **Performance**
   - Typical response time: 10-30 seconds
   - Depends on PDF size and AI processing

### Visual Verification

**Upload Screen Should Show:**
- ✅ Large upload area with border
- ✅ Upload icon (blue)
- ✅ "Drop your resume PDF here" text
- ✅ "Browse Files" button (blue)
- ✅ Three benefit cards (Target, CheckCircle, TrendingUp icons)
- ✅ Gradient background (slate → blue → indigo)

**Results Screen Should Show:**
- ✅ "ATS Compatibility Score" header
- ✅ "Analyze Another Resume" button
- ✅ Large circular score indicator
- ✅ Four horizontal progress bars (color-coded)
- ✅ Two-column layout: Strengths (green) | Weaknesses (red)
- ✅ Recommendations panel (blue background)
- ✅ Keyword section (two columns: found/missing)

### Common Issues & Solutions

**Issue**: "express-fileupload not found"
- Solution: Run `npm install express-fileupload` in backend directory

**Issue**: "pdf-parse not found"
- Solution: Already installed, check backend/package.json

**Issue**: "CORS error"
- Solution: Verify backend CORS settings in app.ts

**Issue**: "401 Unauthorized"
- Solution: Ensure valid JWT token in Authorization header

**Issue**: "Loading forever"
- Solution: Check backend console for OpenAI API errors

**Issue**: "Score not displaying"
- Solution: Check browser console for frontend errors

### Performance Benchmarks

**Expected Processing Times:**
- PDF upload: < 2 seconds
- Text extraction: 1-3 seconds
- AI analysis: 10-30 seconds
- Total: ~15-35 seconds

**File Size Impact:**
- Small PDF (< 1MB): ~15 seconds
- Medium PDF (1-5MB): ~20 seconds
- Large PDF (5-10MB): ~30 seconds

### Credit Usage Verification

1. Check user credits before upload
2. Upload and analyze resume
3. Verify 150 credits deducted
4. Check `credits_remaining` in response
5. Verify database `aiCredits` field updated

### Database Verification

**Check User Credits:**
```javascript
// In MongoDB shell or Compass
db.users.findOne({ email: "test@example.com" }, { aiCredits: 1 })
```

**Should See:**
- Credits decreased by 150 after each analysis
- Credits shown in API response match database

### UI/UX Checks

**Responsive Design:**
- ✅ Test on desktop (1920x1080)
- ✅ Test on tablet (768x1024)
- ✅ Test on mobile (375x667)
- ✅ Verify two-column layout adapts to single column on mobile

**Animations:**
- ✅ Drag hover effect (blue border on dragover)
- ✅ Button hover effects
- ✅ Loading spinner during analysis
- ✅ Smooth transitions

**Accessibility:**
- ✅ Keyboard navigation works
- ✅ File input is accessible
- ✅ Color contrast meets standards
- ✅ Screen reader compatible

### Integration Tests

**End-to-End Flow:**
1. Login with test account
2. Navigate to /optimize
3. Upload PDF
4. Wait for analysis
5. Review results
6. Click "Analyze Another Resume"
7. Upload different PDF
8. Compare results

**Cross-Browser Testing:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

### Success Criteria

Feature is complete when:
- ✅ PDF uploads successfully
- ✅ Text extraction works
- ✅ AI analysis returns scores
- ✅ Credits are deducted correctly
- ✅ Results display properly
- ✅ Error handling works for all edge cases
- ✅ UI is responsive and polished
- ✅ No console errors
- ✅ Performance is acceptable (< 35s total)

---

## Sample Test Resume

For testing, create a simple PDF resume with:
- Contact information (name, email, phone)
- Professional summary
- Work experience (2-3 jobs with bullet points)
- Education section
- Skills section with keywords

**Tools to Create Test PDF:**
- Google Docs (File → Download → PDF)
- Microsoft Word (Save As → PDF)
- Online resume builders
- Previous actual resume

---

## Troubleshooting Commands

**Check backend logs:**
```bash
cd backend
npm run dev
# Watch for errors in console
```

**Check backend file upload config:**
```bash
# In backend/src/app.ts
# Should see: app.use(fileUpload({ ... }))
```

**Verify pdf-parse is installed:**
```bash
cd backend
npm list pdf-parse
# Should show: pdf-parse@1.1.1
```

**Check OpenAI API key:**
```bash
# In backend/.env
# OPENAI_API_KEY=sk-...
```

**Restart servers:**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

**Testing Status**: Ready for manual QA
**Automated Tests**: Can be added using Playwright
**Documentation**: Complete in ATS_SCORING_GUIDE.md
