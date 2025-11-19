import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { Feedback } from './entities/feedback.entity'
import { IpModule } from '../ip/ip.module'
import { IpService } from '../ip/ip.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Feedback]), IpModule],
  controllers: [UserController],
  providers: [UserService, IpService],
  exports: [UserService]
})
export class UserModule {}
