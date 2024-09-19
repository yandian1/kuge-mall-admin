import request from '@/request'
import { Seckill, SeckillPageItem } from './types'

export function getSeckillPage(data: Recordable) {
  return request.post<R<PageData<SeckillPageItem>>>('/admin/seckill/pageList', data)
}

export function addSeckill(data: Recordable) {
  return request.post<R>('/admin/seckill/add', data)
}

export function updateSeckill(data: Recordable) {
  return request.post<R>('/admin/seckill/update', data)
}

export function delSeckill(id: ID) {
  return request.post<R>('/admin/seckill/del/' + id)
}

export function getSeckill(id: ID) {
  return request.post<R<Seckill>>('/admin/seckill/' + id)
}