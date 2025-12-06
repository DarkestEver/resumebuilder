# LinkedIn OAuth Setup Guide

## Complete Step-by-Step Instructions for Enabling LinkedIn Login

This guide will walk you through setting up LinkedIn OAuth authentication for your Resume Builder application.

---

## Prerequisites

- Resume Builder application installed and running
- LinkedIn account (create one at https://www.linkedin.com if needed)
- Access to backend `.env` configuration file
- Admin/developer access to modify environment variables

---

## Step 1: Create LinkedIn Developer App

### 1.1 Access LinkedIn Developers Portal

1. Go to https://www.linkedin.com/developers/
2. Click **"Create app"** button in the top right
3. If prompted, sign in to your LinkedIn account

### 1.2 Fill Out App Information

**Required Fields:**
- **App name**: `Resume Builder` (or your custom name)
- **LinkedIn Page**: Select your company/personal page
  - *Don't have a page?* Create a new LinkedIn Company Page first
- **Privacy policy URL**: `https://yourdomain.com/privacy` 
  - Use your actual domain or `http://localhost:3000/privacy` for development
- **App logo**: Upload a 300x300px logo (PNG or JPG)
- **Legal agreement**: Check the box to agree to LinkedIn API Terms

### 1.3 Submit and Verify

1. Click **"Create app"**
2. LinkedIn will review your app (usually instant for OAuth)
3. You'll be redirected to your app dashboard

---

## Step 2: Configure OAuth 2.0 Settings

### 2.1 Navigate to Auth Tab

1. In your app dashboard, click **"Auth"** tab in the left sidebar
2. Scroll down to **"OAuth 2.0 settings"** section

### 2.2 Add Redirect URLs

**Development Environment:**
```
http://localhost:5000/api/auth/linkedin/callback
```

**Production Environment:**
```
https://api.yourdomain.com/api/auth/linkedin/callback
```

**How to add:**
1. Click **"Add redirect URL"** button
2. Paste the URL
3. Click **"Add"**
4. Repeat for each environment

⚠️ **Important**: The redirect URL must match EXACTLY what's in your backend code (including `/api/auth/linkedin/callback`)

### 2.3 Copy Credentials

You'll see two important values on this page:

```
Client ID: xxxxxxxxxxxxxxxx
Client Secret: yyyyyyyyyyyyyyyy
```

**Save these securely** - you'll need them in the next step.

---

## Step 3: Request API Products

### 3.1 Enable Sign In with LinkedIn

1. Go to **"Products"** tab in your app dashboard
2. Find **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request access"** button
4. Fill out the required information
5. Submit request

**Approval time**: Usually instant for basic profile access

### 3.2 Verify Enabled Products

Once approved, you should see:
- ✅ Sign In with LinkedIn using OpenID Connect
- ✅ Share on LinkedIn (optional, for future features)

---

## Step 4: Configure Backend Environment Variables

### 4.1 Locate Backend .env File

Navigate to your backend directory:
```bash
cd backend/
```

### 4.2 Add LinkedIn Credentials

Open the `.env` file and add the following:

```env
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_client_id_from_step_2.3
LINKEDIN_CLIENT_SECRET=your_client_secret_from_step_2.3
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
FRONTEND_URL=http://localhost:3000
```

**For Production:**
```env
LINKEDIN_CLIENT_ID=your_production_client_id
LINKEDIN_CLIENT_SECRET=your_production_client_secret
LINKEDIN_REDIRECT_URI=https://api.yourdomain.com/api/auth/linkedin/callback
FRONTEND_URL=https://yourdomain.com
```

### 4.3 Example Complete .env File

```env
# Database
DATABASE_URL=mongodb://localhost:27017/resumebuilder
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=86xxxxxxxxx
LINKEDIN_CLIENT_SECRET=yyyyyyyyyyyyyyyy
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
FRONTEND_URL=http://localhost:3000

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

---

## Step 5: Restart Backend Server

### 5.1 Stop Running Server

If your backend is running, stop it:
- Press `Ctrl + C` in the terminal
- Or kill the process

### 5.2 Start Backend Server

```bash
# Development
npm run dev

# Production
npm start
```

### 5.3 Verify Server Started

You should see:
```
✓ Server running on port 5000
✓ MongoDB connected
✓ LinkedIn OAuth configured
```

---

## Step 6: Test LinkedIn Login

### 6.1 Start Frontend

In a separate terminal:
```bash
cd frontend/
npm run dev
```

### 6.2 Access Login Page

1. Open browser: `http://localhost:3000/login`
2. You should see **"Sign in with LinkedIn"** button
3. It should have a blue LinkedIn icon

### 6.3 Test OAuth Flow

1. Click **"Sign in with LinkedIn"** button
2. You'll be redirected to LinkedIn authorization page
3. LinkedIn will show:
   - App name
   - Permissions requested (Profile, Email)
   - "Allow" and "Cancel" buttons
4. Click **"Allow"**
5. You'll be redirected back to your app
6. Should see "Logged in successfully!" toast
7. Should be on Dashboard page

### 6.4 Verify Profile Import

After logging in:
1. Go to **Profile** page
2. Check if your LinkedIn data was imported:
   - First Name
   - Last Name
   - Email Address
   - LinkedIn Profile URL (in contact section)

---

## Troubleshooting

### Issue: "Invalid Redirect URI" Error

**Cause**: Redirect URI in LinkedIn app doesn't match backend URL

**Solution**:
1. Check `.env` file: `LINKEDIN_REDIRECT_URI`
2. Check LinkedIn app settings: Auth tab → Redirect URLs
3. They must match EXACTLY (including http/https, port, path)
4. Restart backend after changing `.env`

---

### Issue: "Client ID not configured" Error

**Cause**: Environment variables not loaded

**Solution**:
1. Verify `.env` file exists in `backend/` directory
2. Check file has correct syntax (no quotes around values)
3. Restart backend server
4. Check server logs for "LinkedIn OAuth configured"

---

### Issue: LinkedIn Button Doesn't Appear

**Cause**: Frontend not connecting to backend

**Solution**:
1. Check backend is running: `http://localhost:5000`
2. Check CORS settings allow `http://localhost:3000`
3. Open browser console (F12) → Check for errors
4. Verify API URL in frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

---

### Issue: "Failed to fetch profile" Error

**Cause**: LinkedIn API permissions not granted

**Solution**:
1. Go to LinkedIn app dashboard
2. Check **Products** tab
3. Ensure "Sign In with LinkedIn" is enabled and approved
4. Wait a few minutes after approval
5. Try logging in again

---

### Issue: Profile Data Not Imported

**Cause**: LinkedIn API limitations

**Note**: Basic LinkedIn API only provides:
- ✅ First Name, Last Name
- ✅ Email Address
- ✅ Profile Photo URL
- ❌ Work Experience (requires Partner Program)
- ❌ Education (requires Partner Program)
- ❌ Skills (requires Partner Program)

**Solution**: Users must add work history manually after login

---

### Issue: "OAuth failed" Error in Production

**Cause**: Incorrect production URLs

**Solution**:
1. Update LinkedIn app redirect URL to production domain
2. Update backend `.env`:
   ```env
   LINKEDIN_REDIRECT_URI=https://api.yourdomain.com/api/auth/linkedin/callback
   FRONTEND_URL=https://yourdomain.com
   ```
3. Ensure SSL certificate is valid (https)
4. Redeploy backend
5. Clear browser cache
6. Test again

---

## Security Best Practices

### 1. Protect Client Secret

❌ **Never commit `.env` file to git**

```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

### 2. Use Environment-Specific Secrets

- Development: Use test credentials
- Production: Use separate credentials
- Never reuse secrets across environments

### 3. Rotate Secrets Regularly

- Generate new client secret every 3-6 months
- Update in LinkedIn app dashboard
- Update in backend `.env`
- Redeploy application

### 4. Implement Rate Limiting

Already implemented in `linkedinOAuthService.ts`:
- 100 requests per user per day (LinkedIn default)
- Additional rate limiting on backend endpoints

---

## Advanced Configuration

### Custom Permissions

To request additional data (requires LinkedIn approval):

1. Go to app dashboard → **Products** tab
2. Request **Marketing Developer Platform** (paid)
3. Add scopes in OAuth URL:
   ```typescript
   const scope = 'r_liteprofile r_emailaddress w_member_social r_fullprofile';
   ```
4. Update `linkedinOAuthService.ts` to handle new data

### Profile Import Enhancement

To import work history (requires Partner access):

```typescript
// In linkedinOAuthService.ts
static async importWorkHistory(accessToken: string) {
  const response = await axios.get(
    'https://api.linkedin.com/v2/positions',
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  // Process and save work history
}
```

---

## Production Deployment Checklist

- [ ] LinkedIn app created and approved
- [ ] Production redirect URLs added to LinkedIn app
- [ ] Environment variables configured in production
- [ ] SSL certificate installed (HTTPS required)
- [ ] Backend restarted with new environment variables
- [ ] Frontend rebuilt with production API URL
- [ ] Login flow tested end-to-end
- [ ] Profile import verified
- [ ] Error handling tested
- [ ] Rate limiting configured
- [ ] Logging and monitoring enabled

---

## Support

### LinkedIn Documentation
- Developer Portal: https://www.linkedin.com/developers/
- OAuth 2.0 Guide: https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
- API Reference: https://docs.microsoft.com/en-us/linkedin/shared/api-guide/concepts

### Resume Builder Support
- GitHub Issues: Create an issue in your repository
- Check backend logs: `backend/logs/error.log`
- Check frontend console: Press F12 in browser

---

## What's Imported vs Manual Entry

### ✅ Automatically Imported from LinkedIn
| Data | Imported | Notes |
|------|----------|-------|
| First Name | ✅ | From basic profile |
| Last Name | ✅ | From basic profile |
| Email | ✅ | Verified email |
| Profile Photo | ✅ | Display image URL |
| LinkedIn URL | ✅ | Public profile link |
| Headline | ❌ | Basic API doesn't provide |
| Summary | ❌ | Basic API doesn't provide |
| Work Experience | ❌ | Requires Partner Program |
| Education | ❌ | Requires Partner Program |
| Skills | ❌ | Requires Partner Program |
| Certifications | ❌ | Requires Partner Program |

### 📝 User Must Add Manually
After LinkedIn login, users need to complete their profile by adding:
- Professional summary
- Work experience
- Education history
- Skills
- Projects
- Certifications
- Languages

This is by design - LinkedIn's basic API is intentionally limited to prevent profile scraping.

---

## Cost & Limitations

### Free Tier (Current Implementation)
- ✅ Basic authentication
- ✅ Name and email import
- ✅ 100 requests per user per day
- ✅ Unlimited users
- ❌ No work history/education import

### LinkedIn Partner Program (Optional)
- 💰 Cost: ~$10,000+/year
- ✅ Full profile data access
- ✅ Work history, education, skills
- ✅ 1,000+ requests per day
- ✅ Priority support

**Recommendation**: Start with free tier. Upgrade only if profile import is critical to your business model.

---

## Next Steps

Once LinkedIn OAuth is working:

1. ✅ Test with multiple users
2. ✅ Monitor LinkedIn API usage
3. ⏭️ Add Google OAuth (similar setup)
4. ⏭️ Add GitHub OAuth (for developers)
5. ⏭️ Implement social profile enrichment
6. ⏭️ Add "Continue with" buttons to register page

---

**Setup Complete!** 🎉

Users can now log in with LinkedIn and have their basic profile data automatically imported.
