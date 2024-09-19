import request from '@/request'
import { Coupon, CouponPageItem } from './types'

export function getCouponPage(data: Recordable) {
  return request.post<R<PageData<CouponPageItem>>>('/admin/coupon/pageList', data)
}

export function addCoupon(data: Recordable) {
  return request.post<R>('/admin/coupon/add', data)
}

export function updateCoupon(data: Recordable) {
  return request.post<R>('/admin/coupon/update', data)
}

export function delCoupon(id: ID) {
  return request.post<R>('/admin/coupon/del/' + id)
}

export function getCoupon(id: ID) {
  return request.post<R<Coupon>>('/admin/coupon/' + id)
}