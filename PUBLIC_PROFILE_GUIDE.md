# Public Profile & Resume Sharing Guide

## Overview

The Resume Builder platform supports two types of public sharing:
1. **Public Profile** - Share your complete profile with all public resumes (`/username`)
2. **Individual Resume** - Share specific resumes with custom privacy settings (`/r/shortId`)

---

## 🔗 Public Profile System

### How It Works

Each user can set a unique username and share their public profile at:
```
https://yourdomain.com/[username]
```

### Setting Your Username

1. Go to **Settings** page
2. Find "Public Profile URL" section
3. Enter your desired username (minimum 3 characters)
4. Click "Update"
5. Username must be unique and contain only:
   - Letters (a-z, A-Z)
   - Numbers (0-9)
   - Hyphens (-)
   - Underscores (_)

### Features on Public Profile

- ✅ Profile photo and name
- ✅ Username (@username)
- ✅ Headline and summary
- ✅ Contact information
- ✅ **All public resumes**
- ✅ Skills display
- ✅ Resume view/download stats

### Privacy Controls

- Only resumes marked as "Public" appear on your profile
- Private resumes are NOT shown
- You control which resumes are public

---

## 📄 Individual Resume Sharing

### Resume Privacy Options

Each resume has 4 visibility settings:

#### 1. 🔒 **Private**
- Only you can see it
- Not accessible by anyone else
- Default setting for new resumes

#### 2. 🌐 **Public**
- Anyone with the link can view
- Shows up on your public profile
- Gets a unique short URL: `/r/[shortId]`
- Appears in search (if implemented)

#### 3. 🔑 **Password Protected**
- Anyone with the link AND password can view
- Does NOT appear on public profile
- Useful for sharing with specific people
- Set custom password when selecting this option

#### 4. ⏰ **Expiring Link**
- Public until expiration date
- Automatically becomes private after expiry
- Set expiration date when selecting this option
- Useful for limited-time applications

### How to Share a Resume

#### Method 1: From Dashboard

1. Go to **Dashboard**
2. Find the resume you want to share
3. Click the **⋮** menu button
4. If resume is **public**, you'll see "Copy Share Link"
5. Click to copy the link
6. Share the link anywhere!

#### Method 2: From Resume Editor

1. Open resume in editor
2. Go to "Preview" step
3. Change visibility dropdown to "Public"
4. A shortId will be automatically generated
5. Copy the link: `https://yourdomain.com/r/[shortId]`

### Share Link Format

Public resumes are accessible at:
```
https://yourdomain.com/r/ABC123XYZ
```

Where `ABC123XYZ` is the auto-generated shortId.

---

## 🎯 Use Cases

### Use Case 1: Job Applications
- Set resume visibility to **Password Protected**
- Share link + password with specific recruiters
- Track how many times they viewed it

### Use Case 2: Public Portfolio
- Set your username (e.g., `john-doe`)
- Mark your best resumes as **Public**
- Share your profile: `https://yourdomain.com/john-doe`
- Recruiters see all your work in one place

### Use Case 3: Temporary Sharing
- Set resume to **Expiring Link**
- Set expiry date (e.g., 30 days)
- Share with potential employers
- Link auto-expires after deadline

### Use Case 4: Social Media
- Make resume **Public**
- Add to LinkedIn profile: `/r/ABC123`
- Add to Twitter bio
- Add to email signature

---

## 📊 Analytics Tracking

Every public resume tracks:
- **Total views** - How many times people viewed it
- **Downloads** - How many PDF downloads
- **Devices** - Mobile vs Desktop vs Tablet
- **Referrers** - Where traffic came from
- **Time-based stats** - Today, This Week, This Month

### Viewing Analytics

1. Go to **Dashboard**
2. View stats directly on resume cards
3. Or click resume to see detailed analytics

---

## 🔐 Privacy & Security

### What's Visible on Public Profiles?

**Visible:**
- Name
- Username
- Profile photo
- Headline & Summary
- Public resumes
- Skills
- Contact info (if in profile)

**NOT Visible:**
- Private resumes
- Password-protected resumes (unless password entered)
- Expired resumes
- Account email (unless in profile contact)
- Subscription tier
- Usage stats

### Password Protected Resumes

