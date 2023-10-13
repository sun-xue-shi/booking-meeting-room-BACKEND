// 封装登录用户的返回信息
interface UserInfo {
  id: number

  username: string

  nickName: string

  email: string

  headPic: string

  phoneNumber: string

  isFrozen: boolean

  isAdmin: boolean

  createTime: string

  roles: string[]

  permissions: string[]
}

export class LoginUserVo {
  userInfo: UserInfo

  accessToken: string

  refreshToken: string
}
