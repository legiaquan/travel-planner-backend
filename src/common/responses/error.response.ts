import { StatusCodes } from 'http-status-codes';

import { RequestContextService } from '../context/request-context.service';
import { BaseResponse } from './base.response';

export class ErrorResponse extends BaseResponse {
  error: string;
  statusCode: number;

  constructor(
    error: string,
    requestContext: RequestContextService,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    metadata: Record<string, unknown> = {},
  ) {
    super('error', requestContext, metadata);
    this.error = error;
    this.statusCode = statusCode;
  }
}
