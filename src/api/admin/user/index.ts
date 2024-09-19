import request from '@/request'
import { User, UserPageItem } from './types'

export function getUserPage(data: Recordable) {
  return request.post<R<PageData<UserPageItem>>>('/admin/user/pageList', data)
}

export function addUser(data: Recordable) {
  return request.post<R>('/admin/user/add', data)
}

export function updateUser(data: Recordable) {
  return request.post<R>('/admin/user/update', data)
}

export function delUser(id: number) {
  return request.post<R>('/admin/user/del/' + id)
}

export function changeStatus(data: Recordable) {
  return request.post<R>('/admin/user/changeStatus', data)
}

export function getUser(id: ID) {
  return request.post<R<User>>('/admin/user/' + id)
}

export function updatePwd(data: Recordable) {
  return request.post<R>('/admin/user/update/pwd', data)
}