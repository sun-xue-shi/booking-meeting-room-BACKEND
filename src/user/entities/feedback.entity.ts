import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity({
  name: 'feedback'
})
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    comment: '遇到的问题',
    type: 'text',
    nullable: false
  })
  issue: string

  @Column({
    comment: '改进建议',
    type: 'text',
    nullable: true
  })
  suggestion: string

  @Column({
    comment: '联系方式',
    length: 100,
    nullable: true
  })
  contact: string

  @CreateDateColumn({
    comment: '创建时间'
  })
  create_time: Date

  @ManyToOne(() => User, user => user.feedbacks)
  user: User

  @UpdateDateColumn({
    comment: '更新时间'
  })
  update_time: Date
}