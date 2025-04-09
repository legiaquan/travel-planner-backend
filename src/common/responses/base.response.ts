import { RequestContextService } from '../context/request-context.service';

export class BaseResponse {
  status: string;
  timestamp: string;
  requestId?: string;
  metadata: Record<string, unknown>;

  constructor(
    status: string,
    requestContext: RequestContextService,
    metadata: Record<string, unknown> = {},
  ) {
    this.status = status;
    this.timestamp = new Date().toISOString();
    this.requestId = requestContext.getRequestId();
    this.metadata = metadata;
  }
}
