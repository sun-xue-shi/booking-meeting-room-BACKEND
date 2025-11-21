import { Module } from '@nestjs/common'
import { ServeService } from './serve.service'
import { ServeController } from './serve.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Serve } from './entities/serve.entity'
import { ServerServiceOption } from './entities/server-service-option.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Serve, ServerServiceOption])],
  controllers: [ServeController],
  providers: [ServeService],
  exports: [TypeOrmModule]
})
export class ServeModule {}
