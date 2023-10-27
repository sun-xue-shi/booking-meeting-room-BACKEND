import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common'
import { BookingService } from './booking.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'
import { generateParseIntPipe } from 'src/utils'

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
    @Query('username') username: string,
    @Query('roomName') roomName: string,
    @Query('location') location: string,
    @Query('bookingStartTime') bookingStartTime: number,
    @Query('bookingEndTime') bookingEndTime: number
  ) {
    return await this.bookingService.find(
      pageNo,
      pageSize,
      username,
      roomName,
      location,
      bookingStartTime,
      bookingEndTime
    )
  }

  // 通过
  @Get('apply/:id')
  async apply(@Param('id') id: number) {
    return await this.bookingService.apply(id)
  }

  // 驳回
  @Get('reject/:id')
  async reject(@Param('id') id: number) {
    return await this.bookingService.reject(id)
  }

  // 解除预定
  @Get('unbind/:id')
  async unbind(@Param('id') id: number) {
    return await this.bookingService.unbind(id)
  }

  //催办
  @Get('urge/:id')
  async urge(@Param('id') id: number) {
    return await this.bookingService.urge(id)
  }
}