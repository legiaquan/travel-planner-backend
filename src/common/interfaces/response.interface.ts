import { StatusCodes } from 'http-status-codes';

export interface SuccessResponseType {
  message: string;
  statusCode: StatusCodes;
  metadata: Record<string, unknown>;
}
