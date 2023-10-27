import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus
} from '@nestjs/common'
import { MeetingRoomService } from './meeting-room.service'

import { generateParseIntPipe } from 'src/utils'
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto'
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { RequireLogin } from 'src/custom.decorator'
import { MeetingRoomVo } from './vo/meeting-room.vo'
import { MeetingRoomListVo } from './vo/room-list.vo'

@ApiTags('会议室模块')
@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  // 会议室列表
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: MeetingRoomListVo
  })
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'capacity',
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'equipment',
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @RequireLogin()
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
    @Query('location') location: string,
    @Query('capacity') capacity: number
  ) {
    return await this.meetingRoomService.find(
      pageNo,
      pageSize,
      name,
      equipment,
      location,
      capacity
    )
  }

  // 创建会议室
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: MeetingRoomVo
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '会议室已存在'
  })
  @ApiBody({ type: CreateMeetingRoomDto })
  @ApiBearerAuth()
  @RequireLogin()
  @Post('create')
  async create(@Body() createMeetingRoom: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(createMeetingRoom)
  }

  // 更新会议室信息
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '会议室不存在'
  })
  @ApiBody({
    type: UpdateMeetingRoomDto
  })
  @ApiBearerAuth()
  @RequireLogin()
  @Put('update')
  async update(@Body() updateMeetingRoom: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(updateMeetingRoom)
  }

  //回显数据
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: MeetingRoomVo
  })
  @ApiBearerAuth()
  @RequireLogin()
  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id)
  }

  // 删除会议室
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success'
  })
  @ApiBearerAuth()
  @RequireLogin()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id)
  }
}
