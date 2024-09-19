export type GoodsItem = {
  id: ID
  firstImg: string
  name: string
  price: number
  createTime: string
  updateTime: string
}


export type Section = {
  title: string
  goodsList: GoodsItem[]
}

export type Activity = {
  id: ID
  name: string
  banner: string
  sections: Section[]
}

export type ActivityPageItem = {
  id: ID
  banner: string
  createTime: string
  updateTime: string
}