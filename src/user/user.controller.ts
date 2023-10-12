import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService

  @Inject(EmailService)
  private emailService: EmailService

  // 注册接口
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  // 创建发送注册验证码接口
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    // 把验证码存到redia
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)

    // 发送验证码
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的验证码是${code}</p>`
    })
    return '发送成功'
  }
}
