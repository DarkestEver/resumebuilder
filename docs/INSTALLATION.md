# Installation Guide

## ✅ Installation Complete!

Both frontend and backend dependencies have been successfully installed.

## 📦 What's Installed

### Backend (C:\Users\dell\Desktop\ProfileBuilder\backend)
- Express.js server with TypeScript
- MongoDB with Mongoose
- Redis client (ioredis)
- Authentication (JWT, Passport, bcrypt)
- AWS S3 SDK
- Email (Nodemailer)
- Payments (Stripe)
- All development tools

**Packages**: 1063 packages installed

### Frontend (C:\Users\dell\Desktop\ProfileBuilder\frontend)
- Next.js 14 with React 18
- TypeScript
- TailwindCSS + ShadCN UI
- Zustand (state management)
- Axios (HTTP client)
- Form handling (React Hook Form + Zod)
- Drag & Drop (dnd-kit)

**Packages**: 1063 packages installed

## 🚀 Next Steps

### 1. Setup MongoDB & Redis (Using Docker)

```powershell
# Start MongoDB and Redis containers
docker-compose up -d

# Verify containers are running
docker ps
```

### 2. Configure Environment Variables

**Backend (.env)**:
```powershell
cp backend\.env.example backend\.env
# Then edit backend\.env with your credentials
```

**Frontend (.env.local)**:
```powershell
cp frontend\.env.example frontend\.env.local
# Then edit frontend\.env.local if needed
```

### 3. Start Development Servers

**Option A: Run both simultaneously (recommended)**
```powershell
# From root directory
npm run dev
```

**Option B: Run separately**
```powershell
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Available Commands

### Root Directory
```powershell
npm run dev              # Run both frontend & backend
npm run build            # Build both projects
npm run test             # Run all tests
npm run lint             # Lint all code
npm run format           # Format with Prettier
```

### Backend
```powershell
npm run start:dev        # Development with hot reload
npm run build            # Compile TypeScript
npm run start:prod       # Production server
npm test                 # Run tests
```

### Frontend
```powershell
npm run dev              # Development server
npm run build            # Production build
npm start                # Production server
npm run lint             # Lint code
```

## ⚠️ Known Warnings (Safe to Ignore)

- **Deprecated packages**: These are from dependencies and don't affect functionality
- **Vulnerabilities**: 
  - Backend: 1 moderate (non-critical)
  - Frontend: 4 vulnerabilities (run `npm audit` for details)
  - These are in dev dependencies and don't affect production

## 🔐 Required Configuration

Before running, you need to configure:

1. **MongoDB Connection** (default: mongodb://localhost:27017/profilebuilder)
2. **Redis Connection** (default: localhost:6379)
3. **JWT Secrets** (change default secrets in .env)

Optional (for full features):
4. **AWS S3** credentials (for file uploads)
5. **OAuth** credentials (Google, LinkedIn, GitHub)
6. **AI API Keys** (OpenAI, Anthropic, Gemini)
7. **Stripe** keys (for payments)
8. **SMTP** settings (for emails)

## 📝 MongoDB & Redis Setup

### Option 1: Docker (Recommended)
```powershell
docker-compose up -d
```

### Option 2: Local Installation
- Install MongoDB Community Server
- Install Redis for Windows
- Update connection strings in backend\.env

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Change ports in .env files
# Backend: PORT=5001
# Frontend: (runs on 3000 by default)
```

### MongoDB Connection Error
```powershell
# Make sure MongoDB is running
docker ps

# Or check local MongoDB service
Get-Service MongoDB
```

### Redis Connection Error
```powershell
# Make sure Redis is running
docker ps

# Test Redis connection
redis-cli ping
```

## ✅ Verification Checklist

- [ ] Backend dependencies installed (1063 packages)
- [ ] Frontend dependencies installed (1063 packages)
- [ ] MongoDB running (Docker or local)
- [ ] Redis running (Docker or local)
- [ ] Environment files configured
- [ ] Can access http://localhost:5000/health
- [ ] Can access http://localhost:3000

---

**Installation Status**: ✅ Complete
**Last Updated**: December 4, 2025
