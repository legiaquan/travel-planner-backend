import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async checkHealth() {
    try {
      const dbState = this.connection.readyState;
      await Promise.resolve();
      return {
        status: 'ok',
        database: {
          status: dbState === ConnectionStates.connected ? 'connected' : 'disconnected',
          readyState: dbState,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  ping() {
    return {
      status: 'ok',
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }
}
