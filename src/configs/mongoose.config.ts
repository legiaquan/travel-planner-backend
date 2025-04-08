import { registerAs } from '@nestjs/config';
import mongoose from 'mongoose';

export default registerAs('mongoose', () => {
  // Enable Mongoose debugging
  mongoose.set('debug', true);

  return {
    uri: process.env.MONGODB_URI,
    retryAttempts: 1,
    retryDelay: 1000,
  };
});
