import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Booking } from './entities/booking.entity'
import {
  Between,
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual
} from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity'
import { User } from 'src/user/entities/user.entity'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from 'src/email/email.service'
import { CreateBookingDto } from './dto/create-booking.dto'

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager

  @Inject(RedisService)
  private redisService: RedisService

  @Inject(EmailService)
  private emailService: EmailService

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 15
    })
    const user2 = await this.entityManager.findOneBy(User, {
      id: 16
    })

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 12
    })
    const room2 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 13
    })

    const booking1 = new Booking()
    booking1.room = room1
    booking1.user = user1
    booking1.startTime = new Date()
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Booking, booking1)

    const booking2 = new Booking()
    booking2.room = room2
    booking2.user = user2
    booking2.startTime = new Date()
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Booking, booking2)

    const booking3 = new Booking()
    booking3.room = room1
    booking3.user = user2
    booking3.startTime = new Date()
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Booking, booking3)

    const booking4 = new Booking()
    booking4.room = room2
    booking4.user = user1
    booking4.startTime = new Date()
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Booking, booking4)
  }

  //预定管理-显示预定列表
  async find(
    pageNo: number,
    pageSize: number,
    username: string,
    meetingRoomName: string,
    theme: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number
  ) {
    const skipCount = (pageNo - 1) * pageSize
    const condition: Record<string, any> = {}

    if (username) {
      condition.user = {
        username: Like(`%${username}%`)
      }
    }
    if (theme) {
      condition.theme = {
        theme: Like(`%${theme}%`)
      }
    }
    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`)
      }
    }

    if (meetingRoomPosition) {
      if (!condition.room) {
        condition.room = {}
      }
      condition.room.location = Like(`%${meetingRoomPosition}%`)
    }

    if (bookingTimeRangeStart) {
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000
      }
      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd)
      )
    }

    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        where: condition,
        relations: {
          user: true,
          room: true
        },
        skip: skipCount,
        take: pageSize
      }
    )

    console.log(bookings)

    return {
      bookings: bookings.map((item) => {
        delete item.user.password
        return item
      }),
      totalCount
    }
  }

  // 通过审批
  async apply(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id
      },
      {
        status: '审批通过'
      }
    )

    return 'success'
  }

  // 驳回审批
  async reject(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id
      },
      {
        status: '审批驳回'
      }
    )

    return 'success'
  }

  // 通过审批
  async unbind(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id
      },
      {
        status: '已解除'
      }
    )

    return 'success'
  }

  // 催办
  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id)

    if (flag) {
      return '30min内只能催办一次哦'
    }

    let email = await this.redisService.get('admin_email')

    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true
        },
        where: {
          is_admin: true
        }
      })

      email = admin.email

      this.redisService.set('admin_email', admin.email)
    }

    this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id为${id}的预定申请正在等待你的审批`
    })

    this.redisService.set('urge_' + id, 1, 60 * 30)
  }

  // 添加预定
  async add(bookingToDo: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: bookingToDo.meetingRoomId
    })

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在')
    }

    const user = await this.entityManager.findOneBy(User, {
      id: userId
    })

    const booking = new Booking()
    booking.room = meetingRoom
    booking.theme = bookingToDo.theme
    booking.note = bookingToDo.note
    booking.startTime = new Date(bookingToDo.startTime)
    booking.endTime = new Date(bookingToDo.endTime)
    booking.user = user

    const res = await this.entityManager.findOneBy(Booking, {
      room: meetingRoom,
      endTime: MoreThanOrEqual(booking.endTime),
      startTime: LessThanOrEqual(booking.startTime)
    })

    if (res) {
      throw new BadRequestException('该时间段已被预定')
    }

    console.log('-------')

    console.log(booking.note)

    await this.entityManager.save(Booking, booking)
  }
}
