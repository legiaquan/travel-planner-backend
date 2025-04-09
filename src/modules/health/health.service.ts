import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

import { RequestContextService } from '../../common/context/request-context.service';
import { ErrorResponse, SuccessResponse } from '../../common/responses';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly requestContext: RequestContextService,
  ) {}

  async checkHealth() {
    try {
      const dbState = this.connection.readyState;
      await Promise.resolve();
      return new SuccessResponse(
        {
          database: {
            status: dbState === ConnectionStates.connected ? 'connected' : 'disconnected',
            readyState: dbState,
          },
        },
        this.requestContext,
      );
    } catch (error: unknown) {
      return new ErrorResponse(
        error instanceof Error ? error.message : 'Unknown error',
        this.requestContext,
      );
    }
  }

  ping() {
    return new SuccessResponse(
      {
        message: 'pong',
      },
      this.requestContext,
    );
  }
}
