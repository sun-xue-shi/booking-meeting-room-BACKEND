import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { FeedbackDto } from './dto/feedback.dto'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'
import { PassLoginDto } from './dto/pass-login.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { RequireLogin, UserInfo } from 'src/custom.decorator'
import { UpdateUserPasswordDto } from './dto/update-user-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { generateParseIntPipe } from 'src/utils'
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { LoginUserVo } from './vo/login-user.vo'
import { RefreshTokenVo } from './vo/refresh-token.vo'
import { UserInfoVo } from './vo/user-info.vo'
import { UserInfoSimpleVo } from './vo/user-info-simple.vo'
import { FileInterceptor } from '@nestjs/platform-express'
import * as path from 'path'
import { storage } from 'src/file-storage'
import { EmailLoginDto } from './dto/email-login.dto'
import { IpService } from 'src/ip/ip.service'

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(IpService)
  private ipService: IpService

  @Inject(RedisService)
  private redisService: RedisService

  @Inject(EmailService)
  private emailService: EmailService

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  // 注册接口
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  // 发送注册验证码接口
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String
  })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    // 把验证码存到redis
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)

    // 发送验证码
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">微光海网络科技</h1>
              <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 16px;">账户验证服务</p>
            </div>
            <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">您好！</h2>
            <p style="color: #34495e; line-height: 1.6; font-size: 16px;">
              感谢您注册微光海网络科技平台。为了完成您的账户注册，请在5分钟内输入以下验证码：
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #ffffff; background-color: #3498db; border-radius: 4px; letter-spacing: 3px;">${code}</span>
            </div>
            <p style="color: #e74c3c; font-size: 14px; font-weight: bold; text-align: center; margin: 20px 0;">
              此验证码将在5分钟后过期，请尽快使用。
            </p>
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              如果您没有请求此验证码，请忽略此邮件。<br>
              此邮件由系统自动发送，请勿回复。
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>&copy; 2025 微光海网络科技. 保留所有权利。</p>
          </div>
        </div>
      `
    })
    return '发送成功'
  }

  // 发送登录验证码接口
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String
  })
  @Get('login-captcha')
  async loginCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    // 把验证码存到redis
    await this.redisService.set(`login_captcha_${address}`, code, 5 * 60)

    // 发送验证码
    await this.emailService.sendMail({
      to: address,
      subject: '登录验证码',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">微光海网络科技</h1>
              <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 16px;">账户验证服务</p>
            </div>
            <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">您好！</h2>
            <p style="color: #34495e; line-height: 1.6; font-size: 16px;">
              您正在尝试登录微光海网络科技平台。为了确保账户安全，请在5分钟内输入以下验证码：
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #ffffff; background-color: #3498db; border-radius: 4px; letter-spacing: 3px;">${code}</span>
            </div>
            <p style="color: #e74c3c; font-size: 14px; font-weight: bold; text-align: center; margin: 20px 0;">
              此验证码将在5分钟后过期，请尽快使用。
            </p>
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              如果您没有请求此验证码，请忽略此邮件。<br>
              此邮件由系统自动发送，请勿回复。
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>&copy; 2025 微光海网络科技. 保留所有权利。</p>
          </div>
        </div>
      `
    })
    return '发送成功'
  }

  // 初始化数据
  @Get('init-data')
  async initData() {
    await this.userService.initData()
    return 'done'
  }

  // 普通用户邮箱登录接口
  @ApiBody({
    type: EmailLoginDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
  })
  @Post('emaillogin')
  async emailLogin(@Body() loginUser: EmailLoginDto) {
    // 获取普通用户登录信息vo来生成token
    const vo = await this.userService.emailLogin(loginUser)

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        email: vo.userInfo.email,
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

  // 普通用户密码登录接口
  @ApiBody({
    type: PassLoginDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
  })
  @Post('passlogin')
  async passLogin(@Body() loginUser: PassLoginDto) {
    console.log(11111)

    // 获取普通用户登录信息vo来生成token
    const vo = await this.userService.passLogin(loginUser, false)

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        email: vo.userInfo.email,
        permissions: vo.userInfo.permissions
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '1m'
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
  @ApiBody({
    type: PassLoginDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
  })
  @Post('admin/login')
  async adminLogin(@Body() loginUser: PassLoginDto) {
    // 获取管理员登录信息vo来生成token
    const vo = await this.userService.passLogin(loginUser, true)

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        email: vo.userInfo.email,
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

  // 刷新普通用户refresh_token接口
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'fddd44f4e6a54sf51efa54d54e'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)

      const user = await this.userService.findUserById(data.userId, false)

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
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

      const vo = new RefreshTokenVo()
      vo.access_token = access_token
      vo.refresh_token = refresh_token

      return vo
    } catch (e) {
      throw new UnauthorizedException('token失效,请重新登录')
    }
  }

  // 刷新管理员refresh_token接口
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'fddd44f4e6a54sf51efa54d54e'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo
  })
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)

      const user = await this.userService.findUserById(data.userId, true)

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
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

      const vo = new RefreshTokenVo()
      vo.access_token = access_token
      vo.refresh_token = refresh_token

      return vo
    } catch (e) {
      throw new UnauthorizedException('token失效,请重新登录')
    }
  }

  // 回显用户信息接口
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserInfoSimpleVo
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.findUserInfoById(userId)
  }

  // 修改密码接口
  @ApiBody({
    type: UpdateUserPasswordDto
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确'
  })
  @Post(['update_password', 'admin/update_password'])
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(passwordDto)
  }

  // 发送修改密码的验证码-接口
  @ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String
  })
  @ApiResponse({
    type: String,
    description: '发送成功'
  })
  @Get('update_password/captcha')
  async updatePasswordCaptch(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60
    )

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">微光海网络科技</h1>
              <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 16px;">账户安全服务</p>
            </div>
            <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">您好！</h2>
            <p style="color: #34495e; line-height: 1.6; font-size: 16px;">
              您正在申请修改微光海网络科技平台账户密码。为了确保账户安全，请在10分钟内输入以下验证码：
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #ffffff; background-color: #3498db; border-radius: 4px; letter-spacing: 3px;">${code}</span>
            </div>
            <p style="color: #e74c3c; font-size: 14px; font-weight: bold; text-align: center; margin: 20px 0;">
              此验证码将在10分钟后过期，请尽快使用。
            </p>
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              如果您没有请求此验证码，请忽略此邮件。<br>
              此邮件由系统自动发送，请勿回复。
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>&copy; 2025 微光海网络科技. 保留所有权利。</p>
          </div>
        </div>
      `
    })

    return '发送成功'
  }

  // 修改个人信息接口
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码失效/不正确'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUser: UpdateUserDto
  ) {
    return await this.userService.update(userId, updateUser)
  }

  // 发送修改个人信息的验证码-接口
  // @ApiQuery({
  //   name: 'address',
  //   description: '邮箱地址',
  //   type: String
  // })
  @ApiResponse({
    type: String,
    description: '发送成功'
  })
  @Get('update/captcha')
  @ApiBearerAuth()
  @RequireLogin()
  async updateCaptch(@UserInfo('email') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.redisService.set(`update_user_captcha_${address}`, code, 10 * 60)

    await this.emailService.sendMail({
      to: address,
      subject: '修改个人信息',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 24px;">微光海网络科技</h1>
              <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 16px;">账户信息服务</p>
            </div>
            <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">您好！</h2>
            <p style="color: #34495e; line-height: 1.6; font-size: 16px;">
              您正在申请修改微光海网络科技平台个人账户信息。为了确保账户安全，请在10分钟内输入以下验证码：
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; color: #ffffff; background-color: #3498db; border-radius: 4px; letter-spacing: 3px;">${code}</span>
            </div>
            <p style="color: #e74c3c; font-size: 14px; font-weight: bold; text-align: center; margin: 20px 0;">
              此验证码将在10分钟后过期，请尽快使用。
            </p>
            <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              如果您没有请求此验证码，请忽略此邮件。<br>
              此邮件由系统自动发送，请勿回复。
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>&copy; 2025 微光海网络科技. 保留所有权利。</p>
          </div>
        </div>
      `
    })

    return '发送成功'
  }

  // 冻结用户接口
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number
  })
  @ApiResponse({
    description: 'success',
    type: String
  })
  @ApiBearerAuth()
  @RequireLogin()
  @Get('freeze')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId)

    return 'success'
  }

  // 冻结用户接口
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number
  })
  @ApiResponse({
    description: 'success',
    type: String
  })
  @ApiBearerAuth()
  @RequireLogin()
  @Get('unFreeze')
  async unFreeze(@Query('id') userId: number) {
    await this.userService.unFreezeUserById(userId)

    return 'success'
  }

  // 用户列表
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页条数',
    type: Number
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: String
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: String
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: String
  })
  @ApiResponse({
    type: String,
    description: '用户列表'
  })
  @RequireLogin()
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize')
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string
  ) {
    return await this.userService.findUsers(
      username,
      nickName,
      email,
      pageNo,
      pageSize
    )
  }

  // 上传文件
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      limits: { fieldSize: 1024 * 1024 * 3 },
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname)
        if (['.png', '.gif', '.jpg'].includes(extname)) {
          callback(null, true)
        } else {
          callback(new BadRequestException('只能上传图片'), false)
        }
      }
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path
  }

  // 根据用户名获取诊断建议
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '诊断建议',
    schema: {
      type: 'object',
      properties: {
        level: { type: 'string', example: '优秀级' },
        conclusion: {
          type: 'string',
          example: '您的IP属于"优质基层劳动者IP"...'
        },
        suggestion: { type: 'string', example: '建议重点推进好物严选合作...' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    type: String
  })
  @Get('diagnosis')
  @RequireLogin()
  async getDiagnosisByUsername(@UserInfo('username') username: string) {
    if (!username) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.findUserByUsername(username)

    if (!user) {
      return null
    }

    return this.ipService.getSuggestion(user.score)
  }

  // IP诊断建议接口
  @ApiQuery({
    name: 'score',
    description: 'IP评分',
    type: Number,
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '诊断建议',
    schema: {
      type: 'object',
      properties: {
        level: { type: 'string', example: '优秀级' },
        conclusion: {
          type: 'string',
          example: '您的IP属于"优质基层劳动者IP"...'
        },
        suggestion: { type: 'string', example: '建议重点推进好物严选合作...' }
      }
    }
  })
  @Get('suggest')
  @RequireLogin()
  async getSuggestion(
    @Query('score') score: number,
    @UserInfo('username') username: string
  ) {
    if (score === undefined || score === null || isNaN(score)) {
      throw new HttpException(
        'score参数不能为空且必须为数字',
        HttpStatus.BAD_REQUEST
      )
    }

    // 更新用户score
    try {
      await this.userService.updateUserScore(username, score)
    } catch (error) {
      throw new HttpException('用户score更新失败', HttpStatus.BAD_REQUEST)
    }

    // 返回诊断建议
    return this.ipService.getSuggestion(score)
  }

  // 用户提交反馈接口
  @ApiBearerAuth()
  @ApiBody({
    type: FeedbackDto
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '反馈提交成功',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '参数验证失败',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '反馈提交失败',
    type: String
  })
  @Post('feedback')
  @RequireLogin()
  async submitFeedback(
    @UserInfo('userId') userId: number,
    @Body() feedbackDto: FeedbackDto
  ) {
    return await this.userService.submitFeedback(userId, feedbackDto)
  }
}
