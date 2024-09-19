export type AfterSale = {
  id: ID
  userId: ID
  orderId: ID
  orderItemId: ID
  sn: string
  skuName: string
  skuNum: number
  skuPrice: number
  skuAttrs: string
  skuImg: string
  type: string
  reason: string
  status: string
  applyAmount: number
  actualAmount: number
  deliveryCompany: string
  deliverySn: string
  statusDesc: string
  createTime: string
}
