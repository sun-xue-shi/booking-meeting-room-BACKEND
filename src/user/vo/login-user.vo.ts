import { ApiProperty } from '@nestjs/swagger'

// 封装登录用户的返回信息
class UserInfo {
  @ApiProperty()
  id: number

  @ApiProperty({ example: 'zhangsan' })
  username: string

  @ApiProperty({ example: '张三' })
  nickName: string

  @ApiProperty({ example: 'xx@xx.com' })
  email: string

  @ApiProperty({ example: 'xx.png' })
  headPic: string

  @ApiProperty({ example: '11122233344' })
  phoneNumber: string

  @ApiProperty()
  isFrozen: boolean

  @ApiProperty()
  isAdmin: boolean

  @ApiProperty()
  createTime: string

  @ApiProperty({ example: ['管理员'] })
  roles: string[]

  @ApiProperty({ example: 'query_aaa' })
  permissions: string[]
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfo

  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}
