import request from '@/request'
import { Activity, ActivityPageItem } from './types'

export function getActivityPage(data: Recordable) {
  return request.post<R<PageData<ActivityPageItem>>>('/admin/activity/pageList', data)
}

export function addActivity(data: Recordable) {
  return request.post<R>('/admin/activity/add', data)
}

export function updateActivity(data: Recordable) {
  return request.post<R>('/admin/activity/update', data)
}

export function delActivity(id: ID) {
  return request.post<R>('/admin/activity/del/' + id)
}

export function getActivity(id: ID) {
  return request.post<R<Activity>>('/admin/activity/' + id)
}