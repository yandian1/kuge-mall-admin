import request from '@/request'
import { AfterSale } from './types'

export function getAfterSalePage(data: Recordable) {
  return request.post<R<PageData<AfterSale>>>('/admin/afterSale/pageList', data)
}

export function getAfterSale(id: ID) {
  return request.post<R<AfterSale>>('/admin/afterSale/' + id)
}

export function updateAfterSale(data: Recordable) {
  return request.post<R>('/admin/afterSale/update', data)
}