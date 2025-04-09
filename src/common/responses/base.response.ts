export interface BaseResponseOptions {
  status: string;
  metadata?: Record<string, unknown>;
}

export class BaseResponse {
  status: string;
  timestamp: string;
  requestId?: string;
  metadata?: Record<string, unknown>;

  constructor(options: BaseResponseOptions) {
    this.status = options.status;
    this.timestamp = new Date().toISOString();
    if (options.metadata && Object.keys(options.metadata).length > 0) {
      this.metadata = options.metadata;
    }
  }
}
