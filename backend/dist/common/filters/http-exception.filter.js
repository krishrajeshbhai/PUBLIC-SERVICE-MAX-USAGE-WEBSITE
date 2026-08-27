var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        console.error('Exception caught in filter:', exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
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
                errorCode = exceptionResponse.code || exceptionResponse.error || 'BAD_REQUEST';
                message = exceptionResponse.message || message;
                if (Array.isArray(message)) {
                    message = message.join(', ');
                }
            }
            else if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
        }
        else if (exception instanceof Error) {
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
};
HttpExceptionFilter = __decorate([
    Catch()
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map