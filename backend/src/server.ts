import http from 'http';
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { initializeSocket } from './socket';

const PORT = config.port;

logger.info('Creating HTTP server...');
const httpServer = http.createServer(app);

logger.info('Initializing Socket.IO...');
const io = initializeSocket(httpServer);

// Export io for use in services/routes
export { io };

logger.info(`Attempting to bind to port ${PORT}...`);
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${config.env}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}`);
  logger.info(`🔌 WebSocket ready for real-time notifications`);
});

httpServer.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${PORT} is already in use`);
  } else {
    logger.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  httpServer.close(() => process.exit(1));
});
