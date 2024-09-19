import request from '@/request'
import { SpuPageItem, SpuDetail } from './types'

export function getSpuPage(data: Recordable) {
  return request.post<R<PageData<SpuPageItem>>>('/admin/spu/pageList', data)
}

export function addSpu(data: Recordable) {
  return request.post<R>('/admin/spu/add', data)
}

export function updateSpu(data: Recordable) {
  return request.post<R>('/admin/spu/update', data)
}

export function delSpu(id: ID) {
  return request.post<R>('/admin/spu/del/' + id)
}

export function getSpu(id: ID) {
  return request.post<R<SpuDetail>>('/admin/spu/' + id)
}

export function changeSpuStatus(data: Recordable) {
  return request.post<R<SpuDetail>>('/admin/spu/changeStatus', data)
}
