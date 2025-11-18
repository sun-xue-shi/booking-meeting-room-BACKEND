import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { IpService } from './ip.service'

@ApiTags('IP诊断模块')
@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @ApiOperation({ summary: '获取IP诊断建议' })
  @ApiQuery({
    name: 'score',
    type: Number,
    description: 'IP评分（总分）',
    required: true,
    example: 55
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '诊断建议',
    schema: {
      type: 'object',
      properties: {
        level: { type: 'string', example: '优秀级' },
        conclusion: {
          type: 'string',
          example: '您的IP属于"优质基层劳动者IP"...'
        },
        suggestion: { type: 'string', example: '建议重点推进好物严选合作...' }
      }
    }
  })
  @Get('suggest')
  getSuggestion(@Query('score') score: number) {
    if (score === undefined || score === null || isNaN(score)) {
      throw new HttpException(
        'score参数不能为空且必须为数字',
        HttpStatus.BAD_REQUEST
      )
    }

    return this.ipService.getSuggestion(score)
  }
}
