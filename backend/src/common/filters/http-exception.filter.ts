import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Exception caught in filter:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException
      ? exception.getResponse()
      : null;

    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'object') {
        errorCode = (exceptionResponse as any).code || (exceptionResponse as any).error || 'BAD_REQUEST';
        message = (exceptionResponse as any).message || message;
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: message,
      },
      meta: {
        requestId: request.headers['x-request-id'] || 'req-' + Date.now(),
        path: request.url,
      },
    });
  }
}
