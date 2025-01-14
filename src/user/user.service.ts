import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Like, Repository } from 'typeorm'
import { Logger } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { md5 } from 'src/utils'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { PassLoginDto } from './dto/pass-login.dto'
import { LoginUserVo } from './vo/login-user.vo'
import { UserInfoVo } from './vo/user-info.vo'
import { UpdateUserPasswordDto } from './dto/update-user-password.dto'
import { UpdateUserDto } from './dto/udpate-user.dto'
import { UserListVo } from './vo/user-list.vo'
import { EmailLoginDto } from './dto/email-login.dto'

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
    user1.password = md5('333333')
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

  // 密码登录
  async passLogin(loginUser: PassLoginDto, isAdmin: boolean) {
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

  // 邮箱登录
  async emailLogin(loginUser: EmailLoginDto) {
    const captcha = await this.redisService.get(
      `login_captcha_${loginUser.email}`
    )

    if (!captcha) {
      throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
    }

    if (loginUser.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    }
    // 根据条件-数据库查询用户
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username
      },
      relations: ['roles', 'roles.permissions']
    })

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (user.email !== loginUser.email) {
      throw new HttpException('邮箱错误', HttpStatus.BAD_REQUEST)
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
      email: user.email,
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

  // 修改密码前先得到已有信息
  async findUserInfoById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })

    const vo = new UserInfoVo()
    vo.id = user.id
    vo.email = user.email
    vo.username = user.username
    vo.headPic = user.head_pic
    vo.phoneNumber = user.phoneNumber
    vo.nickName = user.nick_name
    vo.createTime = user.create_time
    vo.isFrozen = user.is_frozen

    console.log(vo)

    return vo
  }

  // 修改密码
  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    // 根据id查用户
    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username
    })

    if (foundUser.email !== passwordDto.email) {
      throw new HttpException('该邮箱未关联该用户', HttpStatus.BAD_REQUEST)
    }

    // 查验证码
    const captch = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`
    )

    if (!captch) {
      throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
    }

    if (captch !== passwordDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    }

    // 修改并保存新密码
    foundUser.password = md5(passwordDto.password)

    try {
      await this.userRepository.save(foundUser)
      return '密码修改成功'
    } catch (e) {
      this.logger.error(e, UserService)
      return '密码修改失败'
    }
  }

  // 修改用户信息
  async update(userId: number, updateUser: UpdateUserDto) {
    // 查验证码
    const captch = await this.redisService.get(
      `update_user_captcha_${updateUser.email}`
    )

    if (!captch) {
      throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
    }

    if (captch !== updateUser.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
    }

    // 根据id查用户
    const foundUser = await this.userRepository.findOneBy({
      id: userId
    })

    if (updateUser.headPic) {
      foundUser.head_pic = updateUser.headPic
    }

    if (updateUser.nickName) {
      foundUser.nick_name = updateUser.nickName
    }

    try {
      await this.userRepository.save(foundUser)
      return '用户信息修改成功'
    } catch (e) {
      this.logger.error(e, UserService)
      return '用户信息修改失败'
    }
  }

  // 冻结用户
  async freezeUserById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    })

    user.is_frozen = true

    await this.userRepository.save(user)
  }

  // 冻结用户
  async unFreezeUserById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    })

    user.is_frozen = false

    await this.userRepository.save(user)
  }

  // 查找用户列表
  async findUsers(
    username: string,
    nickName: string,
    email: string,
    pageNo: number,
    pageSize: number
  ) {
    const skipCount = (pageNo - 1) * pageSize

    const condition: Record<string, any> = {}

    // 模糊查询
    if (username) {
      condition.username = Like(`%${username}%`)
    }

    if (nickName) {
      condition.nick_name = Like(`%${nickName}%`)
    }

    if (email) {
      condition.email = Like(`%${email}%`)
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'email',
        'head_pic',
        'create_time',
        'update_time',
        'nick_name',
        'username',
        'phone',
        'is_frozen'
      ],
      skip: skipCount,
      take: pageSize,
      where: condition
    })

    const vo = new UserListVo()
    vo.totalCount = totalCount
    vo.users = users

    return vo
  }
}
