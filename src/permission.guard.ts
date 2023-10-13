import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    if (!request.user) {
      return true
    }

    const permissions = request.user.permissions

    const requirePermission = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()]
    )

    if (!requirePermission) {
      return true
    }

    for (let i = 0; i < requirePermission.length; i++) {
      const find = permissions.find(
        (item) => item.code === requirePermission[i]
      )
      if (!find) {
        throw new UnauthorizedException('没有权限')
      }
    }
    return true
  }
}
