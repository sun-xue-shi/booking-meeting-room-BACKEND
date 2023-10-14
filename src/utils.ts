import { BadRequestException, ParseIntPipe } from '@nestjs/common'
import * as cypto from 'crypto'

export function md5(str: string) {
  const hash = cypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + '应该为数字')
    }
  })
}
