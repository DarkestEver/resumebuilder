# ProfileBuilder - VPS Deployment Guide (aaPanel + Docker)

## Quick Deploy (3 Steps)

### Step 1: Upload to VPS
```bash
cd /www/wwwroot
git clone https://github.com/DarkestEver/resumebuilder.git profilebuilder
cd profilebuilder
```

### Step 2: Configure (Only update AI key!)
```bash
nano .env.production
```
**Only change this line:**
```
GEMINI_API_KEY=your-actual-gemini-api-key
```

### Step 3: Deploy
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Done!** 🎉

---

## Default Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@profilebuilder.com | Admin@123456 |
| Demo | demo@profilebuilder.com | Demo@123456 |
| Test | john@example.com | Test@123456 |
| Test | jane@example.com | Test@123456 |

---

## Manual Deployment (Alternative)

### For Frontend (port 3000):

1. Go to **Website** → **Add Site**
2. Domain: `yourdomain.com`
3. After creating, click **Settings** → **Reverse Proxy**
4. Add proxy:
   - **Target URL**: `http://127.0.0.1:3000`
   - Enable **WebSocket Support**

### For Backend API (port 5000):

1. Go to **Website** → **Add Site**
2. Domain: `api.yourdomain.com` (or use path-based)
3. **Settings** → **Reverse Proxy**
4. Add proxy:
   - **Target URL**: `http://127.0.0.1:5000`

### OR use path-based routing (same domain):

In your main site's Nginx config, add:
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cache_bypass $http_upgrade;
}

location /uploads/ {
    proxy_pass http://127.0.0.1:5000/uploads/;
    proxy_set_header Host $host;
}
```

---

## Step 6: Enable SSL (HTTPS)

1. In aaPanel, go to your site **Settings**
2. Click **SSL**
3. Choose **Let's Encrypt**
4. Click **Apply**

---

## Step 7: Update Frontend API URL

If using separate domains, update the frontend environment:

```bash
# Edit docker-compose.prod.yml
nano docker-compose.prod.yml

# Change this line in frontend service:
NEXT_PUBLIC_API_URL: https://api.yourdomain.com
```

Then restart:
```bash
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

---

## Useful Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart a specific service
docker-compose -f docker-compose.prod.yml restart backend

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Rebuild after code changes
docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Access MongoDB shell
docker exec -it profilebuilder-mongo mongosh -u admin -p yourpassword

# Backup MongoDB
docker exec profilebuilder-mongo mongodump --out /data/backup --username admin --password yourpassword --authenticationDatabase admin
```

---

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
netstat -tlnp | grep 5000

# Kill the process or change port in docker-compose
```

### Container not starting
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check container status
docker ps -a
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker exec -it profilebuilder-mongo mongosh -u admin -p yourpassword

# Check network
docker network ls
docker network inspect profilebuilder_profilebuilder-network
```

### Frontend can't reach backend
- Ensure `NEXT_PUBLIC_API_URL` is correct
- Check if backend container is healthy: `docker ps`
- Verify reverse proxy is configured correctly

---

## Architecture

```
                    ┌─────────────────┐
                    │   aaPanel       │
                    │  (Nginx Proxy)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Frontend │  │ Backend  │  │ MongoDB  │
        │  :3000   │  │  :5000   │  │  :27017  │
        └──────────┘  └──────────┘  └──────────┘
                             │              │
                             └──────────────┘
                                    │
                             ┌──────────┐
                             │  Redis   │
                             │  :6379   │
                             └──────────┘
```

---

## Support

If you encounter issues, check:
1. Docker logs: `docker-compose -f docker-compose.prod.yml logs`
2. aaPanel error logs
3. Browser console for frontend errors
