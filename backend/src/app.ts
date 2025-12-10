import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import resumeRoutes from './routes/resume.routes';
import cvUploadRoutes from './routes/cvUpload.routes';
import pdfRoutes from './routes/pdf.routes';
import aiRoutes from './routes/ai.routes';
import publicRoutes from './routes/public.routes';
import paymentRoutes from './routes/payment.routes';
import searchRoutes from './routes/search.routes';
import emailRoutes from './routes/email.routes';
import activityRoutes from './routes/activity.routes';
import videoRoutes from './routes/video.routes';
import adminRoutes from './routes/admin.routes';
import advancedRoutes from './routes/advanced.routes';
import linkedinRoutes from './routes/linkedin.routes';

const app: Application = express();

// MongoDB Connection (async, but don't block app initialization)
mongoose
  .connect(config.database.mongoUri)
  .then(() => {
    logger.info('✅ Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('❌ MongoDB connection error:', error);
    logger.warn('Server will continue without MongoDB (some features may not work)');
    // Don't exit - allow server to start for debugging
  });

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Note: File uploads handled by multer in individual routes (see cvUpload.routes.ts)

// Serve static files (uploaded photos and videos) with CORS headers
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
  
  // Set proper content type for video files
  if (_req.path.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
    const ext = _req.path.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'mkv': 'video/x-matroska',
      'webm': 'video/webm'
    };
    if (ext && mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
  }
  
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/cv', cvUploadRoutes);
app.use('/api/resumes', pdfRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/advanced', advancedRoutes);
app.use('/api/linkedin', linkedinRoutes);

// 404 Handler - Only for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.path,
  });
});

// Serve Next.js static files from public folder (production)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Serve Next.js _next static assets
app.use('/_next', express.static(path.join(publicPath, '_next')));

// All other routes - serve index.html for client-side routing
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html doesn't exist, return 404
      res.status(404).json({
        success: false,
        message: 'Frontend not found. Run: npm run build:frontend',
        path: req.path,
      });
    }
  });
});

// Error Handler
app.use(errorHandler);

export default app;
