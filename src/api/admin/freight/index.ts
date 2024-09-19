import request from '@/request'
import { Freight, FreightListItem, FreightPageItem } from './types'

export function getFreightPage(data: Recordable) {
  return request.post<R<PageData<FreightPageItem>>>('/admin/freight/pageList', data)
}

export function getFreightList() {
  return request.post<R<FreightListItem[]>>('/admin/freight/list')
}

export function addFreight(data: Recordable) {
  return request.post<R>('/admin/freight/add', data)
}

export function updateFreight(data: Recordable) {
  return request.post<R>('/admin/freight/update', data)
}

export function delFreight(id: ID) {
  return request.post<R>('/admin/freight/del/' + id)
}

export function getFreight(id: ID) {
  return request.post<R<Freight>>('/admin/freight/' + id)
}