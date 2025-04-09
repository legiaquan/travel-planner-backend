import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const mongooseConfig: MongooseModuleOptions = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-planner',
  connectionFactory: (connection: Connection) => {
    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    connection.on('error', (error: Error) => {
      console.error('MongoDB connection error:', error);
    });

    return connection;
  },
  retryAttempts: 3,
  retryDelay: 1000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
};
