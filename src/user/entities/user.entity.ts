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
    default: '',
    unique: true,
    length: 50,
    nullable: false
  })
  username: string

  @Column({
    comment: '密码',
    default: '',
    length: 50,
    nullable: false
  })
  password: string

  @Column({
    comment: '头像',
    default: '',
    length: 100,
    nullable: true
  })
  head_pic: string

  @Column({
    comment: '邮箱',
    default: null,
    length: 50,
    nullable: true
  })
  email: string

  @Column({
    comment: '昵称',
    default: '11',
    length: 50,
    nullable: true
  })
  nick_name: string

  @Column({
    comment: '手机号',
    default: null,
    // unique: true,
    length: 20,
    nullable: true
  })
  phone: string

  @Column({
    comment: '是否冻结',
    default: false
  })
  is_frozen: boolean

  @Column({
    comment: '是否是管理员',
    default: false
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
  phoneNumber: string
}
