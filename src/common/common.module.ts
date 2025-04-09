import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RequestContextService } from './context/request-context.service';
import { RequestIdMiddleware } from './middleware/request-id.middleware';

@Module({
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
