import { ApiProperty } from '@nestjs/swagger'

export class BookingThemeCount {
  //   @ApiProperty()
  //   bookingId: string

  @ApiProperty()
  theme: string

  @ApiProperty()
  themeCount: number
}
