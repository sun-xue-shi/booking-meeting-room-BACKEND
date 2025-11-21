import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { ServerServiceOption } from './server-service-option.entity'

export enum ServiceProgress {
  SUBMITTED = 0, // 已提交需求
  CONNECTED = 1, // 已对接运营团队
  INCUBATING = 2, // 孵化中
  COMPLETED = 3 // 服务完成
}

@Entity('server') // 对应数据库表名
export class Serve {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'package_option',
    type: 'int',
    comment: '套餐选项: 0-特色套餐, 1-素人启航套餐, 2-IP成长套餐, 3-IP变现套餐'
  })
  packageOption: number

  // 注意：这个字段在新的设计中不再直接使用，但我们保留它以保持向后兼容性
  @Column({
    name: 'service_option',
    type: 'int',
    comment: '服务选项: 0-内容策划, 1-流量推广, 2-账号运营, 3-商业变现',
    nullable: true
  })
  serviceOption: number

  @Column({
    name: 'service_options_string',
    type: 'varchar',
    length: 255,
    comment: '服务选项字符串格式: 例如 "1,2"',
    nullable: true
  })
  serviceOptionsString: string

  @Column({
    name: 'description',
    type: 'text',
    comment: '具体需求描述'
  })
  description: string

  @Column({
    name: 'contact_name',
    type: 'varchar',
    length: 50,
    comment: '联系人姓名'
  })
  contactName: string

  @Column({
    name: 'contact_info',
    type: 'varchar',
    length: 100,
    comment: '联系方式'
  })
  contactInfo: string

  @Column({
    name: 'progress',
    type: 'int',
    default: 0,
    comment: '服务进度: 0-已提交需求, 1-已对接运营团队, 2-孵化中, 3-服务完成'
  })
  progress: number

  @Column({
    name: 'rating',
    type: 'int',
    nullable: true,
    comment: '评价星级: 1-5星'
  })
  rating: number

  @Column({
    name: 'review_content',
    type: 'text',
    nullable: true,
    comment: '评价内容'
  })
  reviewContent: string

  @Column({
    name: 'reviewed_at',
    type: 'datetime',
    nullable: true,
    comment: '评价时间'
  })
  reviewedAt: Date

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
    comment: '关联的用户ID'
  })
  userId: number

  @OneToMany(() => ServerServiceOption, option => option.serve)
  serviceOptions: ServerServiceOption[]

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '更新时间'
  })
  updatedAt: Date
}
