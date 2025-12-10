#!/bin/bash

# ===========================================
# ProfileBuilder - One-Click Deploy Script
# ===========================================
# 
# Usage: ./scripts/deploy.sh
#
# This script will:
# 1. Build and start all Docker containers
# 2. Wait for services to be ready
# 3. Seed the database with admin users
# ===========================================

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🚀 ProfileBuilder - Production Deployment               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "   Please create .env.production with your configuration."
    exit 1
fi

# Copy env file for docker-compose
echo "📋 Setting up environment..."
cp .env.production .env

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build and start containers
echo ""
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for MongoDB to be ready
echo ""
echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

# Check if containers are running
echo ""
echo "🔍 Checking container status..."
docker-compose -f docker-compose.prod.yml ps

# Seed the database
echo ""
echo "🌱 Seeding database with admin users..."
docker exec profilebuilder-backend node scripts/seed-database.js 2>/dev/null || {
    echo "⚠️  Note: Seeding might need to be run manually after first deploy"
    echo "   Run: docker exec -it profilebuilder-backend node scripts/seed-database.js"
}

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   ✅ Deployment Complete!                                 ║"
echo "║                                                           ║"
echo "║   Frontend: http://localhost:3000                         ║"
echo "║   Backend:  http://localhost:5000                         ║"
echo "║   API:      http://localhost:5000/api                     ║"
echo "║                                                           ║"
echo "║   Admin Login:                                            ║"
echo "║   Email:    admin@profilebuilder.com                      ║"
echo "║   Password: Admin@123456                                  ║"
echo "║                                                           ║"
echo "║   Demo Login:                                             ║"
echo "║   Email:    demo@profilebuilder.com                       ║"
echo "║   Password: Demo@123456                                   ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop:          docker-compose -f docker-compose.prod.yml down"
echo "   Restart:       docker-compose -f docker-compose.prod.yml restart"
echo ""
