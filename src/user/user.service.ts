import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Logger } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { md5 } from 'src/utils'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { LoginUserDto } from './dto/login-user.dto'
import { LoginUserVo } from './vo/login-user.vo'

@Injectable()
export class UserService {
  logger = new Logger()

  @InjectRepository(User)
  private userRepository: Repository<User>

  @Inject(RedisService)
  private redisService: RedisService

  @InjectRepository(Role)
  private roleRepository: Repository<Role>

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>

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

  // 初始化数据
  async initData() {
    const user1 = new User()
    user1.username = 'zhangsan'
    user1.password = md5('111111')
    user1.email = 'xxx@xx.com'
    user1.is_admin = true
    user1.nick_name = '张三'
    user1.phoneNumber = '13233323333'

    const user2 = new User()
    user2.username = 'lisi'
    user2.password = md5('222222')
    user2.email = 'yy@yy.com'
    user2.nick_name = '李四'

    const role1 = new Role()
    role1.rolename = '管理员'

    const role2 = new Role()
    role2.rolename = '普通用户'

    const permission1 = new Permission()
    permission1.code = 'ccc'
    permission1.desc = '访问 ccc 接口'

    const permission2 = new Permission()
    permission2.code = 'ddd'
    permission2.desc = '访问 ddd 接口'

    user1.roles = [role1]
    user2.roles = [role2]

    role1.permissions = [permission1, permission2]
    role2.permissions = [permission1]

    await this.permissionRepository.save([permission1, permission2])
    await this.roleRepository.save([role1, role2])
    await this.userRepository.save([user1, user2])
  }

  // 登录
  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    // 根据条件-数据库查询用户
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        is_admin: isAdmin
      },
      relations: ['roles', 'roles.permissions']
    })

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (user.password !== md5(loginUser.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    }

    // 封装返回的用户信息
    const vo = new LoginUserVo()
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nick_name,
      headPic: user.head_pic,
      email: user.email,
      isAdmin: user.is_admin,
      isFrozen: user.is_frozen,
      phoneNumber: user.phoneNumber,
      createTime: user.create_time,
      roles: user.roles.map((item) => item.rolename),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          // 去重
          if (arr.indexOf(permission) === -1) {
            arr.push(permission)
          }
        })
        return arr
      }, [])
    }
    return vo
  }

  // 根据id查用户
  async findUserById(userId: number, isAdmin: boolean) {
    // 根据条件-数据库查询用户
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        is_admin: isAdmin
      },
      relations: ['roles', 'roles.permissions']
    })

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((item) => item.rolename),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission)
          }
        })
        return arr
      }, [])
    }
  }
}
