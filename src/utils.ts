import * as cypto from 'crypto'

export function md5(str: string) {
  const hash = cypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}
