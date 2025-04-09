import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ServerlessGlobal } from '../interfaces/serverless.interface';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;

  constructor() {
    // Check if running in serverless context
    const event = (global as unknown as ServerlessGlobal).serverless?.event;
    if (event?.requestContext?.requestId) {
      this.requestId = event.requestContext.requestId;
    } else {
      this.requestId = uuidv4();
    }
  }

  getRequestId(): string {
    return this.requestId;
  }
}
