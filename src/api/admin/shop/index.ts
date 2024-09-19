import request from '@/request'
import { Shop, ShopPageItem } from './types'

export function addShop(data: Recordable) {
  return request.post<R>('/admin/shop/add', data)
}

export function updateShop(data: Recordable) {
  return request.post<R>('/admin/shop/update', data)
}

export function delShop(id: ID) {
  return request.post<R>('/admin/shop/del/' + id)
}

export function getShop(id: ID) {
  return request.post<R<Shop>>('/admin/shop/' + id)
}

export function getShopPage(data: Recordable) {
  return request.post<R<PageData<ShopPageItem>>>('/admin/shop/pageList', data)
}

export function getShopList() {
  return request.post<R<Shop[]>>('/admin/shop/list')
}