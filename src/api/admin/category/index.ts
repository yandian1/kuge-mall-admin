import request from '@/request'
import { CategoryDetail, CategoryPageItem, CategoryTreeItem } from './types'

export function getCategoryPage(data: Recordable) {
  return request.post<R<PageData<CategoryPageItem>>>('/admin/category/pageList', data)
}

export function addCategory(data: Recordable) {
  return request.post<R>('/admin/category/add', data)
}

export function updateCategory(data: Recordable) {
  return request.post<R>('/admin/category/update', data)
}

export function delCategory(id: ID) {
  return request.post<R>('/admin/category/del/' + id)
}

export function getCategory(id: ID) {
  return request.post<R<CategoryDetail>>('/admin/category/' + id)
}

export function getCategoryTree() {
  return request.post<R<CategoryTreeItem[]>>('/admin/category/tree')
}
