import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { MeetingRoom } from './entities/meeting-room.entity'
import { EntityManager, Like, Repository } from 'typeorm'
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto'
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto'
import { Booking } from 'src/booking/entities/booking.entity'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>

  @InjectEntityManager()
  entityManager: EntityManager

  initData() {
    const room1 = new MeetingRoom()
    room1.name = '一号会议室'
    room1.capacity = 10
    room1.equipment = '白板'
    room1.location = '一层西'

    const room2 = new MeetingRoom()
    room2.name = '三号报告厅'
    room2.capacity = 5
    room2.equipment = ''
    room2.location = '二层东'

    const room3 = new MeetingRoom()
    room3.name = '六号研讨室'
    room3.capacity = 30
    room3.equipment = '白板，电视'
    room3.location = '三层东'

    this.repository.insert([room1, room2, room3])
  }

  // 查找所有会议室-形成列表
  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    equipment: string,
    location: string,
    capacity: number,
    userId: number
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码不能小于1')
    }

    const skipCount = (pageNo - 1) * pageSize

    const condition: Record<string, any> = {}

    if (name) {
      condition.name = Like(`%${name}%`)
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`)
    }
    if (location) {
      condition.location = Like(`%${location}%`)
    }
    if (capacity) {
      condition.capacity = capacity
    }

    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition
    })

    const user = await this.entityManager.findOneBy(User, {
      id: userId
    })

    return {
      meetingRooms,
      totalCount,
      user
    }
  }

  // 创建会议室
  async create(createMeetingRoom: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: createMeetingRoom.name
    })

    if (room) {
      throw new BadRequestException('会议室已存在')
    }

    return await this.repository.save(createMeetingRoom)
  }

  // 更新会议室
  async update(updateMeetingRoom: UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id: updateMeetingRoom.id
    })

    if (!room) {
      throw new BadRequestException('会议室不存在')
    }

    room.capacity = updateMeetingRoom.capacity
    room.location = updateMeetingRoom.location
    room.name = updateMeetingRoom.name
    room.equipment = updateMeetingRoom.equipment
    room.description = updateMeetingRoom.description

    await this.repository.update(
      {
        id: room.id
      },
      room
    )

    return '更新成功'
  }

  // 根据id查找会议室-回显数据
  async findById(id: number) {
    return this.repository.findOneBy({
      id
    })
  }

  // 根据id删除会议室
  async delete(id: number) {
    const bookings = await this.entityManager.findBy(Booking, {
      room: {
        id: id
      }
    })

    for (let i = 0; i < bookings.length; i++) {
      this.entityManager.delete(Booking, bookings[i].id)
    }
    await this.repository.delete(id)
    return 'success'
  }
}
