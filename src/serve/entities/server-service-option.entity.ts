import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm'
import { Serve } from './serve.entity'

@Entity('server_service_options')
export class ServerServiceOption {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'service_option',
    type: 'int',
    comment: '服务选项: 0-内容策划, 1-流量推广, 2-账号运营, 3-商业变现'
  })
  serviceOption: number

  @Column({
    name: 'server_id',
    type: 'int'
  })
  serverId: number

  @ManyToOne(() => Serve, { onDelete: 'CASCADE' })
  serve: Serve

  @CreateDateColumn({
    name: 'created_at',
    comment: '创建时间'
  })
  createdAt: Date
}