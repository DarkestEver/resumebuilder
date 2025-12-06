# Playwright Testing Setup

## Installation

```bash
cd C:\Users\dell\Desktop\ProfileBuilder
npm install
npx playwright install chromium
```

## Usage

### Populate Sample Data for Test Accounts

```bash
npm run test:populate
```

This will:
1. Login to each test account
2. Create complete profile with experience, education, skills, etc.
3. Create sample resumes with different templates
4. Logout

### Run All Tests

```bash
npm test
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### View Test Report

```bash
npm run test:report
```

## Test Accounts Being Populated

### 1. John Developer (john.dev@test.com)
- **Role**: Senior Software Engineer
- **Experience**: 8+ years, 3 companies
- **Education**: Stanford CS degree
- **Skills**: JavaScript, React, Node.js, AWS, etc.
- **Resumes**: 2 (Modern + Professional templates)

### 2. Sarah Martinez (sarah.content@test.com)
- **Role**: Content Marketing Specialist
- **Experience**: 5+ years, 2 companies
- **Education**: NYU Marketing degree
- **Skills**: SEO, Copywriting, Social Media, etc.
- **Resumes**: 1 (Creative template)

### 3. Dr. James Smith (dr.smith@test.com)
- **Role**: Internal Medicine Physician
- **Experience**: 10+ years medical practice
- **Education**: Harvard Medical School + MIT
- **Skills**: Internal Medicine, Patient Care, etc.
- **Resumes**: 1 (Professional template)

## Prerequisites

Before running tests:

1. **Backend must be running**:
   ```bash
   cd C:\Users\dell\Desktop\ProfileBuilder
   node server.js
   ```

2. **Frontend must be running** (or will auto-start):
   ```bash
   cd C:\Users\dell\Desktop\ProfileBuilder\frontend
   npm run dev
   ```

3. **MongoDB must be running**

4. **Test accounts must exist** (run seed scripts first):
   ```bash
   node scripts/seed.js
   ```

## Troubleshooting

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Ensure backend and frontend are running
- Check MongoDB connection

### Selectors Not Found
- Update selectors in `populate-sample-data.spec.ts`
- Check if UI has changed
- Use Playwright Inspector: `npx playwright test --debug`

### Data Not Saving
- Check browser console for errors
- Verify API endpoints are working
- Check MongoDB for data

## File Structure

```
ProfileBuilder/
├── tests/
│   └── populate-sample-data.spec.ts  # Main test script
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Test dependencies
└── PLAYWRIGHT_GUIDE.md               # This file
```

## Next Steps

After populating data:

1. **Test the application manually**:
   - Login with populated accounts
   - View profiles, resumes
   - Test AI features
   - Export PDFs

2. **Add more test cases**:
   - Create tests for resume editing
   - Test PDF generation
   - Test AI features
   - Test admin panel

3. **CI/CD Integration**:
   - Add GitHub Actions workflow
   - Run tests on every PR
   - Generate coverage reports
