import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Booking } from 'src/booking/entities/booking.entity'
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity'
import { User } from 'src/user/entities/user.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private entityManager: EntityManager

  // 用户预定次数
  async bookingCount(startTime: string, endTime: string) {
    console.log(startTime)

    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('u.id', 'userId')
      .addSelect('u.username', 'username')
      .leftJoin(User, 'u', 'b.userId = u.id')
      .addSelect('count(1)', 'bookingCount')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime
      })
      .addGroupBy('b.userId')
      .getRawMany()

    return res
  }

  // 房间预定次数
  async roomUsedCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('m.id', 'meetingRoomId')
      .addSelect('m.name', 'meetingRoomName')
      .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
      .addSelect('count(1)', 'usedCount')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime
      })
      .addGroupBy('b.roomId')
      .getRawMany()
    return res
  }

  async bookingThemeCount(startTime: string, endTime: string) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('b.theme', 'bookingTheme')
      .addSelect('count(1)', 'themeCount')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime
      })
      .addGroupBy('b.theme')
      .getRawMany()

    return res
  }
}
