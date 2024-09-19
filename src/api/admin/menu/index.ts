import request from '@/request'
import { Menu, MenuPageItem, MenuTreeItem } from './types'

export function getMenuPage(data: Recordable) {
  return request.post<R<PageData<MenuPageItem>>>('/admin/menu/pageList', data)
}

export function addMenu(data: Recordable) {
  return request.post<R>('/admin/menu/add', data)
}

export function updateMenu(data: Recordable) {
  return request.post<R>('/admin/menu/update', data)
}

export function delMenu(id: number) {
  return request.post<R>('/admin/menu/del/' + id)
}

export function getMenu(id: ID) {
  return request.post<R<Menu>>('/admin/menu/' + id)
}

export function getMenuTree() {
  return request.post<R<MenuTreeItem[]>>('/admin/menu/tree')
}