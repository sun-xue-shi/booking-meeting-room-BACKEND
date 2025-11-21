import { Injectable } from '@nestjs/common'
import { CreateServeDto } from './dto/create-serve.dto'
import { ReviewServeDto } from './dto/review-serve.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Serve } from './entities/serve.entity'
import { ServerServiceOption } from './entities/server-service-option.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ServeService {
  constructor(
    @InjectRepository(Serve)
    private serveRepository: Repository<Serve>
  ) {}

  async create(createServeDto: CreateServeDto, userId?: number) {
    const serve = new Serve()
    serve.packageOption = createServeDto.packageOption
    // 注意：我们不再直接使用serve.serviceOption，而是使用关联表
    serve.description = createServeDto.description
    serve.contactName = createServeDto.contactName
    serve.contactInfo = createServeDto.contactInfo

    // 设置默认进度为已提交需求
    serve.progress = CreateServeDto.prototype.progress

    // 如果通过DTO传递了userId，则使用DTO中的userId
    if (createServeDto.userId) {
      serve.userId = createServeDto.userId
    }
    // 否则如果通过参数传递了userId（来自登录装饰器），则使用参数中的userId
    else if (userId) {
      serve.userId = userId
    }

    // 处理数组格式的服务选项
    if (createServeDto.serviceOption && Array.isArray(createServeDto.serviceOption)) {
      // 转换为逗号分隔的字符串存储
      serve.serviceOptionsString = createServeDto.serviceOption.join(',');
      
      // 创建关联记录
      const serviceOptions = createServeDto.serviceOption.map(optionId => {
        const serviceOption = new ServerServiceOption();
        serviceOption.serviceOption = optionId;
        // 注意：这里暂时不设置serve和serverId，因为serve还没有保存，没有ID
        return serviceOption;
      });

      // 先保存服务主体以获得ID
      const savedServe = await this.serveRepository.save(serve);

      // 设置关联关系并保存服务选项
      const serviceOptionsWithRelation = serviceOptions.map(option => {
        option.serve = savedServe;
        option.serverId = savedServe.id;
        return option;
      });

      // 批量保存服务选项
      await this.serveRepository.manager.save(serviceOptionsWithRelation);

      return savedServe;
    }

    return await this.serveRepository.save(serve);
  }

  async findByUserId(userId: number) {
    return await this.serveRepository.find({
      where: {
        userId: userId
      }
    })
  }

  async updateProgress(id: number, progress: number) {
    return await this.serveRepository.update(id, {
      progress: progress
    })
  }

  async submitReview(reviewDto: ReviewServeDto, userId: number) {
    // 查找用户的服务（假设每个用户只有一个服务）
    const serve = await this.serveRepository.findOne({
      where: {
        userId: userId
      }
    })

    if (!serve) {
      throw new Error('用户尚未创建服务')
    }

    // 更新评价信息
    serve.rating = reviewDto.rating
    serve.reviewContent = reviewDto.content
    serve.reviewedAt = new Date()

    return await this.serveRepository.save(serve)
  }
}
