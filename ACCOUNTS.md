# Test Accounts Documentation

**Last Updated**: December 5, 2025

## Overview

This document provides all test account credentials for the Profile Builder platform. Created for development, testing, and demonstration purposes.

---

## Admin Accounts (3 total)

Master admin accounts with full platform access and administrative privileges.

| Email | Password | Role | Tier | Purpose |
|-------|----------|------|------|---------|
| `admin@profilebuilder.com` | `AdminPass123!` | Admin | Enterprise | Full platform control |
| `support@profilebuilder.com` | `SupportPass123!` | Admin | Enterprise | Support & troubleshooting |
| `moderator@profilebuilder.com` | `ModeratorPass123!` | Admin | Enterprise | Content moderation |

**Admin Panel Access**: http://localhost:3000/admin

---

## Test User Accounts (41 total)

Dummy accounts organized by professional role and industry sector.

### Tech Track (8 accounts)

Software engineering, data science, DevOps, and architecture roles.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `john.dev@test.com` | `TechPass123!` | Software Engineer | Random |
| `sarah.frontend@test.com` | `TechPass123!` | Frontend Engineer | Random |
| `mike.backend@test.com` | `TechPass123!` | Backend Engineer | Random |
| `alex.devops@test.com` | `TechPass123!` | DevOps Engineer | Random |
| `lisa.datascience@test.com` | `TechPass123!` | Data Scientist | Random |
| `david.qa@test.com` | `TechPass123!` | QA Engineer | Random |
| `emma.architect@test.com` | `TechPass123!` | Solutions Architect | Random |
| `jason.data@test.com` | `TechPass123!` | Data Analyst | Random |

### Finance Track (7 accounts)

Financial analysis, accounting, investment banking, and consulting roles.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `michael.banker@test.com` | `FinPass123!` | Financial Analyst | Random |
| `jennifer.cpa@test.com` | `FinPass123!` | Accountant | Random |
| `kevin.banker@test.com` | `FinPass123!` | Investment Banker | Random |
| `rachel.auditor@test.com` | `FinPass123!` | Accountant | Random |
| `chris.analyst@test.com` | `FinPass123!` | Financial Analyst | Random |
| `laura.trader@test.com` | `FinPass123!` | Financial Analyst | Random |
| `mark.consultant@test.com` | `FinPass123!` | Consultant | Random |

### Healthcare Track (5 accounts)

Medical professionals, nursing, and pharmacy roles.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `dr.smith@test.com` | `HealthPass123!` | Physician | Random |
| `nurse.johnson@test.com` | `HealthPass123!` | Healthcare Professional | Random |
| `pharmacist.lee@test.com` | `HealthPass123!` | Pharmacist | Random |
| `dr.patel@test.com` | `HealthPass123!` | Physician | Random |
| `nurse.williams@test.com` | `HealthPass123!` | Healthcare Professional | Random |

### Marketing Track (5 accounts)

Digital marketing, content creation, SEO, and brand management.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `mark.digital@test.com` | `MarketPass123!` | Marketing Manager | Random |
| `sarah.content@test.com` | `MarketPass123!` | Content Writer | Random |
| `brian.seo@test.com` | `MarketPass123!` | Marketing Manager | Random |
| `victoria.brand@test.com` | `MarketPass123!` | Brand Manager | Random |
| `daniel.social@test.com` | `MarketPass123!` | Social Media Manager | Random |

### Design Track (5 accounts)

UX/UI design, graphic design, and product management.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `designer.alex@test.com` | `DesignPass123!` | Designer | Random |
| `ux.sophia@test.com` | `DesignPass123!` | Designer | Random |
| `graphic.ryan@test.com` | `DesignPass123!` | Graphic Designer | Random |
| `product.emily@test.com` | `DesignPass123!` | Product Manager | Random |
| `ui.james@test.com` | `DesignPass123!` | Designer | Random |

### Sales Track (4 accounts)

Sales representatives and business development roles.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `sales.robert@test.com` | `SalesPass123!` | Sales Manager | Random |
| `executive.patricia@test.com` | `SalesPass123!` | Sales Executive | Random |
| `account.george@test.com` | `SalesPass123!` | Account Manager | Random |
| `business.catherine@test.com` | `SalesPass123!` | Business Development | Random |

