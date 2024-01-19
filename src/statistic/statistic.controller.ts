import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserBookignCount } from './vo/UserBookignCount.vo'
import { MeetingRoomUsedCount } from './vo/MeetingRoomUsedCount .vo'
import { BookingThemeCount } from './vo/BookingThemeCount'

@ApiTags('统计管理模块')
@Controller('statistic')
export class StatisticController {
  @Inject(StatisticService)
  private statisticService: StatisticService

  // 用户预定次数
  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: '开始时间'
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: '结束时间'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBookignCount
  })
  @Get('bookingCount')
  async userBookingCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ) {
    return this.statisticService.bookingCount(startTime, endTime)
  }

  // 会议室预定次数
  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: '开始时间'
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: '结束时间'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MeetingRoomUsedCount
  })
  @Get('roomUsedCount')
  async meetingRoomUsedCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ) {
    return this.statisticService.roomUsedCount(startTime, endTime)
  }

  // 会议主题次数
  @ApiBearerAuth()
  @ApiQuery({
    name: 'startTime',
    type: String,
    description: '开始时间'
  })
  @ApiQuery({
    name: 'endTime',
    type: String,
    description: '结束时间'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookingThemeCount
  })
  @Get('bookingThemeCount')
  async bookingThemeCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ) {
    return this.statisticService.bookingThemeCount(startTime, endTime)
  }
}
