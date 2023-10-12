import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Logger } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { md5 } from 'src/utils'

@Injectable()
export class UserService {
  logger = new Logger()

  @InjectRepository(User)
  private userRepository: Repository<User>

  @Inject(RedisService)
  private redisService: RedisService

  //注册:验证码判断-用户是否已存在-创建保存新用户-返回信息
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`)

    if (!captcha) {
      throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    }

    // 在数据库中查用户
    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    })

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }

    // 用户不存在就创建
    const newUser = new User()
    newUser.username = user.username
    newUser.password = md5(user.password)
    newUser.email = user.email
    newUser.nick_name = user.nickName

    try {
      await this.userRepository.save(newUser)
      return '注册成功'
    } catch (e) {
      this.logger.error(e, UserService)
      return '注册失败'
    }
  }
}
