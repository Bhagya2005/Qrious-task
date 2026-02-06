
import {CallHandler,ExecutionContext,Injectable,NestInterceptor} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

@Injectable()
export class CommonResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          const res = response as { data: T; message?: string };
          return {
            success: true,
            message: res.message,
            data: res.data,
          };
        }
        
        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}


