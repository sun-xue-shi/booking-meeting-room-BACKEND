import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from './role.entity'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    comment: '用户名',
    length: 50
  })
  username: string

  @Column({
    comment: '密码',
    length: 50
  })
  password: string

  @Column({
    comment: '头像',
    length: 100
  })
  head_pic: string

  @Column({
    comment: '邮箱',
    length: 50
  })
  email: string

  @Column({
    comment: '昵称',
    length: 50
  })
  nick_name: string

  @Column({
    comment: '手机号',
    length: 20
  })
  phone: string

  @Column({
    comment: '是否冻结'
  })
  is_frozen: boolean

  @Column({
    comment: '是否是管理员'
  })
  is_admin: boolean

  @CreateDateColumn({
    comment: '创建时间'
  })
  create_time: string

  @UpdateDateColumn({
    comment: '更新时间'
  })
  update_time: string

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role'
  })
  roles: Role[]
}
