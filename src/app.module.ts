import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { Feedback } from './user/entities/feedback.entity'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { LoginGuard } from './login.guard'
import { PermissionGuard } from './permission.guard'
import { MeetingRoomModule } from './meeting-room/meeting-room.module'
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity'
import { BookingModule } from './booking/booking.module'
import { Booking } from './booking/entities/booking.entity'
import { StatisticModule } from './statistic/statistic.module'
import { IpModule } from './ip/ip.module'
import { ServeModule } from './serve/serve.module'
import { Serve } from './serve/entities/serve.entity'
import * as path from 'path'
import { ServerServiceOption } from './serve/entities/server-service-option.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [
            User,
            Role,
            Permission,
            MeetingRoom,
            Booking,
            Feedback,
            Serve,
            ServerServiceOption
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password'
          }
        }
      },

      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m'
          }
        }
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env')
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
    IpModule,
    ServeModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ]
})
export class AppModule {}
