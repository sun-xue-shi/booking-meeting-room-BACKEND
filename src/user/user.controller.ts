import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException
} from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService

  @Inject(EmailService)
  private emailService: EmailService

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  // 注册接口
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  // 发送注册验证码接口
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    // 把验证码存到redis
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)

    // 发送验证码
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的验证码是${code}</p>`
    })
    return '发送成功'
  }

  // 初始化数据
  @Get('init-data')
  async initData() {
    await this.userService.initData()
    return 'done'
  }

  // 普通用户登录接口
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    // 获取普通用户登录信息vo来生成token
    const vo = await this.userService.login(loginUser, false)

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m'
      }
    )

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d'
      }
    )

    return vo
  }

  // 管理员登录接口
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    // 获取管理员登录信息vo来生成token
    const vo = await this.userService.login(loginUser, true)

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m'
      }
    )

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d'
      }
    )

    return vo
  }

  // 刷新普通用户refresh_token
  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)

      const user = await this.userService.findUserById(data.userId, false)

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m'
        }
      )

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d'
        }
      )

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token失效,请重新登录')
    }
  }

  // 刷新管理员refresh_token
  @Get('admin/refresh')
  async adminRefresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)

      const user = await this.userService.findUserById(data.userId, true)

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m'
        }
      )

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d'
        }
      )

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new UnauthorizedException('token失效,请重新登录')
    }
  }
}
