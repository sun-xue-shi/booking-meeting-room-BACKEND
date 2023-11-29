import { Module } from '@nestjs/common'
import { StatisticService } from './statistic.service'

@Module({
  providers: [StatisticService]
})
export class StatisticModule {}
