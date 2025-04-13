import { StatusCodes } from 'http-status-codes';

export interface BaseResponseOptions {
  status: string;
  statusCode?: StatusCodes;
  metadata?: Record<string, unknown>;
}

export class BaseResponse {
  status: string;
  timestamp: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  statusCode: StatusCodes;

  constructor(options: BaseResponseOptions) {
    this.status = options.status;
    this.statusCode = options.statusCode;
    this.timestamp = new Date().toISOString();
    if (options.metadata && Object.keys(options.metadata).length > 0) {
      this.metadata = options.metadata;
    }
  }
}
