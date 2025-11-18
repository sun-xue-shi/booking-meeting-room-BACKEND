import { Module } from '@nestjs/common'
import { IpController } from './ip.controller'
import { IpService } from './ip.service'

@Module({
  controllers: [IpController],
  providers: [IpService],
  exports: [IpService]
})
export class IpModule {}
