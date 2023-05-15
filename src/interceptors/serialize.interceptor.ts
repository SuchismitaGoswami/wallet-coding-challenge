import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClassSerializerInterceptor implements NestInterceptor {
  constructor(private readonly type: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        const response = plainToInstance(this.type, data, {
          excludeExtraneousValues: true,
        });
        return response;
      }),
    );
  }
}
