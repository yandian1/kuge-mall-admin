export type Sku = {
  price: number
  linePrice: number
  stock: number
  weight: number
  attrs: string
}

export type Attr = {
  name: string
  children: Attr[]
}

export type SpuPageItem = {
  id: ID
  name: string
  price: number
  linePrice: number
  status: number
  statusDesc: string
  firstImg: string
  brandName: string
  categoryName: string
  createTime: string
  updateTime: string
}

export type SpuDetail = {
  id: ID
  shopId: ID
  brandId: ID
  categoryIds: ID[]
  serviceIds: ID[]
  freightId: ID
  name: string
  price: number
  linePrice: number
  firstImg: string
  intro: string
  detail: string
  imgList: string[]
  skus: Sku[]
  attrs: Attr[]
}
