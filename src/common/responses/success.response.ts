import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { RequestContextService } from '../context/request-context.service';
import { SuccessResponseType } from '../interfaces/response.interface';
import { BaseResponse } from './base.response';

export class SuccessResponse<T> extends BaseResponse {
  data: T;
  message: string;
  statusCode: number;

  constructor(
    data: T,
    requestContext: RequestContextService,
    {
      message = ReasonPhrases.OK,
      statusCode = StatusCodes.OK,
      metadata = {},
    }: Partial<SuccessResponseType> = {},
  ) {
    super('success', requestContext, metadata);
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
