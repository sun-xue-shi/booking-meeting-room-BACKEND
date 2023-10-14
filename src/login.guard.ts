import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { UnloginException } from './unlogin.filter'

interface JwtUserData {
  userId: number
  username: string
  roles: Role[]
  permissions: Permission[]
}

// Request扩展user属性
declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector

  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    // 获取require-login标识的handler、controller
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ])

    if (!requireLogin) {
      return true
    }

    // 验证登录
    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnloginException()
    }

    try {
      const token = authorization.split(' ')[1]

      const data = this.jwtService.verify<JwtUserData>(token)

      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions
      }
      return true
    } catch (e) {
      throw new UnauthorizedException('token失效')
    }
  }
}
