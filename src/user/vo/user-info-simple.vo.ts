import { ApiProperty } from '@nestjs/swagger'

export class UserInfoSimpleVo {
  @ApiProperty()
  id: number

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty({ description: '所在行业' })
  industry: string

  @ApiProperty({ description: '联系方式' })
  contactInfo: string

  @ApiProperty({ description: '抖音账号' })
  douyinAccount: string

  @ApiProperty({ description: '目标需求', isArray: true })
  targetRequirements: string[]
}
