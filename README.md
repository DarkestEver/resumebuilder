# ProfileBuilder - AI-Powered Resume Builder Portal

AI-powered resume builder with CV extraction, 20+ templates, video profiles, public sharing, and subscription tiers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 5.0+
- Redis 7+
- AWS S3 account (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ProfileBuilder
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

3. **Setup environment variables**

Frontend:
```bash
cp frontend/.env.example frontend/.env.local
```

Backend:
```bash
cp backend/.env.example backend/.env
```

Edit the `.env` files with your credentials.

4. **Start MongoDB and Redis**
```bash
# MongoDB (if using local)
mongod

# Redis (if using local)
redis-server
```

5. **Run development servers**
```bash
# From root directory (runs both frontend and backend)
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## 📁 Project Structure

```
ProfileBuilder/
├── frontend/               # Next.js 14 frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and helpers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # Global styles
│   ├── public/           # Static files
│   └── package.json
│
├── backend/              # Express/Node.js backend
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── .github/              # GitHub specific files
│   └── copilot-instructions.md
├── PROJECT_ROADMAP.md    # Complete development plan
├── IMPLEMENTATION_STATUS.md  # Progress tracking
└── package.json          # Root package.json (workspace)
```

## 🏗️ Architecture

### Frontend (Next.js + React)
- **Framework**: Next.js 14 with App Router
- **UI**: TailwindCSS + ShadCN components
- **State**: Zustand for global state
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios for API calls

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for sessions and AI responses
- **Auth**: JWT + Refresh tokens, OAuth (Google, LinkedIn, GitHub)
- **Storage**: AWS S3 for file uploads
- **Payments**: Stripe for subscriptions

### Key Features
- ✅ Authentication (Email/Password, OAuth, OTP)
- ✅ Profile Builder with AI enhancement
- ✅ CV Upload & Extraction (AI-powered)
- ✅ 20+ Resume Templates
- ✅ ATS Optimization & Scoring
- ✅ Tailored Resume Generation
- ✅ Video Profile Support
- ✅ Public Profile Sharing
- ✅ Analytics Dashboard
- ✅ Subscription Management

## 🛠️ Development

### Available Scripts

**Root:**
- `npm run dev` - Run both frontend and backend
- `npm run build` - Build both projects
- `npm test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format code with Prettier

**Frontend:**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

**Backend:**
- `npm run start:dev` - Start with hot reload
- `npm run build` - Compile TypeScript
- `npm run start:prod` - Start production server
- `npm test` - Run tests

## 📚 Documentation

- [Complete Roadmap](./PROJECT_ROADMAP.md) - 22 phases, 52-week plan
- [Implementation Status](./IMPLEMENTATION_STATUS.md) - Track progress
- [AI Agent Guidelines](./.github/copilot-instructions.md) - For AI development

## 🔐 Security

- JWT tokens with refresh token rotation
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- File upload virus scanning
- Input validation and sanitization
- CORS and Helmet security headers

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Test coverage
npm run test:coverage
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel or your hosting platform
```

### Backend (AWS/GCP/Railway)
```bash
cd backend
npm run build
npm run start:prod
```

## 📊 Tech Stack

**Frontend:**
- Next.js 14, React 18, TypeScript
- TailwindCSS, ShadCN UI, Lucide Icons
- Zustand, Axios, React Hook Form, Zod
- React Beautiful DnD / dnd-kit

**Backend:**
- Node.js, Express, TypeScript
- MongoDB, Mongoose, Redis
- JWT, Passport.js, Bcrypt
- AWS S3, Stripe, Nodemailer

**AI:**
- OpenAI GPT-4
- Anthropic Claude 3.5
- Google Gemini 1.5

## 🤝 Contributing

This is an AI-assisted development project. See [AI Agent Guidelines](./.github/copilot-instructions.md) for development patterns.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions, please check:
1. [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) for planned features
2. [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for current status
3. Create an issue in the repository

---

**Version**: 1.0.0-beta  
**Last Updated**: January 15, 2025  
**Status**: 65% Complete - Frontend 90%, Backend 85%, AI Features Pending

## 📊 Development Progress

### Completed (65%)
- ✅ Backend Authentication: 35+ endpoints
- ✅ Backend Profile & Resume: 18 endpoints  
- ✅ Frontend Auth Pages: 5 pages
- ✅ Frontend Dashboard: Stats, resume management
- ✅ Profile Builder: All 13 sections with auto-save
- ✅ Resume Editor: Template selection, customization, preview
- ✅ Navigation: Header, landing page, public routes
- 🔄 CV Upload: UI done, backend parsing 50% complete

### In Progress
- Phase 4: CV Parsing (50%) - OCR and AI extraction
- Phase 5: Template Engine - 20+ professional templates
- Phase 6: AI Enhancement - Content improvement suggestions
- Phase 7: PDF Generation - Resume PDF export
- Phases 8-16: Advanced features (analytics, subscriptions, payments)

### See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for detailed phase breakdown
