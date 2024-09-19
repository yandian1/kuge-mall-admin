export type Seckill = {
  id: ID
  name: string
  banner: string
  timeList: Array<{
    spuList: Array<{
      id: ID
      firstImg: string
      name: string
      price: number
      createTime: string
      updateTime: string
    }>
    startTime: string
    endTime: string
  }>
}

export type SeckillPageItem = {
  id: ID
  name: string
  banner: string
  createTime: string
  updateTime: string
}