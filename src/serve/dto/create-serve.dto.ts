import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsNumber,
  IsOptional,
  IsArray
} from 'class-validator'

// 套餐选项
const packageOptions = [
  { label: '特色套餐', value: 0 },
  { label: '素人启航套餐', value: 1 },
  { label: 'IP成长套餐', value: 2 },
  { label: 'IP变现套餐', value: 3 }
]

// 服务选项
const serviceOptions = [
  { label: '内容策划', value: 0 },
  { label: '流量推广', value: 1 },
  { label: '账号运营', value: 2 },
  { label: '商业变现', value: 3 }
]

// 服务进度选项
export enum ServiceProgress {
  SUBMITTED = 0, // 已提交需求
  CONNECTED = 1, // 已对接运营团队
  INCUBATING = 2, // 孵化中
  COMPLETED = 3 // 服务完成
}

const packageValues = packageOptions.map((option) => option.value)
const serviceValues = serviceOptions.map((option) => option.value)

export class CreateServeDto {
  @IsNotEmpty()
  @IsNumber()
  @IsIn(packageValues)
  packageOption: number

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsIn(serviceValues, { each: true })
  serviceOption: number[]

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  contactName: string

  @IsNotEmpty()
  @IsString()
  contactInfo: string

  @IsOptional()
  @IsNumber()
  userId?: number

  @IsOptional()
  @IsNumber()
  progress?: number = ServiceProgress.SUBMITTED
}
