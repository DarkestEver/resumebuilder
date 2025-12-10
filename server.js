/**
 * Production Server - Backend API Only
 * 
 * For production deployment:
 * - Backend API runs on this server (port 5000)
 * - Frontend should be deployed separately (Vercel, Netlify, or another port)
 * 
 * For local development, run:
 * - Backend: npm run dev:backend (port 5000)
 * - Frontend: npm run dev:frontend (port 3000)
 */

const path = require('path');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // Import backend app (compiled)
    let app;
    try {
      app = require('./backend/dist/app').default;
      console.log('✅ Backend loaded');
    } catch (err) {
      console.error('❌ Failed to load backend:', err.message);
      console.error('   Run "cd backend && npm run build" first');
      process.exit(1);
    }
    
    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ProfileBuilder API Server                            ║
║                                                           ║
║   Server running at: http://0.0.0.0:${port}                  ║
║   Environment: ${process.env.NODE_ENV.padEnd(11)}                        ║
║                                                           ║
║   API:      http://0.0.0.0:${port}/api                       ║
║   Health:   http://0.0.0.0:${port}/health                    ║
║                                                           ║
║   Frontend: Run separately with 'npm run dev:frontend'    ║
║             or deploy to Vercel/Netlify                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();

startServer();
