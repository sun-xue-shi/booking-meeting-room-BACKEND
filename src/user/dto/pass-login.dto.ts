import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PassLoginDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  @ApiProperty()
  username: string

  @IsNotEmpty({
    message: '密码不能为空'
  })
  @ApiProperty()
  password: string
}
