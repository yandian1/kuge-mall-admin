import request from '@/request'
import { AdminInfo } from './types'

export function login(data: Recordable) {
  return request.post<R<AdminInfo>>('/auth/login/admin', data)
}

export function logout() {
  return request.post<R>('/auth/logout/admin')
}

export function getAdminInfo() {
  return request.post<R<AdminInfo>>('/auth/info/admin')
}
