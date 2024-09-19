export type OrderPageItem = {
  id: ID
  sn: string
  phone: string
  status: number
  statusDesc: string
  payStatus: number
  payStatusDesc: string
  createTime: string
  updateTime: string
  orderItems: OrderItem[]
}

export type OrderItem = {
  id: ID
  name: string
  attrs: string
  img: string
  num: number
  status: number
  statusDesc: string
}

export type OrderDetail = {
  shopName: string
  orderId: ID
  sn: string
  price: string
  status: number
  statusDesc: string
  payStatus: number
  payStatusDesc: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  orderGoodsList: Array<{
    id: ID
    name: string
    attrs: string
    img: string
    num: number
    price: string
    status: number
    statusDesc: string
    payStatus: number
    payStatusDesc: string
    deliveryCompany: string
    deliverySn: string
  }>
}
