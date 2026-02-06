import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: HttpExceptionResponse | null = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object') {
        errorResponse = res as HttpExceptionResponse;
      }
    }

   response.status(status).json({
      success: false,
      data: null,
      error: {
        message: errorResponse?.message,
        statusCode: status,
      },
    });
  }
}
