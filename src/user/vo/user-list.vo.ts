import { ApiProperty } from '@nestjs/swagger'

class User {
  @ApiProperty()
  id: number

  @ApiProperty()
  username: string

  @ApiProperty()
  nick_name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  is_frozen: boolean

  @ApiProperty()
  head_pic: string

  @ApiProperty()
  create_time: string
}

export class UserListVo {
  @ApiProperty({
    type: [User]
  })
  users: User[]

  @ApiProperty()
  totalCount: number
}