### HR Track (4 accounts)

Human resources and recruitment roles.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `hr.manager@test.com` | `HRPass123!` | HR Manager | Random |
| `recruiter.amy@test.com` | `HRPass123!` | Recruiter | Random |
| `hr.andrew@test.com` | `HRPass123!` | HR Manager | Random |
| `talent.melissa@test.com` | `HRPass123!` | Recruiter | Random |

### Other Roles (3 accounts)

Project management, consulting, and operations.

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `pm.nancy@test.com` | `OtherPass123!` | Project Manager | Random |
| `consultant.steven@test.com` | `OtherPass123!` | Consultant | Random |
| `ops.karen@test.com` | `OtherPass123!` | Operations Manager | Random |

---

## Quick Access Links

| Resource | URL |
|----------|-----|
| **Frontend** | http://localhost:3000 |
| **Login Page** | http://localhost:3000/login |
| **Admin Panel** | http://localhost:3000/admin |
| **Backend API** | http://localhost:5000 |
| **Database** | mongodb://localhost:27017/profilebuilder |

---

## Testing Guidelines

### For Regular Users
1. Go to http://localhost:3000/login
2. Select any test account email and password from the tables above
3. Build profiles, create resumes, test templates
4. Use the same credentials for all non-admin features

### For Admin Testing
1. Go to http://localhost:3000/login
2. Use admin credentials (see Admin Accounts section)
3. Access admin panel at http://localhost:3000/admin
4. View analytics, manage users, moderate content

### Account Features
- ✅ All accounts are email-verified
- ✅ Subscription tiers randomly assigned (free/pro/enterprise)
- ✅ All accounts ready for immediate use
- ✅ No additional email verification required
- ✅ Can create multiple resumes per account
- ✅ Can access all template types

---

## Subscription Tiers

Each test user account has a randomly assigned subscription tier:

| Tier | Resume Limit | AI Credits | Templates | Public Profiles |
|------|--------------|-----------|-----------|-----------------|
| **Free** | 3 | 10/month | Basic templates only | Limited |
| **Pro** | Unlimited | Unlimited | All templates | Unlimited |
| **Enterprise** | Unlimited | Unlimited | All templates | Unlimited + Customization |

---

## Scripts Reference

### Create Regular Test Accounts
```bash
cd c:\Users\dell\Desktop\ProfileBuilder
node scripts/seed.js
```

### Create Admin Accounts
```bash
cd c:\Users\dell\Desktop\ProfileBuilder
node scripts/seed-admin.js
```

---

## Database Information

- **Type**: MongoDB
- **Host**: localhost
- **Port**: 5000
- **Database**: profilebuilder
- **Connection String**: mongodb://localhost:27017/profilebuilder

---

## Troubleshooting

### Account Login Issues
- Verify account exists: Check if email appears in the tables above
- Check password: Ensure exact spelling (case-sensitive)
- Clear browser cache: Sometimes cached sessions interfere
- Try incognito/private mode: Rules out browser extension issues

### Admin Panel Access
- Must use admin credentials (see Admin Accounts section)
- Non-admin accounts will be denied access
- Check browser console for authentication errors

### Password Reset
- Use `/forgot-password` endpoint if needed
- Or re-run seed scripts to recreate accounts

---

## Notes for Testers

1. **Account Duplication**: Running seed scripts multiple times will skip existing accounts
2. **Data Isolation**: Each account has its own profiles and resumes
3. **Public Profiles**: Test users can create public resumes visible to others
4. **Resume Templates**: All 32+ templates available for testing
5. **AI Features**: Depending on tier, AI enhancements available
6. **Search**: All accounts searchable (admins can view all)

---

## Test Data Summary

- **Total Test Accounts**: 41
- **Total Admin Accounts**: 3
- **Total Available Accounts**: 44
- **Professional Roles**: 20+
- **Industry Sectors**: 8
- **Subscription Tiers**: 3 (Free, Pro, Enterprise)

---

## Support

For issues with test accounts, check:
1. Backend logs: `terminal:920f080e-670c-48ea-8c73-43e54c671599`
2. Frontend logs: `terminal:5b750cbe-b1a9-49af-b5ff-ac4bf03634f9`
3. Browser console (F12)
4. MongoDB connection status

---

**Happy Testing! 🚀**
