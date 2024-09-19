type SwipeItem = {
  img: string
  target: string
}

type GridItem = {
  img: string
  target: string
  title: string
}

export type SeckillItem = {
  id: ID
  name: string
  banner: string
  createTime: string
  updateTime: string
}

export type GoodsItem = {
  id: ID
  firstImg: string
  name: string
  price: number
  linePrice: number
  status: number
  statusDesc: string
  createTime: string
  updateTime: string
}

type GoodsTab = {
  title: string
  subTitle: string
  goodsList: GoodsItem[]
}

export type Homepage = {
  id: ID
  swipeList: SwipeItem[]
  gridList: GridItem[]
  seckillList: SeckillItem[]
  goodsTabs: GoodsTab[]
}
