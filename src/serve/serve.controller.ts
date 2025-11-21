import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { ServeService } from './serve.service'
import { CreateServeDto } from './dto/create-serve.dto'
import { ReviewServeDto } from './dto/review-serve.dto'
import { RequireLogin, UserInfo } from 'src/custom.decorator'
import { LoginGuard } from 'src/login.guard'

@Controller('server')
@UseGuards(LoginGuard)
export class ServeController {
  constructor(private readonly serveService: ServeService) {}

  @Post('need')
  @RequireLogin()
  async create(
    @Body() createServeDto: CreateServeDto,
    @UserInfo('userId') userId: number
  ) {
    return await this.serveService.create(createServeDto, userId)
  }

  @Get('progress')
  @RequireLogin()
  async getProgress(@UserInfo('userId') userId: number) {
    return await this.serveService.findByUserId(userId)
  }

  @Put('progress')
  @RequireLogin()
  async updateProgress(
    @Query('id') id: number,
    @Query('progress') progress: number,
    @UserInfo('userId') userId: number
  ) {
    // 检查该服务是否属于当前用户
    const serves = await this.serveService.findByUserId(userId)
    const serveExists = serves.some((serve) => serve.id === id)

    if (!serveExists) {
      return {
        success: false,
        message: '服务不存在或不属于当前用户'
      }
    }

    // 更新进度
    const result = await this.serveService.updateProgress(id, progress)
    return {
      success: true,
      message: '进度更新成功',
      data: result
    }
  }

  @Post('review')
  @RequireLogin()
  async submitReview(
    @Body() reviewDto: ReviewServeDto,
    @UserInfo('userId') userId: number
  ) {
    try {
      const result = await this.serveService.submitReview(reviewDto, userId)
      return {
        success: true,
        message: '评价提交成功',
        data: result
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}
