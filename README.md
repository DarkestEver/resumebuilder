# ProfileBuilder - AI-Powered Resume Builder

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-green)

AI-powered resume builder with CV extraction, 20+ professional templates, video profiles, public sharing, and subscription tiers.

## ✨ Features

- 🤖 **AI-Powered** - CV extraction, content enhancement, ATS optimization
- 📄 **20+ Templates** - Professional, creative, industry-specific designs
- 🎥 **Video Profiles** - Add video introductions to your resume
- 🔗 **Public Sharing** - Custom URLs and QR codes for easy sharing
- 📊 **ATS Scoring** - Optimize your resume for applicant tracking systems
- 🔄 **LinkedIn Sync** - Import profile data from LinkedIn
- 💳 **Subscription Tiers** - Free, Pro, and Enterprise plans

---

## 🚀 Quick Deploy (VPS + Docker)

### 1. Clone & Configure
```bash
git clone https://github.com/DarkestEver/resumebuilder.git
cd resumebuilder

# Add your Gemini API key
nano .env.production
```

### 2. Deploy
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 3. Access
- **App**: http://your-server:3000
- **API**: http://your-server:5000

### Default Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@profilebuilder.com | Admin@123456 |
| Demo | demo@profilebuilder.com | Demo@123456 |

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm 9+

### Setup
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# Start development (2 terminals)
npm run dev:backend   # Terminal 1 - API on port 5000
npm run dev:frontend  # Terminal 2 - UI on port 3000
```

### Environment Variables
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/profilebuilder
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
```

---

## 📁 Project Structure

```
profilebuilder/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   │   └── templates/ # 20+ resume templates
│   │   ├── pages/        # Next.js pages
│   │   └── lib/          # Utilities
│   └── package.json
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   └── package.json
│
├── scripts/           # Deployment scripts
│   ├── deploy.sh         # One-click deploy
│   └── seed-database.js  # Create test users
│
├── docs/              # Documentation
├── tests/             # E2E tests
└── docker-compose.prod.yml
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev:backend     # Start backend (port 5000)
npm run dev:frontend    # Start frontend (port 3000)

# Production
npm run build           # Build both
npm run start:backend   # Start backend
npm run start:frontend  # Start frontend

# Docker
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/profiles` | Get user profile |
| PUT | `/api/profiles` | Update profile |
| GET | `/api/resumes` | List resumes |
| POST | `/api/resumes` | Create resume |
| POST | `/api/cv/upload` | Upload CV for extraction |
| POST | `/api/ai/enhance` | AI content enhancement |
| GET | `/api/public/:username` | Public profile |

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TailwindCSS
- ShadCN UI

**Backend:**
- Node.js / Express
- MongoDB / Mongoose
- JWT Authentication
- Socket.IO (real-time)

**AI Integration:**
- Google Gemini
- OpenAI (optional)
- Anthropic Claude (optional)

**Infrastructure:**
- Docker
- Redis (caching)
- Nginx (reverse proxy)

---

## 📖 Documentation

See the `/docs` folder for detailed documentation:
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Project Roadmap](docs/PROJECT_ROADMAP.md)
- [ATS Optimization](docs/ATS_SCORING_GUIDE.md)
- [LinkedIn Integration](docs/LINKEDIN_OAUTH_SETUP_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - Beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Google Gemini](https://ai.google.dev/) - AI capabilities
