/**
 * Production Startup Script
 * 
 * Starts both backend API and frontend servers for production deployment.
 * 
 * Usage: node scripts/start-production.js
 * 
 * This script:
 * 1. Starts the backend API server on PORT (default 5000)
 * 2. Starts the Next.js frontend on FRONTEND_PORT (default 3000)
 */

const { spawn } = require('child_process');
const path = require('path');

const BACKEND_PORT = process.env.PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Starting ProfileBuilder Production Servers           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// Start Backend API
console.log(`📦 Starting Backend API on port ${BACKEND_PORT}...`);
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, PORT: BACKEND_PORT, NODE_ENV: 'production' },
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err.message);
});

// Start Frontend (Next.js)
console.log(`🎨 Starting Frontend on port ${FRONTEND_PORT}...`);
const frontend = spawn('npm', ['run', 'start', '--', '-p', FRONTEND_PORT], {
  cwd: path.join(__dirname, '..', 'frontend'),
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('❌ Frontend failed to start:', err.message);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});
