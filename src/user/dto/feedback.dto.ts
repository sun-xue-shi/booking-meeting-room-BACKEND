import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class FeedbackDto {
  @IsNotEmpty({
    message: '遇到的问题不能为空'
  })
  @IsString()
  @MaxLength(1000, {
    message: '遇到的问题不能超过1000个字符'
  })
  @ApiProperty({
    description: '遇到的问题（必填）',
    example: '无法正常提交需求'
  })
  issue: string

  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: '改进建议不能超过1000个字符'
  })
  @ApiProperty({
    description: '改进建议（可选）',
    example: '希望增加xxx功能',
    required: false
  })
  suggestion?: string

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: '联系方式不能超过100个字符'
  })
  @ApiProperty({
    description: '联系方式（手机号或邮箱，可选）',
    example: 'user@example.com 或 13800138000',
    required: false
  })
  contact?: string
}
