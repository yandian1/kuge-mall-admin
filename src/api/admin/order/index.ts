import request from '@/request'
import { OrderPageItem } from './types'

export function getOrderPage(data: Recordable) {
  return request.post<R<PageData<OrderPageItem>>>('/admin/order/pageList', data)
}

export function sendGoods(data: Recordable) {
  return request.post<R>('/admin/order/sendGoods', data)
}

export function getOrder(id: ID) {
  return request.post<R>('/admin/order/' + id)
}