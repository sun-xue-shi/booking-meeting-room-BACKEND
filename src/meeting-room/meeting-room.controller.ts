import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  Post,
  Body,
  Put,
  Param,
  Delete
} from '@nestjs/common'
import { MeetingRoomService } from './meeting-room.service'

import { generateParseIntPipe } from 'src/utils'
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto'
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto'

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  // 会议室列表
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize')
    )
    pageSize: number,
    @Query('name') name: string,
    @Query('equipment') equipment: string,
    @Query('capacity') capacity: number
  ) {
    return await this.meetingRoomService.find(
      pageNo,
      pageSize,
      name,
      equipment,
      capacity
    )
  }

  // 创建会议室
  @Post('create')
  async create(@Body() createMeetingRoom: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(createMeetingRoom)
  }

  // 更新会议室信息
  @Put('update')
  async update(@Body() updateMeetingRoom: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(updateMeetingRoom)
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id)
  }
}
