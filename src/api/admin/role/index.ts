import request from '@/request'
import { Role, RoleListItem } from './types'

export function getRolePage(data: Recordable) {
  return request.post<R<PageData<Role>>>('/admin/role/pageList', data)
}

export function addRole(data: Recordable) {
  return request.post<R>('/admin/role/add', data)
}

export function updateRole(data: Recordable) {
  return request.post<R>('/admin/role/update', data)
}

export function delRole(id: number) {
  return request.post<R>('/admin/role/del/' + id)
}

export function getRole(id: ID) {
  return request.post<R<Role>>('/admin/role/' + id)
}

export function getRoleList() {
  return request.post<R<RoleListItem[]>>('/admin/role/list')
}