export type Coupon = {
  id: ID
  name: string
  type: string
  discount: number
  deduct: number
  threshold: number
  memberList: []
  spuList: []
  startTime: string
  endTime: string
}

export type CouponPageItem = {
  id: ID
  name: string
  type: string
  startTime: string
  endTime: string
}