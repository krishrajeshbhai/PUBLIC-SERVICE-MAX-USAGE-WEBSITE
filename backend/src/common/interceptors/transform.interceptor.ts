import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    return next.handle().pipe(
      map((data) => {
        // If data is already packaged in the response envelope, return as is
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return data as ResponseFormat<T>;
        }
        
        return {
          success: true,
          data: data,
          meta: {
            requestId: (request.headers['x-request-id'] as string) || 'req-' + Date.now(),
          },
        };
      }),
    );
  }
}
