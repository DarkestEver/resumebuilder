/**
 * Production Server - Combined Backend API + Next.js Frontend
 * 
 * This server runs both the Express API and Next.js in a single process
 * for simplified production deployment.
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '5000', 10);

// Initialize Next.js
const nextApp = next({ 
  dev,
  dir: path.join(__dirname, 'frontend'),
  hostname,
  port
});
const handle = nextApp.getRequestHandler();

async function startServer() {
  try {
    await nextApp.prepare();
    console.log('✅ Next.js prepared');

    // Import backend app (compiled) - wrap in try-catch
    let backendApp;
    try {
      backendApp = require('./backend/dist/app').default;
      console.log('✅ Backend loaded');
    } catch (err) {
      console.error('❌ Failed to load backend:', err.message);
      console.log('⚠️  Running frontend only mode');
      backendApp = null;
    }
    
    // Create combined server
    const server = createServer(async (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // API routes go to Express backend
      if (backendApp && (
          pathname.startsWith('/api/') || 
          pathname.startsWith('/uploads/') ||
          pathname === '/health')) {
        backendApp(req, res);
      } 
      // Everything else goes to Next.js
      else {
        await handle(req, res, parsedUrl);
      }
    });

    server.listen(port, hostname, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ProfileBuilder Production Server                     ║
║                                                           ║
║   Server running at: http://${hostname}:${port}              ║
║   Environment: ${dev ? 'development' : 'production'}                            ║
║                                                           ║
║   API:      http://${hostname}:${port}/api                   ║
║   Frontend: http://${hostname}:${port}                       ║
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
