# ProfileBuilder - Production Deployment Guide (aaPanel + Docker)

## Prerequisites
- VPS with aaPanel installed
- Docker installed via aaPanel (Docker menu → Install)
- Domain pointed to your VPS IP (optional)

---

## Step 1: Build Production Files (Local)

On your local machine, run:
```powershell
# Build both backend and frontend
npm run build

# Create production folder with all required files
.\scripts\create-production.ps1
```

This creates a `production/` folder (~1GB) with:
```
production/
├── .env.production         # Configuration (edit this!)
├── docker-compose.prebuilt.yml
├── scripts/
│   ├── deploy-prebuilt.sh
│   └── seed-database.js
├── backend/
│   ├── dist/              # Compiled backend
│   ├── node_modules/
│   └── package.json
└── frontend/
    ├── .next/             # Compiled frontend
    ├── node_modules/
    ├── package.json
    └── next.config.js
```

---

## Step 2: Configure Environment

Edit `production/.env.production` before uploading:

```env
# REQUIRED - Add your AI API key
GEMINI_API_KEY=your-actual-gemini-api-key-here

# OPTIONAL - Change if using custom domain
NEXT_PUBLIC_API_URL=http://your-domain.com:5000
NEXT_PUBLIC_APP_URL=http://your-domain.com:3000
CORS_ORIGIN=http://your-domain.com:3000
```

---

## Step 3: Upload to VPS

Using aaPanel **File Manager**:
1. Navigate to `/www/wwwroot/`
2. Create folder `profilebuilder`
3. Upload contents of `production/` folder
4. Or ZIP and upload, then extract

Final structure on VPS:
```
/www/wwwroot/profilebuilder/
├── .env.production
├── docker-compose.prebuilt.yml
├── scripts/
├── backend/
└── frontend/
```

---

## Step 4: Create Docker Compose Project (aaPanel)

1. Open aaPanel → **Docker** → **Compose**
2. Click **Add** (or Create)
3. Fill in:
   - **Name**: `profilebuilder`
   - **Path**: `/www/wwwroot/profilebuilder`
   - **Compose File**: Select `docker-compose.prebuilt.yml`
4. Click **Create** or **Save**

---

## Step 5: Start Containers

1. In Docker Compose list, find `profilebuilder`
2. Click **Start**
3. Wait for all 4 containers to start:
   - `profilebuilder-mongo` (MongoDB)
   - `profilebuilder-redis` (Redis)
   - `profilebuilder-backend` (API)
   - `profilebuilder-frontend` (UI)

---

## Step 6: Seed Database (One-time)

Create admin and demo users. In aaPanel **Terminal** or via SSH:

```bash
docker exec profilebuilder-backend node scripts/seed-database.js
```

This creates:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@profilebuilder.com | Admin@123456 |
| Demo | demo@profilebuilder.com | Demo@123456 |
| Test | john@example.com | Test@123456 |
| Test | jane@example.com | Test@123456 |

---

## Step 7: Setup Reverse Proxy (Optional - for Domain)

To access via domain instead of IP:port

### Frontend (Main Site)
1. aaPanel → **Website** → **Add Site**
2. Domain: `yourdomain.com`
3. After creating → **Settings** → **Reverse Proxy**
4. **Target URL**: `http://127.0.0.1:3000`
5. Enable WebSocket support

### Backend API (if separate subdomain)
1. Add site for `api.yourdomain.com`
2. Reverse Proxy → `http://127.0.0.1:5000`

### Enable SSL
1. Site **Settings** → **SSL**
2. Select **Let's Encrypt**
3. Click **Apply**

---

## Ports Reference

| Service | Container Name | Port |
|---------|---------------|------|
| Frontend | profilebuilder-frontend | 3000 |
| Backend API | profilebuilder-backend | 5000 |
| MongoDB | profilebuilder-mongo | 27017 |
| Redis | profilebuilder-redis | 6379 |

---

## Access URLs

**Without domain:**
- Frontend: `http://YOUR-VPS-IP:3000`
- API: `http://YOUR-VPS-IP:5000/api`
- Health Check: `http://YOUR-VPS-IP:5000/health`

**With domain + reverse proxy:**
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com:5000/api` or `https://api.yourdomain.com`

---

## Useful Commands

```bash
# View all containers
docker ps

# View logs
docker logs profilebuilder-backend
docker logs profilebuilder-frontend

# Restart a container
docker restart profilebuilder-backend

# Stop all
docker-compose -f /www/wwwroot/profilebuilder/docker-compose.prebuilt.yml down

# Start all
docker-compose -f /www/wwwroot/profilebuilder/docker-compose.prebuilt.yml up -d

# Re-seed database
docker exec profilebuilder-backend node scripts/seed-database.js

# Access MongoDB shell
docker exec -it profilebuilder-mongo mongosh -u admin -p ProfileBuilder2025Secure!
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs profilebuilder-backend
docker logs profilebuilder-frontend
```

### MongoDB connection error
- Check if mongo container is running: `docker ps`
- Verify password in `.env.production` matches `docker-compose.prebuilt.yml`

### Frontend can't reach backend
- Ensure `NEXT_PUBLIC_API_URL` in `.env.production` is correct
- Check CORS settings

### Port already in use
- Change ports in `docker-compose.prebuilt.yml`
- Or stop conflicting service

---

## Updating the App

1. Build new production files locally
2. Stop containers in aaPanel
3. Upload new `backend/dist` and `frontend/.next` folders
4. Start containers again

---

## Architecture

```
                 ┌─────────────────────────┐
                 │   aaPanel (Nginx)       │
                 │   Reverse Proxy + SSL   │
                 └───────────┬─────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   │
  ┌─────────────┐     ┌─────────────┐           │
  │  Frontend   │     │  Backend    │           │
  │  (Next.js)  │────▶│  (Express)  │           │
  │   :3000     │     │   :5000     │           │
  └─────────────┘     └──────┬──────┘           │
                             │                   │
                   ┌─────────┴─────────┐        │
                   │                   │        │
                   ▼                   ▼        │
            ┌──────────┐        ┌──────────┐   │
            │ MongoDB  │        │  Redis   │   │
            │  :27017  │        │  :6379   │   │
            └──────────┘        └──────────┘   │
```

---

## Support

If you encounter issues:
1. Check Docker container logs
2. Verify `.env.production` settings
3. Ensure all files were uploaded correctly
4. Check aaPanel firewall allows ports 3000, 5000
