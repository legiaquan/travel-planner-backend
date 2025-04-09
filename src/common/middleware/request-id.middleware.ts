import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { RequestContextService } from '../context/request-context.service';
import { RequestWithId } from '../interfaces/request.interface';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(req: RequestWithId, res: Response, next: NextFunction) {
    // Set request ID in request object for access in controllers/services
    req.requestId = this.requestContext.getRequestId();

    // Set request ID in response header
    res.setHeader('X-Request-ID', this.requestContext.getRequestId());

    next();
  }
}
