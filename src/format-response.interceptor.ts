import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Response } from 'express'
import { Observable, map } from 'rxjs'

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse()
    // 响应数据的格式化
    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: 'success',
          data
        }
      })
    )
  }
}
