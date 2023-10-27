import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateMeetingRoomDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '会议室名称不能为空'
  })
  @MaxLength(10, {
    message: '会议室名称最长为10个字符'
  })
  name: string

  @ApiProperty()
  @IsNotEmpty({
    message: '会议室容量不能为空'
  })
  capacity: number

  @IsNotEmpty({
    message: '会议室位置不能为空'
  })
  @MaxLength(50, {
    message: '会议室位置最长为50个字符'
  })
  @ApiProperty()
  location: string

  @IsNotEmpty({
    message: '会议室设备不能为空'
  })
  @MaxLength(50, {
    message: '会议室设备最长为50个字符'
  })
  @ApiProperty()
  equipment: string

  @MaxLength(100, {
    message: '会议室描述最长为100个字符'
  })
  @ApiProperty()
  description: string
}
