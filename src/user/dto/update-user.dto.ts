import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ description: '所在行业' })
  industry: string

  @ApiProperty({ description: '抖音账号' })
  douyinAccount: string

  @ApiProperty({ description: '联系方式' })
  contactInfo: string

  @ApiProperty({ description: '用户名' })
  username: string

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({
    message: '邮箱不能为空'
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式'
    }
  )
  email: string

  @ApiProperty({
    description: '目标需求',
    enum: ['0', '1', '2', '3', '4'],
    isArray: true
  })
  targetRequirements: string[]

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({
    message: '验证码不能为空'
  })
  captcha: string
}
