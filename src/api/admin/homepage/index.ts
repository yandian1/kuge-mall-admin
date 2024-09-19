import request from '@/request'

export function addHomepage(data: Recordable) {
  return request.post<R>('/admin/homepage/add', data)
}

export function updateHomepage(data: Recordable) {
  return request.post<R>('/admin/homepage/update', data)
}

export function getHomepage() {
  return request.post<R<{id: ID, detail: string}>>('/admin/homepage/detail')
}
