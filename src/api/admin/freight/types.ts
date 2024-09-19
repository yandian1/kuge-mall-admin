export type Freight = {
  id: ID
  name: string
  type: string
  firstWeight: number
  firstWeightFee: number
  continueWeight: number
  continueWeightFee: number
  firstItem: number
  firstItemFee: number
  continueItem: number
  continueItemFee: number
  createTime: string
  updateTime: string
}

export type FreightPageItem = {
  id: ID
  name: string
  type: string
  createTime: string
  updateTime: string
}

export type FreightListItem = {
  id: ID
  name: string
}