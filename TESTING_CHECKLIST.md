/**
 * Manual UI Testing Checklist - Comprehensive Testing Guide
 * Covers all 15+ pages and critical user interactions
 * Last Updated: 2024
 */

# UI TESTING CHECKLIST - Resume Builder Platform

## Testing Methodology
- **Test Environment**: Local development (http://localhost:3000)
- **Test Users**: Use TEST_CREDENTIALS from scripts/dummyData.ts
- **Browsers**: Chrome 120+, Firefox 121+, Safari 17+, Edge 123+
- **Devices**: Desktop (1920x1080), Laptop (1440x900), Tablet (768x1024), Mobile (375x667)

---

## Phase 1: Authentication Pages

### 1.1 Login Page (`/auth/login`)
- [ ] Page loads without errors
- [ ] Form displays email and password fields
- [ ] "Remember me" checkbox present and functional
- [ ] "Forgot password" link navigates correctly
- [ ] "Sign up" link navigates to registration page
- [ ] Form validation:
  - [ ] Empty email shows error message
  - [ ] Invalid email format shows error
  - [ ] Empty password shows error
  - [ ] Password < 8 characters shows error
- [ ] Successful login:
  - [ ] User redirected to dashboard
  - [ ] Auth token stored in localStorage
  - [ ] User info displayed in header/profile menu
- [ ] Error handling:
  - [ ] Wrong credentials show error message
  - [ ] Network error displays user-friendly message
- [ ] Responsive design:
  - [ ] Mobile: Form stacks vertically
  - [ ] Tablet: 2-column layout
  - [ ] Desktop: Centered form
- [ ] Accessibility:
  - [ ] Tab navigation works
  - [ ] Screen reader detects labels
  - [ ] Keyboard Enter submits form

### 1.2 Registration Page (`/auth/register`)
- [ ] Page loads without errors
- [ ] Form displays all required fields:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Email
  - [ ] Password
  - [ ] Confirm Password
  - [ ] Terms & Conditions checkbox
- [ ] Form validation:
  - [ ] Empty first name shows error
  - [ ] Empty last name shows error
  - [ ] Invalid email format shows error
  - [ ] Password < 8 characters shows error
  - [ ] Password mismatch shows error
  - [ ] Unchecked T&C prevents submission
- [ ] Password requirements visible:
  - [ ] At least 8 characters
  - [ ] Uppercase letter required
  - [ ] Number required
  - [ ] Special character required
- [ ] Successful registration:
  - [ ] Account created
  - [ ] Verification email sent (check console/logs)
  - [ ] Redirect to login or verification page
  - [ ] Success message displayed
- [ ] Link to login page works
- [ ] Responsive on all devices

### 1.3 Email Verification Page (`/auth/verify-email`)
- [ ] Page loads after registration
- [ ] Verification token input field present
- [ ] Resend verification email button works
- [ ] Valid token:
  - [ ] Shows success message
  - [ ] Redirects to login
  - [ ] Account marked as verified in backend
- [ ] Invalid/expired token:
  - [ ] Shows error message
  - [ ] Resend button functional
- [ ] Countdown timer for resend works
- [ ] Loading state displays during verification

### 1.4 Password Reset Flow
- [ ] "Forgot Password" page accessible
- [ ] Email submission:
  - [ ] Validates email format
  - [ ] Shows success message
  - [ ] Reset link sent (check logs)
- [ ] Reset token page:
  - [ ] New password form displays
  - [ ] Password validation works
  - [ ] Successful reset shows confirmation
  - [ ] Redirects to login

---

## Phase 2: Dashboard & Navigation

### 2.1 Main Dashboard (`/app/dashboard`)
- [ ] Page loads for authenticated users
- [ ] Redirects unauthenticated users to login
- [ ] Sidebar navigation:
  - [ ] All menu items visible
  - [ ] Active menu item highlighted
  - [ ] Links navigate to correct pages
  - [ ] Collapse/expand works on mobile
- [ ] Header elements:
  - [ ] Logo present and clickable
  - [ ] User profile menu displays
  - [ ] Notification bell shows (if new notifications)
  - [ ] Logout button works
  - [ ] Search bar functional
- [ ] Main content area:
  - [ ] Welcome message displays
  - [ ] Recent resumes list shows
  - [ ] Quick action buttons present (Create Resume, Upload CV)
  - [ ] Statistics/cards display correctly
- [ ] Responsive:
  - [ ] Mobile: Hamburger menu works
  - [ ] Tablet: Sidebar collapses
  - [ ] Desktop: Full sidebar visible

### 2.2 Header/Navigation Bar
- [ ] Logo clickable (goes to dashboard)
- [ ] User profile dropdown:
  - [ ] Shows user name
  - [ ] Shows subscription tier
  - [ ] Links to profile settings
  - [ ] Shows logout option
- [ ] Notification bell:
  - [ ] Shows unread count badge
  - [ ] Dropdown displays recent notifications
  - [ ] Clicking notification navigates to context
- [ ] Search bar:
  - [ ] Autocomplete suggestions appear
  - [ ] Debouncing works (no excessive API calls)
  - [ ] Results display correctly
- [ ] Mobile menu:
  - [ ] Opens/closes smoothly
  - [ ] All navigation items accessible
  - [ ] Closes when item clicked

---

## Phase 3: Profile Management

### 3.1 Profile Edit Page (`/app/profile`)
- [ ] Page loads with current profile data
- [ ] All fields display and are editable:
  - [ ] First Name / Last Name
  - [ ] Title / Job Title
  - [ ] Email / Phone
  - [ ] Location
  - [ ] Professional Summary (textarea)
  - [ ] Profile Photo (upload)
- [ ] Form sections:
  - [ ] Personal Information
  - [ ] Contact Information
  - [ ] Professional Summary
  - [ ] Skills (add/remove tags)
  - [ ] Experience (add/edit/delete)
  - [ ] Education (add/edit/delete)
  - [ ] Certifications
  - [ ] Languages
  - [ ] Projects / Portfolio links
- [ ] Skills management:
  - [ ] Add skill input with autocomplete
  - [ ] Remove skill button works
  - [ ] Skills display as tags
  - [ ] Save updates skills
- [ ] Experience section:
  - [ ] Add experience form displays
  - [ ] Fields: Title, Company, Start Date, End Date, Description
  - [ ] Can add multiple experiences
  - [ ] Edit existing experience
  - [ ] Delete experience with confirmation
- [ ] Education section:
  - [ ] Add education form displays
  - [ ] Fields: School, Degree, Field, Graduation Year
  - [ ] Can add multiple education entries
  - [ ] Date picker works for graduation year
- [ ] Form submission:
  - [ ] Save button submits changes
  - [ ] Loading state displays
  - [ ] Success message shows
  - [ ] Data persists after refresh
- [ ] Validation:
  - [ ] Required fields highlighted
  - [ ] Email format validated
  - [ ] Phone format validated
- [ ] Responsive:
  - [ ] Mobile: Forms stack vertically
  - [ ] Tablet: 2-column layout
  - [ ] Desktop: Full width

### 3.2 Profile Picture Upload
- [ ] Upload button present
- [ ] File picker opens
- [ ] Accepts image formats (JPG, PNG)
- [ ] Rejects non-image files
- [ ] Shows file size limit (e.g., 5MB)
- [ ] Preview displays before upload
- [ ] Upload progress visible
- [ ] Success message after upload
- [ ] Image displays in profile and header

---

## Phase 4: Resume Editor

### 4.1 Resume List (`/app/resumes`)
- [ ] Page loads and displays all user resumes
- [ ] Resume cards show:
  - [ ] Resume title
  - [ ] Template used
  - [ ] Creation date
  - [ ] Last modified date
  - [ ] Visibility status (Public/Private)
  - [ ] Action buttons (Edit, Download, Share, Delete)
- [ ] Create Resume button present
- [ ] Search/filter resumes
- [ ] Sort by date/name
- [ ] Pagination works (if 10+ resumes)
- [ ] Delete resume:
  - [ ] Confirmation dialog appears
  - [ ] Resume deleted after confirmation
  - [ ] List updated
- [ ] Responsive:
  - [ ] Mobile: Single column cards
  - [ ] Tablet: 2-column grid
  - [ ] Desktop: 3-column grid

### 4.2 Resume Editor (`/app/resume/[id]`)
- [ ] Page loads with resume data
- [ ] Left panel shows profile data
- [ ] Right panel shows live preview
- [ ] Template selector dropdown works
- [ ] Switching templates:
  - [ ] Preview updates immediately
  - [ ] Data preserved when switching
  - [ ] Styling changes correctly
- [ ] Edit sections:
  - [ ] Personal info editable
  - [ ] Summary editable
  - [ ] Experience editable/addable
  - [ ] Education editable/addable
  - [ ] Skills editable/addable
  - [ ] Certifications editable
- [ ] Preview pane:
  - [ ] Updates in real-time
  - [ ] Zoom in/out works
  - [ ] Page breaks visible (for PDF)
  - [ ] Colors/styling visible
- [ ] Save functionality:
  - [ ] Auto-save works (every 10 seconds)
  - [ ] Manual save button works
  - [ ] Success notification shows
  - [ ] Unsaved changes warning on navigation
- [ ] Keyboard shortcuts:
  - [ ] Ctrl+S / Cmd+S saves
  - [ ] Tab navigation works
- [ ] Responsive:
  - [ ] Mobile: Single column (editor only)
  - [ ] Tablet: Stacked editor and preview
  - [ ] Desktop: Side-by-side layout

### 4.3 Resume Export
- [ ] Export button present in resume editor
- [ ] Download options:
  - [ ] PDF format
  - [ ] DOCX format
  - [ ] TXT format (if applicable)
- [ ] Download functionality:
  - [ ] File downloads successfully
  - [ ] Filename matches resume title
  - [ ] File opens correctly in appropriate application
  - [ ] No corrupted data
- [ ] Export settings:
  - [ ] Color/B&W options
  - [ ] Page size selection
  - [ ] Margin customization (if applicable)
- [ ] Loading state:
  - [ ] Progress bar displays
  - [ ] Cancel button works
  - [ ] Prevents multiple simultaneous downloads

---

## Phase 5: Template Management

### 5.1 Template Gallery (`/templates`)
- [ ] Page loads with all 30+ templates
- [ ] Template cards display:
  - [ ] Template preview image
  - [ ] Template name
  - [ ] Category tag
  - [ ] "Use Template" button
  - [ ] "Preview" button
- [ ] Filtering works:
  - [ ] Filter by category (Tech, Finance, Healthcare, etc.)
  - [ ] Filter by industry
  - [ ] Search by name
- [ ] Sorting:
  - [ ] Most popular
  - [ ] Recently added
  - [ ] A-Z
- [ ] Template preview:
  - [ ] Opens in modal/new page
  - [ ] Full-page preview displays
  - [ ] Close button works
  - [ ] "Use This Template" button in preview
- [ ] Use template flow:
  - [ ] Opens resume editor with template
  - [ ] Sample data populates
  - [ ] Template styling applies correctly
- [ ] Responsive:
  - [ ] Mobile: 1 column
  - [ ] Tablet: 2 columns
  - [ ] Desktop: 3-4 columns

### 5.2 Template Selector in Editor
- [ ] Dropdown shows all available templates
- [ ] Search/filter in dropdown works
- [ ] Selecting template:
  - [ ] Preview updates immediately
  - [ ] Data preserved
  - [ ] No data loss during switch
- [ ] Template customization:
  - [ ] Color picker works
  - [ ] Font selection works (if applicable)
  - [ ] Section visibility toggles work
- [ ] Responsive on all devices

---

## Phase 6: CV Upload & Parsing

### 6.1 CV Upload Page (`/app/cv-upload`)
- [ ] Page loads with upload area
- [ ] Drag & drop zone:
  - [ ] Shows drop indicator on drag
  - [ ] File accepted on drop
  - [ ] Accepted file types shown
  - [ ] File size limit displayed (10MB)
- [ ] File picker button:
  - [ ] Opens file dialog
  - [ ] Accepts PDF, DOCX, DOC, RTF, TXT, JPG, PNG
  - [ ] Shows loading state during upload
- [ ] Upload progress:
  - [ ] Progress bar visible
  - [ ] Percentage shows
  - [ ] Cancel button works
  - [ ] Speed/time remaining shown
- [ ] Parsing results:
  - [ ] Extracted data displays
  - [ ] User can review data before import
  - [ ] Can edit extracted information
  - [ ] Import button populates profile
- [ ] Error handling:
  - [ ] File too large: shows error
  - [ ] Unsupported format: shows error
  - [ ] Corrupted file: shows error
  - [ ] Network error: user-friendly message
- [ ] Post-upload:
  - [ ] Redirect to profile edit
  - [ ] Or show confirmation
  - [ ] Option to upload another file
- [ ] FAQ section:
  - [ ] 5+ FAQs visible
  - [ ] Expandable/collapsible
  - [ ] Clear and helpful

---

## Phase 7: Search & Discovery

### 7.1 Search Page (`/search`)
- [ ] Hero section displays
- [ ] Search bar functional:
  - [ ] Accepts text input
  - [ ] Autocomplete suggestions appear
  - [ ] Debounced (no excessive API calls)
- [ ] Results display:
  - [ ] Resume cards show
  - [ ] Title, author, skills visible
  - [ ] Relevance/ranking shown
  - [ ] Pagination works
- [ ] Filters work:
  - [ ] By role/title
  - [ ] By location
  - [ ] By skills
  - [ ] By experience level
  - [ ] By availability
- [ ] Trending section:
  - [ ] Shows popular resumes
  - [ ] Shows trending skills
  - [ ] Click navigates to results
- [ ] Categories section:
  - [ ] Shows all job categories
  - [ ] Click filters by category
- [ ] Result interactions:
  - [ ] Click resume opens public profile
  - [ ] Download option (if available)
  - [ ] Share option works
  - [ ] View count displayed
- [ ] Empty results:
  - [ ] "No results" message
  - [ ] Suggests alternative searches
- [ ] Responsive on all devices

### 7.2 Search Bar Component
- [ ] Appears in header
- [ ] Input accepts text
- [ ] Suggestions display:
  - [ ] Profile suggestions
  - [ ] Skill suggestions
  - [ ] Category suggestions
  - [ ] Recent searches
- [ ] Search submission:
  - [ ] Enter key submits
  - [ ] Search icon button works
  - [ ] Navigates to search page with query
- [ ] Mobile responsive:
  - [ ] Expands on focus
  - [ ] Keyboard appears on mobile

---

## Phase 8: Public Profiles & Sharing

### 8.1 Public Resume View (`/r/[id]`)
- [ ] Public resumes display correctly
- [ ] Private resumes:
  - [ ] Show access denied message
  - [ ] No data leakage
- [ ] Password-protected resumes:
  - [ ] Prompt for password
  - [ ] Validate password
  - [ ] Show resume after verification
- [ ] Expiring link resumes:
  - [ ] Check expiration
  - [ ] Show "expired" message if past due
- [ ] Resume display:
  - [ ] Correct template rendering
  - [ ] All data visible
  - [ ] Styling preserved
  - [ ] No edit options (read-only)
- [ ] Public resume interactions:
  - [ ] Download button works
  - [ ] Print preview works
  - [ ] Share button works
  - [ ] View counter increments
  - [ ] Like button works (if enabled)
- [ ] Analytics tracking:
  - [ ] View recorded
  - [ ] Device/location tracked (anonymized)
- [ ] Responsive:
  - [ ] Mobile: Single column
  - [ ] Tablet: Proper margins
  - [ ] Desktop: 800px centered layout

### 8.2 Public Profile Page (`/[username]`)
- [ ] Profile displays for public profiles
- [ ] Shows:
  - [ ] Profile photo
  - [ ] Name and title
  - [ ] Professional summary
  - [ ] Skills
  - [ ] Experience (summary)
  - [ ] All public resumes
  - [ ] Links (LinkedIn, GitHub, portfolio)
- [ ] Interactions:
  - [ ] View resume button
  - [ ] Download CV option
  - [ ] Contact button
  - [ ] Message button (if applicable)
- [ ] Private profiles:
  - [ ] Show only public information
  - [ ] Respect privacy settings
- [ ] Responsive on all devices

### 8.3 Share Resume Feature
- [ ] Share button opens modal
- [ ] Share options:
  - [ ] Copy link button (to clipboard)
  - [ ] Share via Email link
  - [ ] Share via LinkedIn
  - [ ] Share via Twitter
  - [ ] QR code generation
- [ ] Link customization:
  - [ ] Expiry date selection
  - [ ] Password option
  - [ ] View-only vs. download options
- [ ] Success messages:
  - [ ] "Link copied" confirmation
  - [ ] Share link preview
  - [ ] Expiry info shown
- [ ] Link management:
  - [ ] View all shared links
  - [ ] Revoke link option
  - [ ] Edit permissions
  - [ ] View share statistics

---

## Phase 9: Activity & Notifications

### 9.1 Activity Feed (`/app/activity`)
- [ ] Page loads with activity feed
- [ ] Activity items display:
  - [ ] Profile view activity
  - [ ] Resume download activity
  - [ ] Share activity
  - [ ] Like/comment activity (if applicable)
  - [ ] Timestamp for each
  - [ ] User/source info
- [ ] Filtering:
  - [ ] Filter by activity type
  - [ ] Filter by date range
- [ ] Pagination works
- [ ] Mark as read:
  - [ ] Click item marks as read
  - [ ] Unread indicator visible
  - [ ] Bulk mark as read option
- [ ] Responsive layout
- [ ] Empty state: helpful message

### 9.2 Notification Bell
- [ ] Bell icon in header
- [ ] Unread count badge shows
- [ ] Click opens notification dropdown
- [ ] Notifications display:
  - [ ] Message text
  - [ ] Type icon
  - [ ] Timestamp
  - [ ] Action button (if applicable)
- [ ] Click notification:
  - [ ] Navigates to relevant page
  - [ ] Marks as read
- [ ] Mark all as read button works
- [ ] Notification preferences accessible
- [ ] Mobile: Notification access via menu

### 9.3 Real-time Updates (Socket.io)
- [ ] Activity updates in real-time
- [ ] Notifications push without page refresh
- [ ] Connection status indicator (optional)
- [ ] Offline handling:
  - [ ] Works when reconnecting
  - [ ] Shows queue if offline
  - [ ] Syncs data on reconnect
- [ ] No performance degradation

---

## Phase 10: Email Preferences

### 10.1 Email Preferences Page (`/app/email-preferences`)
- [ ] Page loads with current settings
- [ ] Toggle switches for:
  - [ ] Marketing emails
  - [ ] Notification emails
  - [ ] Weekly digest
  - [ ] Resume view alerts
  - [ ] New job matches
  - [ ] Platform updates
- [ ] Each toggle:
  - [ ] Changes color on toggle
  - [ ] Shows confirmation message
  - [ ] Auto-saves (or manual save button)
- [ ] Unsubscribe option:
  - [ ] Unsubscribe from all button
  - [ ] Confirmation dialog
  - [ ] Confirmation email sent
- [ ] Email frequency selection:
  - [ ] Daily / Weekly / Monthly options
  - [ ] Apply to relevant categories
- [ ] Save functionality:
  - [ ] Manual save button (if not auto-save)
  - [ ] Success message
  - [ ] Data persists
- [ ] Responsive design
- [ ] Accessibility:
  - [ ] Labels properly associated
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatible

---

## Phase 11: Video Profiles

### 11.1 Video Upload (`/app/video-profile`)
- [ ] Page loads with upload UI
- [ ] Upload section:
  - [ ] Drag & drop zone
  - [ ] File picker button
  - [ ] Accepted formats shown (MP4, WebM, etc.)
  - [ ] Size limit displayed (100MB)
- [ ] File selection:
  - [ ] Video formats accepted
  - [ ] Other formats rejected
  - [ ] Size validation
- [ ] Upload progress:
  - [ ] Progress bar visible
  - [ ] Percentage and speed shown
  - [ ] Cancel button works
- [ ] Video processing:
  - [ ] Shows processing status
  - [ ] Duration auto-detected
  - [ ] Thumbnail generated
- [ ] Tips section:
  - [ ] 6+ helpful tips visible
  - [ ] Clear instructions
  - [ ] Best practices shown
- [ ] Post-upload:
  - [ ] Video playable
  - [ ] Edit metadata (title, description)
  - [ ] Set visibility (public/private)
  - [ ] Share options
- [ ] Error handling:
  - [ ] File too large: error message
  - [ ] Unsupported format: error message
  - [ ] Network error: user-friendly message
- [ ] Responsive on mobile

### 11.2 Video Gallery (`/videos`)
- [ ] Page loads with video grid
- [ ] Filters:
  - [ ] Popular tab
  - [ ] Recent tab
  - [ ] My videos tab (if authenticated)
  - [ ] Search by title/tags
- [ ] Video cards show:
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Duration
  - [ ] View count
  - [ ] Like count
- [ ] Click video:
  - [ ] Opens video player
  - [ ] Full-screen works
  - [ ] Play/pause controls
- [ ] Responsive:
  - [ ] Mobile: 1-2 column grid
  - [ ] Tablet: 2-3 columns
  - [ ] Desktop: 3-4 columns

### 11.3 Video Player
- [ ] Video plays correctly
- [ ] Controls:
  - [ ] Play/pause
  - [ ] Volume control
  - [ ] Progress bar
  - [ ] Full-screen
  - [ ] Quality selection (if available)
- [ ] Stats displayed:
  - [ ] View count
  - [ ] Like count
  - [ ] Duration
- [ ] Interactions:
  - [ ] Like button works
  - [ ] Share button works
  - [ ] Comment section (if enabled)
- [ ] Keyboard controls:
  - [ ] Space to play/pause
  - [ ] Arrow keys for seek
  - [ ] F for full-screen

---

## Phase 12: Admin Dashboard

### 12.1 Admin Dashboard (`/app/admin/dashboard`)
- [ ] Admin access only (authorization check)
- [ ] Statistics displayed:
  - [ ] Total users
  - [ ] Total resumes
  - [ ] Total revenue (if applicable)
  - [ ] Platform health status
- [ ] Cards show:
  - [ ] Current values
  - [ ] Trend indicators (up/down)
  - [ ] Comparison to previous period
- [ ] Tab navigation:
  - [ ] Overview tab
  - [ ] Users tab
  - [ ] Resumes tab
  - [ ] Activity logs tab
  - [ ] Reports tab (if applicable)
- [ ] Overview tab:
  - [ ] Summary statistics
  - [ ] Recent activities
  - [ ] Active users
- [ ] Users tab:
  - [ ] User list/table
  - [ ] Search by email
  - [ ] Sort by join date, activity, etc.
  - [ ] Ban/unban user buttons
  - [ ] View user details
  - [ ] Confirmation dialogs for actions
- [ ] Activity logs tab:
  - [ ] Admin action logs
  - [ ] Filter by action type
  - [ ] Filter by date range
  - [ ] Pagination
  - [ ] Show: who, what, when, resource
- [ ] Responsive:
  - [ ] Mobile: Vertical tab navigation
  - [ ] Tablets: All tabs accessible
  - [ ] Desktop: Sidebar + main content

---

## Phase 13: Resume Optimization (ATS/Advanced)

### 13.1 Resume Analyzer (`/app/optimize`)
- [ ] Page loads
- [ ] Resume selector:
  - [ ] Dropdown with user's resumes
  - [ ] Select resume to analyze
  - [ ] Load button triggers analysis
- [ ] ATS Score display:
  - [ ] Circular progress indicator
  - [ ] Score out of 100
  - [ ] Color-coded (green/yellow/red)
  - [ ] Score breakdown by category:
    - [ ] Format
    - [ ] Readability
    - [ ] Keyword optimization
    - [ ] Structure
- [ ] Strengths section:
  - [ ] List of positive aspects
  - [ ] Checkmark icons
- [ ] Weaknesses/Improvements:
  - [ ] List of areas for improvement
  - [ ] Suggestions provided
  - [ ] Actionable items
- [ ] Job description matching:
  - [ ] Paste job description input
  - [ ] Analyze button
  - [ ] Match score displayed
  - [ ] Matched keywords highlighted
  - [ ] Missing keywords listed
- [ ] Tips section:
  - [ ] 6+ optimization tips
  - [ ] Clear instructions
  - [ ] Examples provided
- [ ] Loading states:
  - [ ] Loading spinner during analysis
  - [ ] Disable buttons while processing
  - [ ] Estimated time shown
- [ ] Responsive on all devices

---

## Phase 14: Subscription & Payments

### 14.1 Subscription Page (`/app/subscription` or `/pricing`)
- [ ] Pricing tiers displayed:
  - [ ] Free tier card
  - [ ] Pro tier card
  - [ ] Enterprise tier card
- [ ] Each tier shows:
  - [ ] Price per month/year
  - [ ] Feature list
  - [ ] CTA button (Subscribe / Upgrade / Contact)
- [ ] Feature comparison:
  - [ ] Table comparing features
  - [ ] Feature descriptions
  - [ ] Checkmarks for included features
- [ ] Currently subscribed tier:
  - [ ] Highlighted/distinguished
  - [ ] Shows "Current Plan" badge
- [ ] Subscription actions:
  - [ ] Upgrade button works
  - [ ] Downgrade button works (if applicable)
  - [ ] Cancel subscription option
- [ ] Payment flow:
  - [ ] Payment info form
  - [ ] Card validation
  - [ ] Secure payment (Stripe badge)
  - [ ] Confirmation email sent
- [ ] Billing information:
  - [ ] Current billing date
  - [ ] Next renewal date
  - [ ] Download invoices option
- [ ] Responsive on all devices

---

## Phase 15: Settings & Account Management

### 15.1 Account Settings (`/app/settings`)
- [ ] Page loads with settings options
- [ ] Sections:
  - [ ] Account Information
  - [ ] Password & Security
  - [ ] Privacy Settings
  - [ ] Notification Preferences
  - [ ] Billing Information
- [ ] Account Information:
  - [ ] Edit name/email
  - [ ] Change profile photo
  - [ ] Username (if applicable)
  - [ ] Save changes button
- [ ] Password & Security:
  - [ ] Change password form
  - [ ] Current password required
  - [ ] New password validation
  - [ ] Two-factor authentication option
- [ ] Privacy Settings:
  - [ ] Profile visibility (Public/Private)
  - [ ] Search indexing option
  - [ ] Data collection preferences
  - [ ] Download data option
- [ ] Notification Preferences:
  - [ ] Links to email preferences page
  - [ ] Quick toggles for key options
- [ ] Billing Information:
  - [ ] Current plan display
  - [ ] Billing address
  - [ ] Payment method
  - [ ] Download invoices
- [ ] Delete Account:
  - [ ] Option present (careful placement)
  - [ ] Confirmation dialog
  - [ ] Warn about data loss
- [ ] Responsive design
- [ ] Accessibility compliant

### 15.2 Logout Functionality
- [ ] Logout button in user menu
- [ ] Logout redirects to login page
- [ ] Auth token removed
- [ ] Session cleared
- [ ] Works on all pages

---

## Phase 16: Error & Loading States

### 16.1 Error Handling
- [ ] 404 Page Not Found:
  - [ ] Informative message
  - [ ] Navigation back option
  - [ ] Suggested pages
- [ ] 500 Server Error:
  - [ ] User-friendly message
  - [ ] Contact support option
  - [ ] Retry button
- [ ] Network Error:
  - [ ] "Check your connection" message
  - [ ] Retry button
  - [ ] Auto-retry logic
- [ ] Form Validation Errors:
  - [ ] Inline error messages
  - [ ] Field highlighting
  - [ ] Clear instructions
- [ ] Authorization Errors:
  - [ ] 403 Forbidden message
  - [ ] Redirect to home
  - [ ] Suggest login if needed

### 16.2 Loading States
- [ ] Page load spinners
- [ ] Skeleton screens on data load
- [ ] Button loading states:
  - [ ] Disabled while loading
  - [ ] Spinner visible
  - [ ] Text changes (e.g., "Saving...")
- [ ] Form submission:
  - [ ] Loading state shows
  - [ ] Submit button disabled
  - [ ] Cancel option available
- [ ] Data fetch:
  - [ ] Loading indicator visible
  - [ ] Timeout handling
  - [ ] Partial content (if streaming)

---

## Phase 17: Cross-Browser & Responsive Testing

### 17.1 Browser Compatibility
- [ ] Chrome 120+: All features work
- [ ] Firefox 121+: All features work
- [ ] Safari 17+: All features work
- [ ] Edge 123+: All features work
- [ ] Mobile browsers:
  - [ ] Chrome Android
  - [ ] Safari iOS
  - [ ] Firefox Android

### 17.2 Device Responsiveness
- [ ] Mobile (375x667):
  - [ ] All text readable
  - [ ] Touch targets minimum 44px
  - [ ] No horizontal scroll
  - [ ] Forms usable
- [ ] Tablet (768x1024):
  - [ ] Proper column layout
  - [ ] Touch-friendly buttons
  - [ ] Images proportional
- [ ] Desktop (1920x1080):
  - [ ] Full layout displayed
  - [ ] No excessive whitespace
  - [ ] Readable text widths

### 17.3 Screen Orientations
- [ ] Portrait mode: Proper layout
- [ ] Landscape mode: Proper layout
- [ ] Orientation change: Smooth transition

---

## Phase 18: Accessibility Testing

### 18.1 Color Contrast
- [ ] WCAG AA standards met
- [ ] Text on backgrounds: Sufficient contrast
- [ ] Links distinguishable
- [ ] Color not only indicator (icons/text also)

### 18.2 Keyboard Navigation
- [ ] Tab key navigates all interactive elements
- [ ] Logical tab order
- [ ] Focus visible (visual indicator)
- [ ] No keyboard traps
- [ ] Enter/Space activates buttons
- [ ] Arrow keys for menus/sliders

### 18.3 Screen Reader
- [ ] Images have alt text
- [ ] Form labels associated
- [ ] Headings proper hierarchy (H1, H2, etc.)
- [ ] Lists marked as lists
- [ ] Tables have headers
- [ ] Dynamic content announced

### 18.4 Motion & Animation
- [ ] Animations not seizure-inducing
- [ ] Reduce motion respected (prefers-reduced-motion)
- [ ] Animations can be disabled
- [ ] No auto-playing video with sound

---

## Phase 19: Performance Testing

### 19.1 Page Load Performance
- [ ] First Contentful Paint < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 5s
- [ ] Images optimized/lazy-loaded
- [ ] CSS/JS minified

### 19.2 Network Throttling
- [ ] 3G: Pages usable (though slower)
- [ ] 4G: Normal performance
- [ ] Offline: Graceful degradation

### 19.3 Browser DevTools
- [ ] Console: No errors (warnings acceptable)
- [ ] Network tab: No failed requests
- [ ] Performance tab: No long tasks
- [ ] Lighthouse score: 90+

---

## Phase 20: Data Integrity & Edge Cases

### 20.1 Data Persistence
- [ ] Form data saved on form submission
- [ ] Draft data saved (if applicable)
- [ ] Data survives page refresh
- [ ] Multiple tabs sync (if applicable)

### 20.2 Concurrent Operations
- [ ] Multiple resume edits: Last one wins
- [ ] Multiple uploads: Queued properly
- [ ] Delete during upload: Handled gracefully

### 20.3 Large Data Handling
- [ ] 50+ resumes load
- [ ] 100+ skills load
- [ ] Long text fields (2000+ chars)
- [ ] Pagination works for large lists

### 20.4 Special Characters
- [ ] Unicode characters in names
- [ ] Emoji in descriptions
- [ ] HTML/script injection prevented
- [ ] URLs in text links properly

---

## Final Checklist Summary

### Must Pass (Critical):
- [ ] Authentication flow works (login/register/verify)
- [ ] Dashboard displays after login
- [ ] Profile creation and editing works
- [ ] Resume creation and viewing works
- [ ] Template switching works
- [ ] PDF export works
- [ ] Search functionality works
- [ ] Public profile sharing works
- [ ] No TypeScript errors in console
- [ ] No 404s for broken links
- [ ] Responsive on mobile, tablet, desktop

### Should Pass (Important):
- [ ] CV upload and parsing works
- [ ] Email preferences work
- [ ] Notifications display
- [ ] Activity feed shows data
- [ ] ATS score calculates
- [ ] Video upload works
- [ ] Admin dashboard functional
- [ ] All forms validate properly
- [ ] Error messages user-friendly
- [ ] Loading states display

### Nice to Have:
- [ ] Smooth animations
- [ ] Optimized images
- [ ] Real-time collaboration features
- [ ] Advanced analytics
- [ ] Export to additional formats

---

## Testing Sign-Off

**Test Date**: ________________
**Tester Name**: ________________
**Browser/Device**: ________________
**OS/Version**: ________________
**Issues Found**: [ ] None [ ] Minor [ ] Major

**Notes**:
___________________________________________
___________________________________________

**Overall Status**: [ ] PASS [ ] FAIL

---

## Defect Log Template

| ID | Page | Feature | Issue | Severity | Status | Notes |
|----|------|---------|-------|----------|--------|-------|
| 1 | Dashboard | Header | Logo not clickable | Medium | Open | Need CSS fix |
| 2 | Resume Editor | Preview | Large text overflow | High | Fixed | Applied overflow:hidden |

---

**Testing Complete!** ✅
Use this checklist for comprehensive QA validation before production deployment.
