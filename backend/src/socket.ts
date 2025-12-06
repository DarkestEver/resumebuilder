/**
 * Socket.io Configuration and Event Handlers
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { config } from './config';
import { logger } from './utils/logger';
import activityService from './services/activityService';

// Map to store active user connections
const userConnections = new Map<string, Set<string>>();

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Middleware to authenticate socket connections
  io.use((socket: Socket, next: (err?: any) => void) => {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;

    if (!token || !userId) {
      return next(new Error('Authentication error'));
    }

    // In production, verify JWT token here
    socket.data.userId = userId;
    socket.data.token = token;
    next();
  });

  // Connection event
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    logger.info(`👤 User ${userId} connected with socket ${socket.id}`);

    // Add user to connections map
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)!.add(socket.id);

    // Join room for user-specific notifications
    socket.join(`user:${userId}`);

    // Send initial unread count
    socket.on('request:unread-count', async () => {
      try {
        const unread = await activityService.getUnreadCount(userId);
        socket.emit('unread:count', { unread });
      } catch (error) {
        logger.error('Error fetching unread count:', error);
      }
    });

    // Request activity feed
    socket.on('request:activity-feed', async (data: { limit?: number; skip?: number }) => {
      try {
        const result = await activityService.getUserActivityFeed(
          userId,
          data.limit || 20,
          data.skip || 0
        );
        socket.emit('activity:feed', result);
      } catch (error) {
        logger.error('Error fetching activity feed:', error);
      }
    });

    // Mark activity as read
    socket.on('activity:mark-read', async (data: { activityId: string }) => {
      try {
        await activityService.markAsRead(data.activityId);
        io.to(`user:${userId}`).emit('activity:updated');
      } catch (error) {
        logger.error('Error marking activity as read:', error);
      }
    });

    // Mark all activities as read
    socket.on('activity:mark-all-read', async () => {
      try {
        await activityService.markAllAsRead(userId);
        io.to(`user:${userId}`).emit('activity:all-read');
      } catch (error) {
        logger.error('Error marking all activities as read:', error);
      }
    });

    // Disconnect event
    socket.on('disconnect', () => {
      logger.info(`👤 User ${userId} disconnected (${socket.id})`);

      const userSockets = userConnections.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userConnections.delete(userId);
        }
      }
    });

    // Error handling
    socket.on('error', (error: any) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  return io;
};

/**
 * Emit activity notification to user
 */
export const notifyUser = (
  io: SocketIOServer,
  userId: string,
  activityType: string,
  data: any
) => {
  io.to(`user:${userId}`).emit('activity:new', {
    type: activityType,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Broadcast to all connected tabs of a user
 */
export const broadcastToUser = (
  io: SocketIOServer,
  userId: string,
  eventName: string,
  data: any
) => {
  io.to(`user:${userId}`).emit(eventName, data);
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return userConnections.has(userId) && userConnections.get(userId)!.size > 0;
};

/**
 * Get online user count
 */
export const getOnlineUserCount = (): number => {
  return userConnections.size;
};

export default initializeSocket;
