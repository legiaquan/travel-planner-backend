import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { RequestContextService } from '../context/request-context.service';
import { SuccessResponseType } from '../interfaces/response.interface';
import { BaseResponse } from './base.response';

export interface SuccessResponseOptions<T> extends Partial<SuccessResponseType> {
  data: T;
  requestContext: RequestContextService;
}

export class SuccessResponse<T> extends BaseResponse {
  data: T;
  message: string;
  statusCode: number;

  constructor({
    data,
    requestContext,
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
  }: SuccessResponseOptions<T>) {
    super({ status: 'success', requestContext, metadata });
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