When someone visits a password-protected resume:
1. They see a password prompt
2. Must enter correct password
3. Password is checked server-side
4. View is still tracked in analytics

### Expiring Links

- Check expiry date on each view
- Return 410 Gone if expired
- User can extend expiry date anytime

---

## 🛠️ Technical Implementation

### Frontend Routes

```
/[username]           → Public profile page
/r/[shortId]          → Public resume page
```

### Backend API Endpoints

```
GET /api/public/profile/:username
- Returns user profile + public resumes

GET /api/public/r/:shortId?password=xxx
- Returns resume if visible
- Checks password if protected
- Checks expiry date
- Tracks analytics
```

### Database Schema

#### User Model
```typescript
{
  username: string (unique, indexed)
  // ...other fields
}
```

#### Resume Model
```typescript
{
  visibility: 'private' | 'public' | 'password' | 'expiring',
  shortId: string (unique, auto-generated),
  password: string (hashed, optional),
  expiryDate: Date (optional),
  viewCount: number,
  downloadCount: number
}
```

---

## 📝 Examples

### Example 1: Setting Username

```
Current: No username set
URL: Not available

Action: Set username to "john-doe"
New URL: https://resume-builder.com/john-doe

Anyone can visit and see your public resumes!
```

### Example 2: Sharing Resume

```
Resume: "Software Engineer Resume"
Visibility: Private
Share Link: Not available

Action: Change to "Public"
New Short ID: ABC123
Share Link: https://resume-builder.com/r/ABC123

Share on LinkedIn, Twitter, email signatures!
```

### Example 3: Password Protection

```
Resume: "Confidential Application"
Visibility: Password Protected
Password: "MySecret123!"

Share Link: https://resume-builder.com/r/XYZ789
Instructions: "Password is: MySecret123!"

Only people with password can view.
```

---

## ✅ Checklist for Users

### Setting Up Public Profile
- [ ] Go to Settings
- [ ] Set your username
- [ ] Complete your profile
- [ ] Add profile photo
- [ ] Mark resumes as public
- [ ] Copy and share your profile link

### Sharing a Resume
- [ ] Open resume
- [ ] Choose visibility (Public/Password/Expiring)
- [ ] Set password/expiry if needed
- [ ] Copy share link from dashboard
- [ ] Share link via email/social/etc
- [ ] Monitor analytics

---

## 🚀 Best Practices

### Username Tips
- Keep it professional (use real name)
- Keep it short and memorable
- Match your LinkedIn username
- Avoid numbers unless necessary

### Resume Sharing Tips
- Use **Public** for general portfolio
- Use **Password** for sensitive applications
- Use **Expiring** for time-limited applications
- Keep **Private** for work-in-progress
- Update regularly
- Track analytics to see what works

### Privacy Tips
- Don't include personal phone/address on public profiles
- Use professional email only
- Review what's public periodically
- Delete old expired resumes
- Set strong passwords for protected resumes

---

## ❓ FAQ

**Q: Can I change my username?**
A: Yes, go to Settings and update it anytime.

**Q: What happens to old links if I change username?**
A: Your `/username` profile URL will change. But `/r/shortId` resume links stay the same!

**Q: How do I make my resume private again?**
A: Edit resume → Change visibility to "Private" → Save

**Q: Can I see who viewed my resume?**
A: You can see total views, devices, and referrers, but not individual viewer names (for privacy).

**Q: What if someone shares my password-protected link?**
A: They still need the password to view it. You can change the password anytime.

**Q: How long are shortIds valid?**
A: Forever (unless you delete the resume or change it to private).

**Q: Can I use a custom shortId?**
A: No, shortIds are auto-generated to ensure uniqueness and security.

**Q: Does it cost credits to share resumes?**
A: No! Sharing is completely free for all users.

---

## 🔧 Troubleshooting

### "Username already taken"
- Try adding numbers or hyphens
- Try a variation of your name
- Contact support to free up inactive usernames

### "Resume not found" error
- Check if resume is still public
- Verify the shortId is correct
- Resume may have been deleted
- Resume may have expired

### Can't copy share link
- Make sure resume visibility is "Public"
- Check if resume has been saved
- Try refreshing the page

---

## 📞 Support

Need help? Contact support or visit our help center!

**Happy Sharing! 🎉**
