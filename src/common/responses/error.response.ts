import { StatusCodes } from 'http-status-codes';

import { RequestContextService } from '../context/request-context.service';
import { BaseResponse } from './base.response';

export interface ErrorResponseOptions {
  error: string;
  requestContext: RequestContextService;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

export class ErrorResponse extends BaseResponse {
  error: string;
  statusCode: number;

  constructor({
    error,
    requestContext,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    metadata = {},
  }: ErrorResponseOptions) {
    super({ status: 'error', requestContext, metadata });
    this.error = error;
    this.statusCode = statusCode;
  }
}
