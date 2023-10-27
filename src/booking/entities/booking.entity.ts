import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    comment: '会议开始时间'
  })
  startTime: Date

  @Column({
    comment: '会议结束时间'
  })
  endTime: Date

  @Column({
    comment: '审批状态(申请中，通过，驳回，解除)',
    default: '申请中'
  })
  status: string

  @Column({
    comment: '备注',
    default: ''
  })
  note: string

  @ManyToOne(() => MeetingRoom)
  room: MeetingRoom

  @ManyToOne(() => User)
  user: User

  @CreateDateColumn({
    comment: '创建时间'
  })
  createTime: Date

  @UpdateDateColumn({
    comment: '更新时间'
  })
  updateTime: Date
}
