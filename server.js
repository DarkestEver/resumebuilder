/**
 * Production Server - Backend API Entry Point
 * 
 * This script starts the backend server.
 * The backend handles API routes and can serve static files.
 * 
 * Build steps:
 * 1. npm run build (builds both backend and frontend)
 * 2. npm run start (starts this server)
 * 
 * For full SSR frontend, also run:
 * - cd frontend && npm run start (port 3000)
 */

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ProfileBuilder Production Server                     ║
║                                                           ║
║   Environment: ${(process.env.NODE_ENV || 'production').padEnd(11)}                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// Start the backend server (it handles its own listen())
require('./backend/dist/server');
