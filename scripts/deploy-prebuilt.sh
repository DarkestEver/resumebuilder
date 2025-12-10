#!/bin/bash

# ===========================================
# ProfileBuilder - Deploy Pre-built Files
# ===========================================
# 
# Usage: ./scripts/deploy-prebuilt.sh
#
# Prerequisites:
# - Run "npm run build" locally first
# - Upload the entire project to VPS
# ===========================================

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀 ProfileBuilder - Deploy Pre-built                    ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# Check if builds exist
if [ ! -d "backend/dist" ]; then
    echo "❌ Error: backend/dist not found!"
    echo "   Run 'cd backend && npm run build' first"
    exit 1
fi

if [ ! -d "frontend/.next" ]; then
    echo "❌ Error: frontend/.next not found!"
    echo "   Run 'cd frontend && npm run build' first"
    exit 1
fi

# Copy env file
echo "📋 Setting up environment..."
cp .env.production .env

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prebuilt.yml down 2>/dev/null || true

# Start containers (no build needed!)
echo ""
echo "🚀 Starting containers with pre-built files..."
docker-compose -f docker-compose.prebuilt.yml up -d

# Wait for services
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Check status
echo ""
echo "🔍 Container status:"
docker-compose -f docker-compose.prebuilt.yml ps

# Seed database
echo ""
echo "🌱 Seeding database..."
docker exec profilebuilder-backend node scripts/seed-database.js 2>/dev/null || {
    echo "⚠️  Run manually: docker exec -it profilebuilder-backend node scripts/seed-database.js"
}

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ Deployment Complete!                                 ║"
echo "║                                                           ║"
echo "║   Frontend: http://localhost:3000                         ║"
echo "║   Backend:  http://localhost:5000                         ║"
echo "║                                                           ║"
echo "║   Admin: admin@profilebuilder.com / Admin@123456          ║"
echo "║   Demo:  demo@profilebuilder.com / Demo@123456            ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
