import request from '@/request'
import { Brand } from './types'

export function addBrand(data: Recordable) {
  return request.post<R>('/admin/brand/add', data)
}

export function updateBrand(data: Recordable) {
  return request.post<R>('/admin/brand/update', data)
}

export function delBrand(id: ID) {
  return request.post<R>('/admin/brand/del/' + id)
}

export function getBrand(id: ID) {
  return request.post<R<Brand>>('/admin/brand/' + id)
}

export function getBrandPage(data: Recordable) {
  return request.post<R<PageData<Brand>>>('/admin/brand/pageList', data)
}

export function getBrandList(data: Recordable) {
  return request.post<R<Brand[]>>('/admin/brand/list', data)
}
