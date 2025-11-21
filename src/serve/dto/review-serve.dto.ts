import { IsNotEmpty, IsInt, Min, Max, IsString } from 'class-validator'

export class ReviewServeDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @IsNotEmpty()
  @IsString()
  content: string
}
