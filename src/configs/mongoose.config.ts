import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CustomLoggerService } from '../utils/logger';

const logger = CustomLoggerService.getInstance('MongoDB');

export const mongooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-planner',
  connectionFactory: (connection: Connection) => {
    connection.on('connected', () => {
      logger.log('MongoDB connected successfully');
    });

    connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    connection.on('error', (error: Error) => {
      logger.error('MongoDB connection error:', error.stack);
    });

    return connection;
  },
  retryAttempts: 3,
  retryDelay: 1000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
};
